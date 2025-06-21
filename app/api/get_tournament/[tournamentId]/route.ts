import { NextRequest, NextResponse } from "next/server";
  import db_connect from "@/lib/db_connect";
  import Tournament from "@/app/models/tournament-model";

export async function GET(req: NextRequest, { params }: { params: { tournamentId: string } }) {
  try {
    await db_connect();
    const tournament = await Tournament.findById(params.tournamentId);

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json(tournament, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 