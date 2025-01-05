//@ts-nocheck
import { UserModel } from "@/app/models/user-model";
import dbconnect from "@/lib/db_connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,{params} : {params: {userID: string}}) {
  const { userID } = await params;
  
  var ObjectId = require('mongoose').Types.ObjectId; 
  const userId = new ObjectId(userID);

  try {
    // Connect to the database
    await dbconnect();

    // Parse the incoming request body
    const body = await req.json();

    // Ensure the required fields exist in the body
    const { full_name, email, phone_number, school, team } = body;

    if (!full_name || !email || !phone_number || !school) {
      return NextResponse.json(
        { error: "Missing required fields: full_name, email, phone_number, school" },
        { status: 400 }
      );
    }

    // Find the user and update the fields
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId }, // Find user by ID
      {
        full_name,
        email,
        phone_number,
        school, // Default to an empty string if team is not provided
      },
      { new: true } // Return the updated document
    );

    // Check if the user was found
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400    });
    }

    // Return the updated user data
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
