import db_connect from "@/lib/db_connect";
import {UserModel} from "@/app/models/user-model";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const POST = async (req: Request) => {
    try {
        await db_connect();
        const { full_name, email, password, phone, school } = await req.json();

        if (!full_name || !email || !password) {
            return new NextResponse('Full name, email, and password are required.', { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return new NextResponse('User with this email already exists.', { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await UserModel.create({
            full_name,
            email,
            password: hashedPassword,
            phone_number: phone,
            school,
            status: 'active'
        });

        return NextResponse.json(newUser, { status: 201 });
    }
    catch (err){ 
        console.error("Registration error:", err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        return new NextResponse(message, { status: 500 });
    }
}

