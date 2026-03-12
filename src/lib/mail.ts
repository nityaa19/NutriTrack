import nodemailer from 'nodemailer';

/**
 * Creates a reusable transporter object using the default SMTP transport.
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Utility function to send an email.
 * Converts basic Markdown-like structures to HTML for better readability.
 */
export async function sendMail(options: SendEmailOptions) {
  // Simple conversion of Markdown-style bold and headers to HTML for better email rendering
  const formattedHtml = options.html || options.text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\n/g, '<br>');

  const info = await transporter.sendMail({
    from: `"NutriTrack" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${formattedHtml}
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} NutriTrack. Personalized Health Insights.
        </div>
      </div>
    `,
  });

  return info;
}
