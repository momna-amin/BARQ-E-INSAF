'use strict';

// ── Shared brand styles ──────────────────────────────────────────────────────
const APP_URL = process.env.APP_URL || 'https://barq-e-insaf.vercel.app';

const base = (content) => `
<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0b5d3b 0%,#1a7d55 100%);
                        padding:28px 32px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);
                          border-radius:12px;padding:8px 18px;">
                <span style="font-size:22px;font-weight:800;color:#fff;
                              letter-spacing:1px;">⚡ Barq-e-Insaf</span>
              </div>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;">
                برق انصاف — قانونی حقوق کا سفر
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 36px 28px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8faf9;padding:20px 36px;border-top:1px solid #e8ede9;
                        text-align:center;">
              <p style="margin:0;color:#888;font-size:12px;">
                یہ ایک خودکار پیغام ہے — براہ کرم جواب نہ دیں۔<br/>
                © 2026 Barq-e-Insaf. تمام حقوق محفوظ ہیں۔
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const openAppBtn = (label = 'App Kholen') =>
  `<div style="text-align:center;margin-top:28px;">
    <a href="${APP_URL}"
       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#0b5d3b,#1a7d55);
              color:#fff;border-radius:10px;text-decoration:none;font-weight:700;
              font-size:15px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(11,93,59,0.35);">
      ${label}
    </a>
  </div>`;

// ── 1. OTP Email ─────────────────────────────────────────────────────────────
const otpEmail = (name, otp) => ({
  subject: 'Barq-e-Insaf — Aapka Verification Code',
  html: base(`
    <p style="margin:0 0 4px;color:#333;font-size:16px;">Assalam-o-Alaikum
      <strong>${name || 'User'}</strong>,</p>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      Aapne password reset ki request ki hai. Apna one-time verification code neeche diya gaya hai:
    </p>
    <div style="background:linear-gradient(135deg,#f0faf5,#e6f7ef);border:2px solid #0b5d3b;
                border-radius:14px;padding:28px;text-align:center;margin:24px 0;">
      <div style="font-size:42px;font-weight:900;letter-spacing:14px;
                  color:#0b5d3b;font-family:'Courier New',monospace;">
        ${otp}
      </div>
      <p style="color:#0b5d3b;font-size:12px;margin:10px 0 0;font-weight:600;">
        یہ کوڈ 10 منٹ میں expire ہو جائے گا
      </p>
    </div>
    <div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:14px 18px;border-radius:0 8px 8px 0;">
      <p style="margin:0;color:#92400e;font-size:13px;">
        ⚠️ اگر آپ نے یہ request نہیں کی تو اس email کو نظرانداز کریں — آپ کا اکاؤنٹ محفوظ ہے۔
      </p>
    </div>
  `),
});

// ── Welcome & Registration Verification Email ─────────────────────────────
const welcomeOtpEmail = (name, otp) => ({
  subject: 'Barq-e-Insaf — Khushamdeed! Aapka Verification Code',
  html: base(`
    <p style="margin:0 0 4px;color:#333;font-size:16px;">Assalam-o-Alaikum
      <strong>${name || 'User'}</strong>,</p>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      Barq-e-Insaf (برقِ انصاف) میں اکاؤنٹ بنانے کا شکریہ! آپ کی رجسٹریشن مکمل ہو گئی ہے۔ آپ کا سیکورٹی verification کوڈ نیچے دیا گیا ہے:
    </p>
    <div style="background:linear-gradient(135deg,#f0faf5,#e6f7ef);border:2px solid #0b5d3b;
                border-radius:14px;padding:24px;text-align:center;margin:20px 0;">
      <div style="font-size:38px;font-weight:900;letter-spacing:12px;
                  color:#0b5d3b;font-family:'Courier New',monospace;">
        ${otp}
      </div>
      <p style="color:#0b5d3b;font-size:12px;margin:8px 0 0;font-weight:600;">
        یہ کوڈ آپ کے ریکارڈ اور verification کے لیے ہے
      </p>
    </div>
    ${openAppBtn('App Mein Daakhil Hoien')}
  `),
});

// ── 2. Lawyer ko Request ka Email ─────────────────────────────────────────────
const requestToLawyer = (lawyerName, userName, userPhone, userCity, userEmail) => ({
  subject: 'Barq-e-Insaf — Nayi Client Request',
  html: base(`
    <p style="margin:0 0 4px;color:#333;font-size:16px;">Assalam-o-Alaikum
      <strong>Advocate ${lawyerName}</strong>,</p>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      <strong>${userName}</strong> ne aapko Barq-e-Insaf par legal consultation ki request bheji hai.
    </p>
    <div style="background:#f8faf9;border:1px solid #d1e8db;border-radius:12px;
                padding:20px 24px;margin:20px 0;">
      <h3 style="margin:0 0 14px;color:#0b5d3b;font-size:15px;">Client ki Tafseelaat</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;color:#666;font-size:13px;width:40%;">نام (Name)</td>
          <td style="padding:6px 0;color:#222;font-weight:700;font-size:13px;">${userName}</td>
        </tr>
        ${userEmail ? `<tr>
          <td style="padding:6px 0;color:#666;font-size:13px;">ای میل (Email)</td>
          <td style="padding:6px 0;color:#222;font-size:13px;">${userEmail}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:6px 0;color:#666;font-size:13px;">فون (Phone)</td>
          <td style="padding:6px 0;color:#222;font-size:13px;">${userPhone || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666;font-size:13px;">شہر (City)</td>
          <td style="padding:6px 0;color:#222;font-size:13px;">${userCity || '—'}</td>
        </tr>
      </table>
    </div>
    <p style="color:#555;font-size:14px;">Request accept ya reject karne ke liye app mein jaayen:</p>
    ${openAppBtn('Request Dekhen')}
  `),
});

