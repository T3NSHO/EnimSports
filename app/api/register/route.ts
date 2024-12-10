import db_connect from "@/lib/db_connect";
import {UserModel} from "@/app/models/user-model";
import { NextResponse } from "next/server";
import { error } from "console";

export const POST = async (req: Request) => {
    
    await db_connect();
    const { full_name ,email, password , phone , school } = await req.json();
    try {UserModel.create({full_name: full_name, email: email, password: password, phone_number: phone, school: school});
            return new NextResponse('Account created successfully', { status: 201 });
    }
    catch (err){ 
        if (typeof err === 'string') {
            return new NextResponse(err);
        }
        else if (err instanceof Error) {
        return new NextResponse(err.message, { status: 500 });
    }
}
    
  
}

