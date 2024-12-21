import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";
import Tournament from "@/app/models/tournament-model";

export const POST = async (req: Request) => {
  // Connect to the database
  await db_connect();
  const tournaments = await Tournament.find({});
  if (!tournaments) {
    return new NextResponse("No tournaments found", { status: 404 });
  }
    return new NextResponse(JSON.stringify(tournaments), { status: 200 });

}
