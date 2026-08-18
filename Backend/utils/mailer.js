'use strict';
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
  },
  pool: true,        // reuse connection — better sending reputation
  maxConnections: 3,
  maxMessages: 50,
});

transporter.verify().then(
  () => console.log('SMTP ready'),
  (err) => console.error('SMTP connection error:', err.message)
);

async function sendMail({ to, subject, html, text }) {
  const from = `"${process.env.SMTP_FROM_NAME || 'Barq-e-Insaf'}" <${process.env.SMTP_USER}>`;
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    // Auto-generate plain-text fallback — critical for spam score
    text: text || htmlToText(html, { wordwrap: 130 }),
    replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    headers: {
      'X-Mailer': 'Barq-e-Insaf',
      'X-Priority': '3',
    },
  });
}

module.exports = { sendMail };
