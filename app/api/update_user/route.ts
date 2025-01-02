import { NextRequest, NextResponse } from 'next/server';
import 'mongoose';
import { UserModel } from '@/app/models/user-model';
import dbconnect from '@/lib/db_connect';



export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      await dbconnect();
  
      const body = await req.json();
      const { _id, ...updatedFields } = body;
        console.log(body);
      if (!_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
  
      const result = await UserModel.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      ).exec();
  
      if (!result) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'User updated successfully', user: result }, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  