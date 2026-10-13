/**
 * Email Service for PlacementAI
 * Dispatches verification emails, password resets, and notifications.
 * Uses Nodemailer with configurable SMTP / Gmail integration.
 */

let nodemailerModule = null;

const getNodemailer = async () => {
  if (nodemailerModule) return nodemailerModule;
  try {
    nodemailerModule = (await import('nodemailer')).default;
    return nodemailerModule;
  } catch (err) {
    console.warn('⚠️ Nodemailer not yet installed or unavailable:', err.message);
    return null;
  }
};

/**
 * Creates and caches SMTP transporter based on environment variables
 */
let cachedTransporter = null;

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const nodemailer = await getNodemailer();
  if (!nodemailer) return null;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure = port === 465;

  if (user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
    return cachedTransporter;
  }

  // If in development with no explicit SMTP credentials, create Ethereal test account if needed
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`✉️ Nodemailer initialized with development test transport: ${testAccount.user}`);
    return cachedTransporter;
  } catch (etherealErr) {
    console.warn('Could not initialize fallback test mailer:', etherealErr.message);
    return null;
  }
};

/**
 * Sends a stylized student email verification message
 */
export const sendVerificationEmail = async ({ to, name, verificationLink }) => {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || '"PlacementAI" <noreply@placementai.com>';
  const studentName = name || 'Student';
  const verifyUrl = verificationLink || `http://localhost:5173/login?verified=true`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your PlacementAI Account</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    .body { padding: 32px 30px; color: #1e293b; line-height: 1.6; }
    .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .message { font-size: 14px; color: #475569; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: #6366f1; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35); }
    .note { font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 16px; word-break: break-all; }
    .footer { padding: 20px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PlacementAI</h1>
      <p>AI Resume Builder &amp; Placement Preparation Platform</p>
    </div>
    <div class="body">
      <div class="greeting">Welcome, ${studentName}!</div>
      <p class="message">
        Thank you for joining PlacementAI. Please confirm your email address to unlock AI resume optimization, aptitude tests, mock technical challenges, and AI HR interview practice.
      </p>
      <div class="btn-container">
        <a href="${verifyUrl}" class="btn" target="_blank">Verify My Email Address</a>
      </div>
      <p class="message" style="margin-bottom: 8px;">
        This verification link will expire in 24 hours. If you didn't create an account with PlacementAI, you can safely ignore this email.
      </p>
      <div class="note">
        If the button above does not work, copy and paste this link into your browser:<br>
        <a href="${verifyUrl}" style="color: #6366f1;">${verifyUrl}</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PlacementAI. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  try {
    const transporter = await getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject: 'Verify your email address – PlacementAI',
        html,
        text: `Welcome ${studentName}! Please verify your PlacementAI email by clicking: ${verifyUrl}`
      });

      console.log(`✉️ Verification email sent successfully to ${to} (MessageId: ${info.messageId})`);
      const nodemailer = await getNodemailer();
      if (nodemailer && nodemailer.getTestMessageUrl) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log(`🔗 Ethereal preview link: ${previewUrl}`);
        }
      }
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`ℹ️ [Email Fallback] Email service active. Link for ${to}: ${verifyUrl}`);
      return { success: true, directLink: verifyUrl };
    }
  } catch (err) {
    console.error(`❌ Failed to send verification email to ${to}:`, err.message);
    return { success: false, error: err.message, directLink: verifyUrl };
  }
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async ({ to, resetLink }) => {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || '"PlacementAI" <noreply@placementai.com>';
  const actionUrl = resetLink || `http://localhost:5173/login?reset=true`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your PlacementAI Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .body { padding: 32px; color: #1e293b; line-height: 1.6; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: #6366f1; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; }
    .note { font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 16px; word-break: break-all; }
    .footer { padding: 20px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PlacementAI</h1>
      <p>Password Reset Request</p>
    </div>
    <div class="body">
      <p style="font-size: 15px; font-weight: 600;">Hello,</p>
      <p style="font-size: 14px; color: #475569;">
        We received a request to reset your PlacementAI password. Click the button below to choose a new password:
      </p>
      <div class="btn-container">
        <a href="${actionUrl}" class="btn" target="_blank">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #64748b;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
      <div class="note">
        Direct link: <a href="${actionUrl}" style="color: #6366f1;">${actionUrl}</a>
      </div>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} PlacementAI. All rights reserved.</div>
  </div>
</body>
</html>
`;

  try {
    const transporter = await getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject: 'Reset your password – PlacementAI',
        html,
        text: `Please reset your PlacementAI password by visiting: ${actionUrl}`
      });
      console.log(`✉️ Password reset email sent to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    }
    return { success: true, directLink: actionUrl };
  } catch (err) {
    console.error(`❌ Failed to send password reset email to ${to}:`, err.message);
    return { success: false, error: err.message, directLink: actionUrl };
  }
};