// ── 3. User ko Response ka Email ──────────────────────────────────────────────
const responseToUser = (userName, lawyerName, status, reason) => {
  const isAccepted = status === 'accepted';
  const statusLabel = isAccepted ? '✅ Qabool (Accepted)' : '❌ Manzoor Nahi (Rejected)';
  const statusColor = isAccepted ? '#0b5d3b' : '#dc2626';
  const bgColor = isAccepted ? '#f0faf5' : '#fef2f2';
  const borderColor = isAccepted ? '#0b5d3b' : '#dc2626';

  return {
    subject: `Barq-e-Insaf — Aapki Request ${isAccepted ? 'Qabool Ho Gayi' : 'Manzoor Nahi Hui'}`,
    html: base(`
      <p style="margin:0 0 4px;color:#333;font-size:16px;">Assalam-o-Alaikum
        <strong>${userName}</strong>,</p>
      <p style="color:#555;font-size:14px;line-height:1.6;">
        Aapki Advocate <strong>${lawyerName}</strong> ko bheji gayi request ka jawab aa gaya hai:
      </p>
      <div style="background:${bgColor};border:2px solid ${borderColor};border-radius:12px;
                  padding:20px 24px;margin:20px 0;text-align:center;">
        <div style="font-size:20px;font-weight:800;color:${statusColor};">${statusLabel}</div>
        <div style="font-size:14px;color:#555;margin-top:8px;">
          Advocate <strong>${lawyerName}</strong> ki taraf se
        </div>
      </div>
      ${reason ? `
        <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;
                    border-radius:0 8px 8px 0;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-weight:700;color:#92400e;font-size:13px;">Wajah (Reason):</p>
          <p style="margin:0;color:#78350f;font-size:14px;">${reason}</p>
        </div>` : ''}
      ${openAppBtn(isAccepted ? 'App Mein Dekhen' : 'Doosra Vakeel Dhoondhen')}
    `),
  };
};

// ── 4. Admin ko Notification ──────────────────────────────────────────────────
const adminNotify = (userName, lawyerName, status, reason) => ({
  subject: `[Admin] Request ${status.toUpperCase()}: ${userName} ↔ ${lawyerName}`,
  html: base(`
    <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:12px;padding:20px 24px;">
      <h3 style="margin:0 0 16px;color:#3730a3;font-size:15px;">Admin Notification — Request Update</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:5px 0;color:#666;font-size:13px;width:40%;">Client</td>
          <td style="padding:5px 0;color:#222;font-weight:700;font-size:13px;">${userName}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Advocate</td>
          <td style="padding:5px 0;color:#222;font-weight:700;font-size:13px;">${lawyerName}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Status</td>
          <td style="padding:5px 0;font-weight:700;font-size:13px;
                      color:${status === 'accepted' ? '#0b5d3b' : '#dc2626'};">
            ${status.toUpperCase()}
          </td>
        </tr>
        ${reason ? `<tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Reason</td>
          <td style="padding:5px 0;color:#222;font-size:13px;">${reason}</td>
        </tr>` : ''}
      </table>
    </div>
    ${openAppBtn('Admin Panel Kholein')}
  `),
});

module.exports = { otpEmail, welcomeOtpEmail, requestToLawyer, responseToUser, adminNotify };
