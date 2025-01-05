//@ts-nocheck
import dbconnect from "@/lib/db_connect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { Match } from "@/app/models/match-model";

export async function POST(req: NextRequest, {params}: { params: { tournamentID: string } }) {
  

  const ObjectId = require("mongoose").Types.ObjectId;

  // Await the params to ensure correct access
  
  const { tournamentID } = await params;

  if (!tournamentID || !ObjectId.isValid(tournamentID)) {
    return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
  }
  interface Participant {
    id: string;
    name: string;
    isWinner: boolean;
    status: "PENDING" | "PLAYED";
    resultText: "WON" | "LOST" | "CHAMPION" | "RUNNER-UP" | null;
  }


  if (!tournamentID || !ObjectId.isValid(tournamentID)) {
    return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
  }

  const tournament_ID = new ObjectId(tournamentID);

  try {
    // Connect to the database
    await dbconnect();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all matches for the given tournament
const matches = await Match.find({ tournamentId: tournament_ID })
.populate({
  path: 'participants.id',
  model: 'Teams', // Reference the correct model
}).lean({ virtuals: true }); // Populate participant references if needed
  

    console.log(matches);
    if (!matches || matches.length === 0) {
      return NextResponse.json({ error: "No matches found for this tournament" }, { status: 404 });
    }

    // Transform the matches for the brackets page
    const transformedMatches = matches.map((match) => ({
      id: match.id,
      name: match.name,
      nextMatchId: match.nextMatchId,
      tournamentRoundText: match.tournamentRoundText,
      startTime: match.startTime,
      state: match.state,
      participants: match.participants.map((participant : Participant) => ({
        id: participant.id,
        name: participant.name,
        isWinner: participant.isWinner,
        status: participant.status,
        resultText:
          participant.resultText ||
          (participant.isWinner
            ? match.tournamentRoundText === "Final"
              ? "CHAMPION"
              : "WON"
            : match.tournamentRoundText === "Final"
            ? "RUNNER-UP"
            : "LOST"),
      })),
      team1Score: match.team1Score ?? null,
      team2Score: match.team2Score ?? null,
    }));
    console.log(transformedMatches);
    return NextResponse.json({ matches: transformedMatches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
