import { NextRequest, NextResponse } from 'next/server';
import db_connect from '@/lib/db_connect';
import { UserModel } from '@/app/models/user-model';
import { PasswordResetModel } from '@/app/models/password-reset-model';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await db_connect();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetRecord = await PasswordResetModel.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update user's password
    const user = await UserModel.findOne({ email: resetRecord.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to validate token
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await db_connect();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetRecord = await PasswordResetModel.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true, email: resetRecord.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error validating reset token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 