import { NextRequest, NextResponse } from "next/server";
import Notification from "@/app/models/notifications-model"; // Ensure the path is correct
import dbconnect from "@/lib/db_connect";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const body = await req.json();
    const { title, message, audience } = body;
    console.log("message : ", message);
    // Validate the input
    if (!title || !message || !audience) {
      return NextResponse.json(
        { error: "Title, message, and audience are required." },
        { status: 400 }
      );
    }

    // Create a new notification
    const newNotification = new Notification({
      title,
      audience,
      date: new Date(),
      status: "Delivered",
      description : message
    });

    // Save the notification to the database
    await newNotification.save();

    return NextResponse.json({ message: "Notification created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
