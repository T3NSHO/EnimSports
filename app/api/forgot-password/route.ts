import { NextRequest, NextResponse } from 'next/server';
import db_connect from '@/lib/db_connect';
import { UserModel } from '@/app/models/user-model';
import { PasswordResetModel } from '@/app/models/password-reset-model';
import { generateResetToken, sendResetEmail } from '@/lib/password-reset';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await db_connect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await PasswordResetModel.create({
      email,
      token,
      expiresAt,
      used: false,
    });

    // Send reset email
    const emailSent = await sendResetEmail(email, user.full_name, token);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 