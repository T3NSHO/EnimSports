import { NextRequest, NextResponse } from 'next/server';
import 'mongoose';
import { UserModel } from '@/app/models/user-model';
import dbconnect from '@/lib/db_connect';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      await dbconnect();
  
      const body = await req.json();
      const { _id, ...updateData } = body;
        console.log(body);
      if (!_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
  
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true }
      ).exec();
  
      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  