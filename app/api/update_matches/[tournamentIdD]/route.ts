import { NextRequest, NextResponse } from "next/server";
import { Match, IMatch } from "@/app/models/match-model";
import dbconnect from "@/lib/db_connect";

export async function POST(req: NextRequest, { params }: { params: { tournamentIdD: string } }) {
  const { tournamentIdD } = params;
  await dbconnect();
  const { matches: matchesFromClient } = await req.json();

  try {
    for (const matchData of matchesFromClient) {
      const existingMatch = await Match.findOne({
        id: matchData.id,
        tournamentId: tournamentIdD,
      });

      if (!existingMatch) continue;

      // Update scores and state
      existingMatch.team1Score = matchData.team1Score ?? null;
      existingMatch.team2Score = matchData.team2Score ?? null;
      existingMatch.state = matchData.state || 'DONE';

      // Determine the winner from client data and update participants
      let winner: any = null;
      const winnerParticipantFromClient = matchData.participants.find((p: any) => p.isWinner);

      if (winnerParticipantFromClient && existingMatch.participants.length === 2) {
        existingMatch.participants.forEach((p: any) => {
          if (p.id === winnerParticipantFromClient.id) {
            p.isWinner = true;
            p.resultText = existingMatch.tournamentRoundText === 'Final' ? 'CHAMPION' : 'WON';
            winner = p;
          } else {
            p.isWinner = false;
            p.resultText = existingMatch.tournamentRoundText === 'Final' ? 'RUNNER-UP' : 'LOST';
          }
          p.status = 'PLAYED';
        });
      }

      await existingMatch.save();

      // --- WINNER ADVANCEMENT LOGIC ---
      if (winner && existingMatch.nextMatchId) {
        const nextMatch = await Match.findOne({
          id: existingMatch.nextMatchId,
          tournamentId: tournamentIdD,
        });

        if (nextMatch) {
          // The placeholder ID for the winner of this match
          const placeholderId = `W${existingMatch.id}`;

          // Find the participant slot in the next match to update
          const participantIndexToUpdate = nextMatch.participants.findIndex(
            (p: any) => p.id === placeholderId
          );

          if (participantIndexToUpdate !== -1) {
            // Replace placeholder with winner's details
            nextMatch.participants[participantIndexToUpdate].id = winner.id;
            nextMatch.participants[participantIndexToUpdate].name = winner.name;
            await nextMatch.save();
          }
        }
      }
    }
    
    // Return all updated matches for the tournament
    const updatedMatches = await Match.find({ tournamentId: tournamentIdD }).sort({ id: 1 });
    return NextResponse.json({ success: true, matches: updatedMatches });

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
