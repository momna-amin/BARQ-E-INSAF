'use strict';
const nodemailer = require('nodemailer');

// ── Gmail SMTP transporter ──────────────────────────────────────────────────
// Uses Gmail App Password (NOT your normal password)
// Google Account → Security → 2-Step Verification → App Passwords → Generate
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false', // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''), // 16-char App Password (auto-strip spaces)
  },
});

// Verify SMTP connection once at server boot (non-blocking)
transporter.verify().then(
  () => console.log('✅  SMTP ready — Gmail connected'),
  (err) => console.error('❌  SMTP connection error:', err.message)
);

/**
 * Send a single email.
 * @param {Object} opts
 * @param {string} opts.to     - Recipient email
 * @param {string} opts.subject
 * @param {string} opts.html   - HTML body
 * @param {string} [opts.text] - Plain-text fallback
 * @returns {Promise}
 */
async function sendMail({ to, subject, html, text }) {
  const from = `"${process.env.SMTP_FROM_NAME || 'Barq-e-Insaf'}" <${process.env.SMTP_USER}>`;
  return transporter.sendMail({ from, to, subject, html, text });
}

module.exports = { sendMail };
