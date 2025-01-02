import 'mongoose';
import Notification  from "@/app/models/notifications-model";
import dbconnect from '@/lib/db_connect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const notifications = await Notification.find({}).exec();

    return NextResponse.json(notifications, { status: 200 });


} catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}    