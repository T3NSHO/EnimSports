import { UserModel } from "@/app/models/user-model";
import dbconnect from "@/lib/db_connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params} : {params: {userID: string}}) {
    const {userID} = params;


    if (!userID) {
        return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    const ObjectId = require('mongoose').Types.ObjectId;

    // Validate the userID format
    if (!ObjectId.isValid(userID)) {
        return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
    }

    const userId = new ObjectId(userID);

    // Connect to the database
    await dbconnect();

    // Find the user
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user, { status: 200 });
}
