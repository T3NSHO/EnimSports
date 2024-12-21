import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";
import Tournament from "@/app/models/tournament-model";

export const POST = async (req: Request) => {
  // Connect to the database
  await db_connect();

  try {
    // Parse incoming data
    const {
      title,
      prize,
      startDate,
      end_date,
      type,
      sportDetails,
      numberOfTeams,
      format,
      tournament_organizer,
    } = await req.json();

    // Validate required fields
    if (!title || !startDate || !type || !numberOfTeams || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Conditional validation for sportDetails based on type
    if (type === "real-sports" && !sportDetails) {
      return new NextResponse("Sport type is required for real sports", {
        status: 400,
      });
    }
    if (type === "esports" && !sportDetails) {
      return new NextResponse("Esports game name is required for esports", {
        status: 400,
      });
    }

    // Validate dates
    const start_date = new Date(startDate);
    if (isNaN(start_date.getTime())) {
      return new NextResponse("Invalid start date format", { status: 400 });
    }

    // Create the tournament
    const newTournament = await Tournament.create({
      tournament_name: title,
    // Optional prize
    start_date,
    end_date: new Date(start_date.getTime() + 2 * 24 * 60 * 60 * 1000), // End date is start date plus 2 days
    location: "ENIM",
    tournament_organizer,
      tournament_type: type,
      sport_type: type === "real-sports" ? sportDetails : undefined,
      esport_game: type === "esports" ? sportDetails : undefined,
      max_teams: Number(numberOfTeams),
      tournament_format: format,
      registered_teams: [], // Default empty array
      status: "upcoming", // Default status
    });

    // Return a success response
    return new NextResponse(
      JSON.stringify({
        message: "Tournament created successfully",
        tournamentId: newTournament._id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("Tournament creation error:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors)
        .map((error: any) => error.message)
        .join(", ");
      return new NextResponse(`Validation Error: ${errorMessages}`, {
        status: 400,
      });
    }

    // Handle duplicate tournament names
    if (err.code === 11000) {
      return new NextResponse("A tournament with this name already exists", {
        status: 409,
      });
    }

    // Handle generic server errors
    return new NextResponse("Failed to create tournament", { status: 500 });
  }
};

