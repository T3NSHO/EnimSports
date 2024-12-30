import { Match } from "@/app/models/match-model";
import dbconnect from "@/lib/db_connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const { _id, ...updates } = await req.json();

    if (!_id || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    console.log("Updating match:", _id, updates);

    // Find the match by MongoDB ObjectId
    const match = await Match.findById(_id).exec();

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Map frontend status values to the backend model states
    const statusMap: Record<string, 'PENDING' | 'PLAYED' | 'IN_PROGRESS'> = {
      upcoming: 'PENDING',
      finished: 'PLAYED',
      ongoing: 'IN_PROGRESS',
    };

    // Update the match details with the provided updates
    if (typeof updates.scoreTeam1 === "number") match.team1Score = updates.scoreTeam1;
    if (typeof updates.scoreTeam2 === "number") match.team2Score = updates.scoreTeam2;
    if (updates.status && statusMap[updates.status]) {
      match.state = statusMap[updates.status]; // Map and assign the correct state
    }
    if (updates.time) match.startTime = updates.time;

    // Save the updated match
    await match.save();

    // If the status (state) is PLAYED, handle additional logic (e.g., update participant results)
    if (match.state === "PLAYED") {
      await match.updateScore(match.team1Score || 0, match.team2Score || 0);
    }

    // Respond with the updated match details
    return NextResponse.json(match, { status: 200 });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
