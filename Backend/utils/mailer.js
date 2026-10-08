'use strict';
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[EMAIL NOTICE - SMTP NOT CONFIGURED] Simulated email to <${to}> with subject: "${subject}". Set SMTP_USER and SMTP_PASS to send real emails.`);
    return { success: false, simulated: true, error: 'SMTP credentials not configured' };
  }
  try {
    const from = `"${process.env.SMTP_FROM_NAME || 'Barq-e-Insaf'}" <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || htmlToText(html, { wordwrap: 130 }),
      replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      headers: {
        'X-Mailer': 'Barq-e-Insaf',
        'X-Priority': '3',
      },
    });
    console.log(`[EMAIL DELIVERED] To: ${to} | MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[EMAIL NOTICE] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendMail };
