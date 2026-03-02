import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'satyavij.care@gmail.com',
    pass: 'ptbj iwmy gala ipdp',
  },
});

const templates = {
  verification: (otp: string) => ({
    subject: 'Confirm Your Registration - Satyavij',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0;">
        <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px;">Confirm Your Account</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px;">
          Welcome to Satyavij. Please use the following code to verify your email address and join our platform.
        </p>
        <div style="background: #fbfbfb; padding: 40px; text-align: center; border: 1px solid #eee;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #000;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-transform: uppercase; letter-spacing: 1px;">
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-transform: uppercase; letter-spacing: 1px;">
          This code will expire in 15 minutes.
        </p>
      </div>
    `,
  }),
  login: (otp: string) => ({
    subject: 'Admin Login Code - Satyavij',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0;">
        <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px;">Admin Login Code</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px;">
          Please use the following code to sign in to the Satyavij admin dashboard.
        </p>
        <div style="background: #fbfbfb; padding: 40px; text-align: center; border: 1px solid #eee;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #000;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-transform: uppercase; letter-spacing: 1px;">
          This code will expire in 10 minutes.
        </p>
      </div>
    `,
  }),
  password_reset: (otp: string) => ({
    subject: 'Password Reset - Satyavij',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0;">
        <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px;">Reset Your Password</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px;">
          We received a request to reset your password. Use the code below to proceed:
        </p>
        <div style="background: #fbfbfb; padding: 40px; text-align: center; border: 1px solid #eee;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #000;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-transform: uppercase; letter-spacing: 1px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  }),
  order_update: (orderId: string, status: string, invoiceUrl?: string) => ({
    subject: `Order Update #${orderId.slice(-6).toUpperCase()} - Satyavij`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0;">
        <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px;">Order Status Updated</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px;">
          Your order <strong>#${orderId.slice(-12).toUpperCase()}</strong> has been updated.
        </p>
        <div style="background: #fbfbfb; padding: 40px; text-align: center; border: 1px solid #eee; margin-bottom: 32px;">
          <p style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 8px;">Current Status</p>
          <span style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #000; text-transform: uppercase;">${status}</span>
        </div>
        ${invoiceUrl ? `
        <div style="text-align: center; margin-top: 40px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Your paid bill invoice is now available.</p>
          <a href="${invoiceUrl}" target="_blank" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 16px 32px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
            Download Invoice
          </a>
        </div>
        ` : ''}
        <p style="font-size: 12px; color: #999; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #eee; padding-top: 24px;">
          Thank you for shopping with Satyavij Healthcare Pvt. Ltd.
        </p>
      </div>
    `,
  }),
};

export const sendOTPEmail = async (email: string, otp: string, type: 'verification' | 'password_reset' | 'login') => {
  const { subject, html } = templates[type](otp);

  await transporter.sendMail({
    from: '"Satyavij Support" <satyavij.care@gmail.com>',
    to: email,
    subject,
    html,
  });
};

export const sendOrderUpdateEmail = async (email: string, orderId: string, status: string, invoiceUrl?: string) => {
  const { subject, html } = templates.order_update(orderId, status, invoiceUrl);

  await transporter.sendMail({
    from: '"Satyavij Support" <satyavij.care@gmail.com>',
    to: email,
    subject,
    html,
  });
};
