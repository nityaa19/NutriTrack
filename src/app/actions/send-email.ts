
'use server';

import { sendMail, SendEmailOptions } from '@/lib/mail';

/**
 * Server action to bridge client-side report generation with server-side SMTP sending.
 */
export async function sendEmailAction(options: SendEmailOptions) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("SMTP credentials are not configured in environment variables.");
    }

    const info = await sendMail(options);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
}
