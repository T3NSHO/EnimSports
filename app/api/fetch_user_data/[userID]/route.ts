import { UserModel } from "@/app/models/user-model";
import dbconnect from "@/lib/db_connect";
import { NextRequest , NextResponse } from "next/server";

import { useSession } from "next-auth/react";




export async function POST(req: NextRequest, { params }: { params: { userID: string } }) {
    //const { data: session, status } = useSession();
    var ObjectId = require('mongoose').Types.ObjectId; 
    const { userID } = params; // Access params correctly
    
    const userId = new ObjectId(userID);
    // if (!session || userId != session.user.id) {
    //    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
    // }
    await dbconnect();
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user , { status: 200 });


}