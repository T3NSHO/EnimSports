import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a secure random token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate a simple email template for password reset
export function generateResetEmailTemplate(token: string, userName: string): string {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - ENIM Sports</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ENIM Sports</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We received a request to reset your password for your ENIM Sports account.</p>
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>For security reasons, this link can only be used once</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <p>Best regards,<br>The ENIM Sports Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2024 ENIM Sports. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email sending function using Gmail with improved configuration
export async function sendResetEmail(email: string, userName: string, token: string): Promise<boolean> {
  try {
    const emailContent = generateResetEmailTemplate(token, userName);
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    console.log('=== PASSWORD RESET EMAIL ===');
    console.log('To:', email);
    console.log('Subject: Password Reset Request - ENIM Sports');
    console.log('Reset URL:', resetUrl);
    console.log('===========================');
    
    // Try alternative configuration first (more reliable)
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'oukhrid.mohamedamine@gmail.com',
          pass: 'hjzy cwcn qvul inqx'
        },
        // Simple timeout settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 10000,     // 10 seconds
      });
    } catch (configError) {
      console.error('Failed to create transporter with alternative config:', configError);
      
      // Fallback to service configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'oukhrid.mohamedamine@gmail.com',
          pass: 'hjzy cwcn qvul inqx'
        },
        // Connection timeout settings
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000,   // 30 seconds
        socketTimeout: 60000,     // 60 seconds
        // Pool settings for better performance
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        // Rate limiting
        rateLimit: 5, // max 5 messages per second
        // TLS settings
        secure: true,
        tls: {
          rejectUnauthorized: false
        }
      });
    }
    
    // Verify connection configuration
    await transporter.verify();
    console.log('Email server connection verified successfully');
    
    // Send email with timeout
    const mailOptions = {
      from: 'oukhrid.mohamedamine@gmail.com',
      to: email,
      subject: 'Password Reset Request - ENIM Sports',
      html: emailContent
    };
    
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 30000)
      )
    ]) as any;
    
    console.log('Email sent successfully!');
    console.log('Message ID:', result.messageId);
    
    // Close the connection pool
    transporter.close();
    
    return true;
  } catch (error: any) {
    console.error('Error sending reset email:', error);
    
    // Log specific error details
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.command) {
      console.error('Failed command:', error.command);
    }
    
    return false;
  }
} 