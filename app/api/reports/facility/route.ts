import { NextResponse } from "next/server";
import db_connect from "@/lib/db_connect";
import { Reservation } from "@/app/models/reservation-model";
import { UserModel } from "@/app/models/user-model";

const formatFacilityId = (id: string) => {
  if (!id) return "N/A";
  return id.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export async function GET() {
  try {
    await db_connect();

    const totalConfirmed = await Reservation.countDocuments({ status: "confirmed" });
    const totalCancelled = await Reservation.countDocuments({ status: "cancelled" });
    const confirmedReservations = await Reservation.find({ status: "confirmed" }).lean();

    let totalHours = 0;
    confirmedReservations.forEach((res: any) => {
        if(res.hour !== undefined) {
            totalHours += 1; // Assuming each reservation is 1 hour long
        }
    });

    const facilityLogsData = await Reservation.find({})
      .populate({ path: "reservedBy", model: UserModel, select: "full_name" })
      .sort({ date: -1, start_time: -1 })
      .limit(200)
      .lean();

    const logs = facilityLogsData.map((log: any) => ({
      date: new Date(log.date).toISOString().split('T')[0],
      time: `${log.hour}:00 - ${log.hour + 1}:00`,
      user: log.reservedBy ? (log.reservedBy as any).full_name : "N/A",
      status: log.status === "confirmed" ? "Reserved" : "Cancelled",
      type: formatFacilityId(log.field),
    }));

    const totalReservations = totalConfirmed + totalCancelled;
    const confirmationRate = totalReservations > 0 ? (totalConfirmed / totalReservations) * 100 : 0;

    const stats = {
      confirmationRate: confirmationRate.toFixed(1),
      totalConfirmed,
      totalCancelled,
      totalHours: Math.round(totalHours),
    };

    return NextResponse.json({ stats, logs });
  } catch (error) {
    console.error("Error fetching facility reports:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
  }
}