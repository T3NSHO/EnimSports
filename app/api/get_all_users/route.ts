import 'mongoose';
import {UserModel} from "@/app/models/user-model";
import dbconnect from '@/lib/db_connect';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const users = await UserModel.find({}, '-password').exec();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
