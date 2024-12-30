import { Reservation } from "@/app/models/reservation-model";
import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        await db_connect();

        const reservations = await req.json();

        // Log the received data for debugging
        console.log('Received reservation data:', reservations);

        if (!Array.isArray(reservations) || reservations.length === 0) {
            return NextResponse.json(
                { error: "Invalid data format. Expected an array of reservations." },
                { status: 400 }
            );
        }

        // Validate that each reservation object has the required fields
        const validReservations = reservations.every(reservation =>
            reservation.date &&
            reservation.field &&
            typeof reservation.hour === 'number' &&
            typeof reservation.reservedBy === 'string' &&
            reservation.reservedBy.length > 0
        );

        if (!validReservations) {
            return NextResponse.json(
                { error: "Invalid reservation data structure. Each reservation must include 'date', 'field', 'hour', and 'reservedBy'." },
                { status: 400 }
            );
        }

        // Create and save each reservation document
        const savedReservations = await Reservation.insertMany(reservations);

        // Log the saved reservations for debugging
        console.log('Saved reservations:', savedReservations);

        return NextResponse.json(
            { 
                message: "Reservations saved successfully", 
                data: savedReservations 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Reservation error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to save reservations" },
            { status: 500 }
        );
    }
};
