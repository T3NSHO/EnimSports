import { Reservation } from "@/app/models/reservation-model";
import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";

interface GroupedReservation {
    date: string;
    field: string;
    hours: { hour: number; reservedBy: string }[];
}

export const POST = async (req: Request) => {
    try {
        await db_connect();
        const reservations = await Reservation.find();

        // Log fetched reservations for debugging
        console.log("Fetched reservations:", reservations);

        // Group reservations by date and field
        const groupedReservations = reservations.reduce((acc, curr) => {
            const { date, field, hour } = curr;

            // Find or create the group for this date and field
            let group: GroupedReservation | undefined = acc.find(
                (g: GroupedReservation) => g.date === date.toISOString().split('T')[0] && g.field === field
            );

            if (!group) {
                group = { date: date.toISOString().split('T')[0], field, hours: [] };
                acc.push(group);
            }

            // Add the hour information to the group's hours array
            group.hours.push({
                hour,
                reservedBy: "RESERVED", // Replace reservedBy with "RESERVED"
            });

            return acc;
        }, [] as GroupedReservation[]);

        // Log the formatted reservations for debugging
        console.log("Formatted reservations:", groupedReservations);

        return NextResponse.json(groupedReservations, { status: 200 });
    } catch (error) {
        console.error("Reservation error:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Failed to get reservations" },
            { status: 500 }
        );
    }
};
