//@ts-nocheck
import { teamModel } from "@/app/models/team-model";
import { Match } from "@/app/models/match-model";
import Tournament from "@/app/models/tournament-model";
import dbconnect from "@/lib/db_connect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";


export async function POST(req: NextRequest, {params} : {params: {temptournamentId: string}}) {
    const ObjectId = mongoose.Types.ObjectId;
    const { temptournamentId } =await params;
    if (!temptournamentId) {
        return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }
    const tournamentId = new ObjectId(temptournamentId);

    if (!tournamentId) {
        return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }

    try {
        await dbconnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }

        // Prevent regenerating matches if they already exist
        const existingMatches = await Match.find({ tournamentId: tournamentId });
        if (existingMatches.length > 0) {
            return NextResponse.json({ error: 'Matches for this tournament have already been generated' }, { status: 400 });
        }

        // Remove duplicate team IDs
        let teamIds = Array.from(new Set(tournament.registered_teams.map(id => id.toString())));
        if (teamIds.length < 2) {
            return NextResponse.json({ error: 'At least two unique teams are required' }, { status: 400 });
        }

        // Get all team details
        const teams = await teamModel.find({ '_id': { $in: teamIds } });
        const teamMap = new Map(teams.map(team => [team._id.toString(), team]));

        // --- FULL BRACKET GENERATION LOGIC ---
        const numTeams = teamIds.length;
        const numRounds = Math.ceil(Math.log2(numTeams));
        const totalSlots = Math.pow(2, numRounds); // e.g. 8 teams => 8, 12 teams => 16
        const numByes = totalSlots - numTeams;
        const startDate = new Date(tournament.start_date);
        const endDate = new Date(tournament.end_date);
        const daysPerRound = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (numRounds * 1000 * 60 * 60 * 24)));
        // Shuffle teams
        const shuffledTeams = [...teamIds].sort(() => Math.random() - 0.5);

        // Prepare all matches for all rounds
        let matchId = 1;
        let matches = [];
        let roundMatches = [];
        let prevRoundMatchIds = [];
        let teamIdx = 0;
        // --- ROUND 1 ---
        for (let i = 0; i < totalSlots / 2; i++) {
            let participants = [];
            let team1 = null, team2 = null;
            // Assign teams or byes
            if (teamIdx < shuffledTeams.length) {
                team1 = teamMap.get(shuffledTeams[teamIdx++]);
                participants.push({
                    id: team1._id.toString(),
                    name: team1.team_name,
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                });
            } else {
                participants.push({
                    id: `BYE`,
                    name: 'BYE',
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                });
            }
            if (teamIdx < shuffledTeams.length) {
                team2 = teamMap.get(shuffledTeams[teamIdx++]);
                participants.push({
                    id: team2._id.toString(),
                    name: team2.team_name,
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                });
            } else {
                participants.push({
                    id: `BYE`,
                    name: 'BYE',
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                });
            }
            const match = new Match({
                id: matchId,
                name: `Match ${matchId}`,
                tournamentId: tournamentId,
                nextMatchId: null, // to be filled later
                tournamentRoundText: `Round 1`,
                startTime: new Date(startDate.getTime()).toISOString(),
                state: 'PENDING',
                participants,
                team1Score: null,
                team2Score: null
            });
            matches.push(match);
            roundMatches.push(matchId);
            matchId++;
        }
        // --- SUBSEQUENT ROUNDS ---
        let prevRound = roundMatches;
        for (let r = 2; r <= numRounds; r++) {
            let thisRound = [];
            for (let i = 0; i < prevRound.length / 2; i++) {
                // Placeholders for participants
                const p1 = {
                    id: `W${prevRound[i * 2]}`,
                    name: `Winner of Match ${prevRound[i * 2]}`,
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                };
                const p2 = {
                    id: `W${prevRound[i * 2 + 1]}`,
                    name: `Winner of Match ${prevRound[i * 2 + 1]}`,
                    isWinner: false,
                    status: 'PENDING',
                    resultText: null
                };
                const match = new Match({
                    id: matchId,
                    name: `Match ${matchId}`,
                    tournamentId: tournamentId,
                    nextMatchId: null, // to be filled later
                    tournamentRoundText: r === numRounds ? 'Final' : `Round ${r}`,
                    startTime: new Date(startDate.getTime() + (r - 1) * daysPerRound * 24 * 60 * 60 * 1000).toISOString(),
                    state: 'PENDING',
                    participants: [p1, p2],
                    team1Score: null,
                    team2Score: null
                });
                matches.push(match);
                thisRound.push(matchId);
                matchId++;
            }
            prevRound = thisRound;
        }
        // --- LINK MATCHES (set nextMatchId) ---
        let allRounds = [];
        let idx = 0;
        let roundSize = totalSlots / 2;
        for (let r = 1; r <= numRounds; r++) {
            let round = [];
            for (let i = 0; i < roundSize; i++) {
                round.push(matches[idx]);
                idx++;
            }
            allRounds.push(round);
            roundSize = Math.floor(roundSize / 2);
        }
        for (let r = 0; r < allRounds.length - 1; r++) {
            for (let i = 0; i < allRounds[r].length; i++) {
                const thisMatch = allRounds[r][i];
                const nextMatch = allRounds[r + 1][Math.floor(i / 2)];
                thisMatch.nextMatchId = nextMatch.id;
            }
        }
        // --- SAVE ALL MATCHES ---
        for (const match of matches) {
            await match.save();
        }
        return NextResponse.json({
            message: 'Successfully generated tournament bracket',
            matches: await Match.find({ tournamentId: tournamentId }).sort({ id: 1 })
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating matches:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
