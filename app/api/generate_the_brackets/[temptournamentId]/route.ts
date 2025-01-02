import { teamModel } from "@/app/models/team-model";
import { Match } from "@/app/models/match-model";
import Tournament from "@/app/models/tournament-model";
import dbconnect from "@/lib/db_connect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";


export async function POST(req: NextRequest, { params }: { params: { temptournamentId: string } }) {
    const ObjectId = mongoose.Types.ObjectId;
    const { searchParams } = new URL(req.url);
    const temptournamentId = searchParams.get("temptournamentId");
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

        const teamIds = tournament.registered_teams;
        if (teamIds.length < 2) {
            return NextResponse.json({ error: 'At least two teams are required' }, { status: 400 });
        }

        // Get all team details
        const teams = await teamModel.find({ '_id': { $in: teamIds } });
        const teamMap = new Map(teams.map(team => [team._id.toString(), team]));

        // Calculate tournament structure
        const numTeams = teamIds.length;
        const numRounds = Math.ceil(Math.log2(numTeams));

        // Calculate dates
        const startDate = new Date(tournament.start_date);
        const endDate = new Date(tournament.end_date);
        const daysPerRound = Math.floor((endDate.getTime() - startDate.getTime()) / (numRounds * 1000 * 60 * 60 * 24));

        // Shuffle teams
        const shuffledTeams = [...teamIds].sort(() => Math.random() - 0.5);

        let matchId = 1;

        // Generate first round matches
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const team1Id = shuffledTeams[i];
            const team2Id = shuffledTeams[i + 1];

            // Check if both team IDs are valid
            if (!team1Id || !team2Id) {
                console.warn("Skipping match creation: Missing team ID(s).");
                continue; // Skip to the next iteration
            }

            const team1 = teamMap.get(team1Id.toString());
            const team2 = teamMap.get(team2Id.toString());
            console.log(team1, team2);
            if (!team1 || !team2) {
                console.warn("Skipping match creation: Missing team data.");
                continue;
            }

            const matchDate = new Date(startDate);
            matchDate.setDate(matchDate.getDate());

            const match = new Match({
                id: matchId,
                name: `Match ${matchId}`,
                tournamentId: tournamentId,
                nextMatchId: Math.ceil(matchId / 2) + Math.floor(numTeams / 2),
                tournamentRoundText: "Round 1",
                startTime: matchDate.toISOString(),
                state: 'PENDING',
                participants: [
                    {
                        id: team1._id.toString(),
                        name: team1.team_name,
                        isWinner: false,
                        status: 'PENDING',
                        resultText: null
                    },
                    {
                        id: team2._id.toString(),
                        name: team2.team_name,
                        isWinner: false,
                        status: 'PENDING',
                        resultText: null
                    }
                ],
                team1Score: null,
                team2Score: null
            });

            await match.save();
            matchId++;
        }

        // Generate subsequent rounds (if required)
        // This would follow a similar structure for linking matches in rounds.

        return NextResponse.json({
            message: 'Successfully generated tournament bracket',
            matches: await Match.find({ tournamentId: tournamentId }).sort({ id: 1 })
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating matches:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
