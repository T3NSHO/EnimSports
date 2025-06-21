import { NextRequest, NextResponse } from "next/server";
import db_connect from "@/lib/db_connect";
import Tournament from "@/app/models/tournament-model";

export async function PUT(req: NextRequest, { params }: { params: { tournamentId: string } }) {
  try {
    await db_connect();
    const body = await req.json();
    const { tournament_name, location, start_date, end_date, max_teams, tournament_type, description, status } = body;

    const updatedTournament = await Tournament.findByIdAndUpdate(
      params.tournamentId,
      {
        tournament_name,
        location,
        start_date,
        end_date,
        max_teams,
        tournament_type,
        description,
        status,
      },
      { new: true }
    );

    if (!updatedTournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTournament, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 