import { Resend } from 'resend';

/**
 * Create Resend client
 */
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === 'development') {
    return null; // Will use dev fallback
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Send email via Resend (or log to console in dev mode)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const resend = getResendClient();

    if (!resend) {
      // Development fallback — log to console
      console.log('📧 [DEV] Email would be sent:');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: ${text || html?.substring(0, 200)}...`);
      return { id: 'dev-' + Date.now() };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Student Result Manager <noreply@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html
    });

    if (error) {
      console.error('❌ Resend email error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent via Resend: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw in dev — just log. In production, re-throw.
    if (process.env.NODE_ENV === 'production') throw error;
    return { id: 'error-fallback-' + Date.now() };
  }
};

/**
 * Send account creation email with credentials
 */
export const sendAccountCreationEmail = async (user, password) => {
  const subject = 'Your Account Has Been Created — Student Result Management System';
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎓 Student Result Manager</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Academic Excellence Platform</p>
      </div>
      <div style="padding: 32px 24px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">Welcome, ${user.firstName}!</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">Your account has been created successfully on the Student Result Management System. You can now log in with the credentials below:</p>
        <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb; margin: 0 0 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${user.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Password</td><td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; font-family: monospace;">${password}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Role</td><td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-transform: capitalize;">${user.role}</td></tr>
          </table>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 0 0 20px;">
          <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 600;">⚠️ Important: Please change your password after your first login for security.</p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">Login Now →</a>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send result publication notification
 */
export const sendResultPublishedEmail = async (user, semester, session) => {
  const subject = `Results Published — ${semester} ${session}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎓 Student Result Manager</h1>
      </div>
      <div style="padding: 32px 24px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">Results Published 📊</h2>
        <p style="color: #4b5563; line-height: 1.6;">Dear ${user.firstName},</p>
        <p style="color: #4b5563; line-height: 1.6;">Your results for <strong>${semester} — ${session}</strong> have been published and are now available for viewing.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px;">View Results →</a>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request — Student Result Management System';
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎓 Student Result Manager</h1>
      </div>
      <div style="padding: 32px 24px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">Password Reset Request 🔐</h2>
        <p style="color: #4b5563; line-height: 1.6;">Dear ${user.firstName},</p>
        <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 16px 0;">Reset Password →</a>
        <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};
