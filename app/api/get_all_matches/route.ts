import { Match } from "@/app/models/match-model";
import Tournament from "@/app/models/tournament-model"; // Ensure the path is correct
import dbconnect from "@/lib/db_connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Fetch all matches
    const matches = await Match.find({}).exec();

    // Fetch all tournaments (optional: fetch only needed fields for optimization)
    const tournaments = await Tournament.find(
      {},
      { _id: 1, tournament_name: 1, sport_type: 1, esport_game: 1 }
    ).exec();

    // Create a map of tournaments by ID for quick lookup
    const tournamentMap = tournaments.reduce((map: any, tournament: any) => {
      map[tournament._id] = tournament;
      return map;
    }, {});

    // Format the match data
    const formattedMatches = matches.map((match: any) => {
      const tournament = tournamentMap[match.tournamentId] || {};
      return {
        _id: match._id, // Use the MongoDB ObjectId as the match ID
        team1: match.participants[0]?.name || "TBD",
        team2: match.participants[1]?.name || "TBD",
        scoreTeam1: match.team1Score || 0,
        scoreTeam2: match.team2Score || 0,
        gameType: tournament.sport_type || tournament.esport_game || "General",
        status:
          match.state === "DONE"
            ? "Finished"
            : match.state === "IN_PROGRESS"
            ? "Live"
            : "Upcoming",
        additionalDetails: {
          tournament: tournament.tournament_name || "Unknown",
          date: match.startTime || "Unknown",
        },
      };
    });

    return NextResponse.json(formattedMatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
