# PART A — Emails jaa rahi spam mein, fix

Wajah: emoji-heavy subject lines, no plain-text version, raw Gmail SMTP, no headers.

## A1. `Backend/utils/mailer.js` — full replace

WRONG (current):
```js
'use strict';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
  },
});

transporter.verify().then(
  () => console.log('✅  SMTP ready — Gmail connected'),
  (err) => console.error('❌  SMTP connection error:', err.message)
);

async function sendMail({ to, subject, html, text }) {
  const from = `"${process.env.SMTP_FROM_NAME || 'Barq-e-Insaf'}" <${process.env.SMTP_USER}>`;
  return transporter.sendMail({ from, to, subject, html, text });
}

module.exports = { sendMail };
```

CORRECT:
```js
'use strict';
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text'); // npm i html-to-text

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
  },
  pool: true,        // reuse connection, better sending reputation
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
    text: text || htmlToText(html, { wordwrap: 130 }), // plain-text version — big spam-score factor
    replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    headers: {
      'X-Mailer': 'Barq-e-Insaf',
      'X-Priority': '3',
    },
  });
}

module.exports = { sendMail };
```

`.env` add:
```
SMTP_FROM_NAME=Barq-e-Insaf
SMTP_FROM_EMAIL=same_as_SMTP_USER
```

## A2. `Backend/utils/emailTemplates.js` — subject lines

WRONG (example, same pattern in every `subject:` line):
```js
subject: `Barq-e-Insaf — Aapki Request ${isAccepted ? 'Qabool Ho Gayi' : 'Manzoor Nahi Hui'}`,
```
Emoji sirf yahan se hatana hai — `✅ ❌ ⛔ ⚡` — jahan bhi `subject:` line mein ho. HTML body ke andar emoji rehne do, wahan spam score pe farq nahi parta, sirf subject line matter karti hai.

CORRECT pattern (emoji removed, text same):
```js
subject: `Barq-e-Insaf — Aapki Request ${isAccepted ? 'Qabool Ho Gayi' : 'Manzoor Nahi Hui'}`,
```
(agar kisi subject mein emoji tha jaise `Aapki Registration Manzoor Ho Gayi ✅` to sirf ` ✅` remove karo, baqi text same rehne do.)

## A3. Non-code (bigger impact, cannot be done via code)
Gmail SMTP se bulk transactional mail bhejna low domain-reputation deta hai. Agar apna domain hai to us pe SPF + DKIM + DMARC DNS records add karo (Google Workspace ya SendGrid/Resend/Mailgun free tier se), inbox placement bahtar hoga.

---

# PART B — Vercel pe Urdu translate sirf current page tak, sab pages pe persist nahi hota

Wajah: `Frontend/app.json` mein `"web": { "output": "static" }` hai — Vercel pe har route apni alag static HTML file banti hai, is liye Chrome ka native "Translate?" banner sirf current document tak limited rehta hai, next page pe reset ho jata hai. Fix: Chrome ke native banner pe depend karne ke bajaye Google Website Translator widget khud embed karo — us ka `googtrans` cookie poore domain pe persist hota hai, sab pages/routes pe automatically apply hota hai.

## B1. `Frontend/app/+html.tsx` — head + body edit

WRONG:
```jsx
        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
```
CORRECT:
```jsx
        <ScrollViewStyleReset />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  { pageLanguage: 'ur', autoDisplay: false },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
      </head>
      <body>
        <div id="google_translate_element" style={{ position: 'fixed', top: 8, right: 8, zIndex: 9999 }} />
        {children}
```
(baqi file same rahegi — service worker script niche waisay hi rahega)

## B2. Home screen — widget hamesha home page pe dikhe

Home screen file (`Frontend/app/LandingScreen.js` ya `StartScreen.js`, jo bhi actual home/landing route hai) ke top-level component mein:

WRONG: kuch nahi hai (koi translate trigger nahi).
CORRECT — add:
```js
import { useEffect } from 'react';

useEffect(() => {
  const already = document.cookie.includes('googtrans=');
  if (!already) {
    const el = document.getElementById('google_translate_element');
    if (el) el.style.display = 'block';
  }
}, []);
```

## B3. Persistence (sab pages pe automatic)
Extra code nahi chahiye — widget ka `googtrans` cookie `path=/` (root domain) pe by default set hota hai, aur script `+html.tsx` (shared layout) mein hai is liye har route pe load hota hai — ek dafa language select karne ke baad wahi cookie har agle page load pe khud translate apply kar degi.

`Frontend/vercel.json` already sahi hai (`cleanUrls: true`), koi change nahi chahiye.

Chrome ka apna native "Translate this page?" banner iske baad khud hide ho jayega, kyun ke widget already translate control de raha hoga — dono popup ikathay nahi ayenge.

---

## Order
Part A: A1 → A2 → A3 (A3 optional/manual DNS step).
Part B: B1 → B2 → B3.
