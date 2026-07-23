/**
 * emailService.js — powered by Gmail SMTP via Nodemailer.
 *
 * Required .env vars:
 *   SMTP_HOST       — smtp.gmail.com
 *   SMTP_PORT       — 587
 *   SMTP_USER       — your Gmail address (e.g. yourname@gmail.com)
 *   SMTP_PASS       — Gmail App Password (NOT your regular password)
 *   SMTP_FROM_NAME  — display name (optional, defaults to "Student Result Manager")
 *
 * To generate an App Password:
 *   1. Enable 2-Step Verification on your Google account
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Create a new app password and use it as SMTP_PASS
 */

import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Get or create the nodemailer transporter (singleton).
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Low-level send via Gmail SMTP.
 * Falls back to console log when SMTP_USER is not configured.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 [NO SMTP CONFIG] Email would be sent:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Preview: ${(text || html)?.substring(0, 150)}…`);
    return { messageId: 'noop-' + Date.now() };
  }

  const fromName = process.env.SMTP_FROM_NAME || 'Student Result Manager';
  const from = `"${fromName}" <${process.env.SMTP_USER}>`;

  try {
    const info = await getTransporter().sendMail({
      from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      ...(text && { text }),
      ...(html && { html }),
    });

    console.log(`✅ Email sent via Gmail SMTP to ${Array.isArray(to) ? to.join(', ') : to} — messageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ SMTP send failed:', err.message);
    return { messageId: 'error-' + Date.now(), error: err.message };
  }
};

/**
 * Send account creation email with generated credentials.
 */
export const sendAccountCreationEmail = async (user, password) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${user.role === 'student' ? 'student-login' : 'login'}`;
  const subject = 'Your Account Has Been Created — Student Result Management System';
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎓 Student Result Manager</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Academic Excellence Platform</p>
      </div>
      <div style="padding: 32px 24px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">Welcome, ${user.firstName}!</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
          Your <strong style="text-transform: capitalize;">${user.role}</strong> account has been created on the Student Result Management System.
          Use the credentials below to log in:
        </p>
        <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb; margin: 0 0 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 110px;">Email</td>
              <td style="padding: 10px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${user.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Password</td>
              <td style="padding: 10px 0; color: #1f2937; font-weight: 700; font-size: 15px; font-family: 'Courier New', monospace; letter-spacing: 0.05em;">${password}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Role</td>
              <td style="padding: 10px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-transform: capitalize;">${user.role}</td>
            </tr>
          </table>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 600;">
            ⚠️ Security: Please change your password immediately after your first login.
          </p>
        </div>
        <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-weight: 700; font-size: 15px;">
          Login Now →
        </a>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send result publication notification to a student.
 */
export const sendResultPublishedEmail = async (user, semester, session) => {
  const resultsUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/results`;
  const subject = `Results Published — ${semester} ${session}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎓 Student Result Manager</h1>
      </div>
      <div style="padding: 32px 24px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">Results Published 📊</h2>
        <p style="color: #4b5563; line-height: 1.6;">Dear ${user.firstName},</p>
        <p style="color: #4b5563; line-height: 1.6;">
          Your results for <strong>${semester} — ${session}</strong> have been approved and are now available for viewing.
        </p>
        <a href="${resultsUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; margin-top: 20px;">
          View My Results →
        </a>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send password reset link.
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
        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your password. Click the button below to set a new password.
          <strong>This link expires in 15 minutes.</strong>
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #059669); color: white; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 20px 0 16px;">
          Reset My Password →
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
          If you didn't request a password reset, you can safely ignore this email. Your account is secure.
        </p>
      </div>
      <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Student Result Management System</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};
