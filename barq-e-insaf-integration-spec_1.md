# Barq-e-Insaf — Full Integration Spec
### SMTP OTP + Lawyer Request Flow + PWA Install + Persistent Session + Google OAuth + Forgot Password

> Ye document Antigravity (ya kisi bhi AI coding tool) ko dene ke liye likha gaya hai. Har section mein: **kya karna hai, kahan (file path), aur ready-to-adapt code** diya gaya hai. Aapke stack ke mutabiq: **Backend = Node.js/Express 5**, **Mobile/Web = Expo/React Native + react-native-web (Vercel)**, **Admin = Next.js 16**, **DB = Supabase (Postgres) + MongoDB**.

---

## 0. Prerequisites — `.env` (Backend)

```env
# SMTP (Gmail App Password — Google Account > Security > 2FA > App Passwords)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx        # 16-char App Password, NOT your normal password
SMTP_FROM_NAME="Barq-e-Insaf"

ADMIN_NOTIFY_EMAIL=admin@barq-e-insaf.com

# JWT
JWT_ACCESS_SECRET=super-secret-access
JWT_REFRESH_SECRET=super-secret-refresh
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=https://your-backend.vercel.app/api/auth/google/callback

APP_URL=https://barq-e-insaf.vercel.app
```

Install packages (Backend):
```bash
npm install nodemailer google-auth-library speakeasy jsonwebtoken bcryptjs
```

---

## 1. SMTP Mailer (Gmail App Password) — reusable for OTP + notifications

**`Backend/utils/mailer.js`**
```js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});

// Verify connection once at boot (log only, don't crash server)
transporter.verify().then(
  () => console.log("✅ SMTP ready"),
  (err) => console.error("❌ SMTP error:", err.message)
);

async function sendMail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };
```

### Email templates
**`Backend/utils/emailTemplates.js`**
```js
const otpEmail = (name, otp) => ({
  subject: "Barq-e-Insaf — Your Verification Code",
  html: `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0b5d3b">Barq-e-Insaf</h2>
      <p>Assalam-o-Alaikum ${name || ""},</p>
      <p>Your one-time verification code is:</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;
                  background:#f2f2f2;padding:16px;text-align:center;border-radius:8px">
        ${otp}
      </div>
      <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>`,
});

const requestToLawyer = (lawyerName, userName, userPhone, userCity) => ({
  subject: "Barq-e-Insaf — New Client Request",
  html: `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0b5d3b">Barq-e-Insaf</h2>
      <p>Assalam-o-Alaikum ${lawyerName},</p>
      <p><b>${userName}</b> ne aap ko Barq-e-Insaf par ek request bheji hai.</p>
      <ul>
        <li><b>Phone:</b> ${userPhone || "—"}</li>
        <li><b>City:</b> ${userCity || "—"}</li>
      </ul>
      <p>Request accept/reject karne ke liye app open karein:</p>
      <a href="${process.env.APP_URL}" style="display:inline-block;padding:10px 20px;
         background:#0b5d3b;color:#fff;border-radius:6px;text-decoration:none">Open App</a>
    </div>`,
});

const responseToUser = (userName, lawyerName, status, reason) => ({
  subject: `Barq-e-Insaf — Your request was ${status}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0b5d3b">Barq-e-Insaf</h2>
      <p>Assalam-o-Alaikum ${userName},</p>
      <p>Advocate <b>${lawyerName}</b> ne aap ki request 
        <b style="color:${status === "accepted" ? "green" : "red"}">${status}</b> kar di hai.</p>
      ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ""}
      <a href="${process.env.APP_URL}" style="display:inline-block;padding:10px 20px;
         background:#0b5d3b;color:#fff;border-radius:6px;text-decoration:none">Open App</a>
    </div>`,
});

const adminNotify = (userName, lawyerName, status, reason) => ({
  subject: `[Admin] Request ${status}: ${userName} ↔ ${lawyerName}`,
  html: `<p><b>${lawyerName}</b> ${status} the request from <b>${userName}</b>.</p>
         ${reason ? `<p>Reason: ${reason}</p>` : ""}`,
});

module.exports = { otpEmail, requestToLawyer, responseToUser, adminNotify };
```

---

## 2. User → Lawyer "Send Request" (with email)

### DB (Supabase SQL)
```sql
create table lawyer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  lawyer_id uuid references lawyers(id),
  status text default 'pending', -- pending | accepted | rejected
  reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Backend route
**`Backend/routes/requests.js`**
```js
const router = require("express").Router();
const { sendMail } = require("../utils/mailer");
const { requestToLawyer } = require("../utils/emailTemplates");
const supabase = require("../config/supabase");

// User presses "Send Request" on lawyer profile
router.post("/api/requests", authMiddleware, async (req, res) => {
  const { lawyerId } = req.body;
  const user = req.user; // from JWT middleware

  const { data: lawyer } = await supabase
    .from("lawyers").select("*").eq("id", lawyerId).single();
  if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });

  const { data: request, error } = await supabase
    .from("lawyer_requests")
    .insert({ user_id: user.id, lawyer_id: lawyerId, status: "pending" })
    .select().single();
  if (error) return res.status(500).json({ message: error.message });

  const { subject, html } = requestToLawyer(lawyer.name, user.name, user.phone, user.city);
  sendMail({ to: lawyer.email, subject, html }).catch(console.error);

  res.status(201).json({ message: "Request sent", request });
});

module.exports = router;
```

### Frontend button (Lawyer Profile screen — React Native)
```jsx
// Frontend/components/SendRequestButton.jsx
import { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import api from "../services/api"; // your axios instance

export default function SendRequestButton({ lawyerId }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await api.post("/api/requests", { lawyerId });
      setSent(true);
      Alert.alert("Request Sent", "Lawyer ko email bhej di gayi hai.");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={loading || sent}
      onPress={handleSend}
      style={{ backgroundColor: sent ? "#999" : "#0b5d3b", padding: 14, borderRadius: 10, alignItems: "center" }}
    >
      {loading ? <ActivityIndicator color="#fff" /> :
        <Text style={{ color: "#fff", fontWeight: "600" }}>{sent ? "Request Sent" : "Send Request"}</Text>}
    </TouchableOpacity>
  );
}
```

---

## 3. Lawyer Accept/Reject (+ email/notification to user + admin)

**`Backend/routes/requests.js` (continued)**
```js
router.patch("/api/requests/:id", authMiddleware, async (req, res) => {
  const { status, reason } = req.body; // status: "accepted" | "rejected"
  const { id } = req.params;

  const { data: request } = await supabase
    .from("lawyer_requests")
    .update({ status, reason: reason || null, updated_at: new Date() })
    .eq("id", id).select("*, users(*), lawyers(*)").single();

  if (!request) return res.status(404).json({ message: "Request not found" });

  // 1) In-app notification (store in DB so user's app shows a bell/badge)
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: `Request ${status}`,
    body: reason || `Advocate ${request.lawyers.name} ${status} your request.`,
    type: "request_update",
  });

  // 2) Email to user
  const { responseToUser, adminNotify } = require("../utils/emailTemplates");
  const { sendMail } = require("../utils/mailer");
  const userMail = responseToUser(request.users.name, request.lawyers.name, status, reason);
  await sendMail({ to: request.users.email, ...userMail });

  // 3) Email to admin
  const adminMail = adminNotify(request.users.name, request.lawyers.name, status, reason);
  await sendMail({ to: process.env.ADMIN_NOTIFY_EMAIL, ...adminMail });

  res.json({ message: "Updated", request });
});
```

> **In-app notification delivery:** simplest reliable option without extra infra is **polling** (`GET /api/notifications?unread=true` every 30–60s while app is foregrounded) or **Supabase Realtime** (`supabase.channel().on('postgres_changes', ...)`) if you want instant push. For true push notifications when the app is closed, add `expo-notifications` + Expo Push Tokens later — that's a separate, bigger piece; the email above already guarantees the lawyer/user finds out even without it.

---

## 4. "Install App" Button → Native PWA Install Prompt (Expo Web on Vercel)

Since the web build is `react-native-web` served on Vercel, this behaves like any PWA. Three things are needed: a **manifest**, a **service worker**, and capturing the browser's `beforeinstallprompt` event.

### 4a. `public/manifest.json` (Expo web output — configure via `app.json`)
```json
{
  "name": "Barq-e-Insaf",
  "short_name": "BarqInsaf",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0b5d3b",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
In **Expo's `app.json`**, this is generated from:
```json
{
  "expo": {
    "web": {
      "name": "Barq-e-Insaf",
      "shortName": "BarqInsaf",
      "themeColor": "#0b5d3b",
      "backgroundColor": "#ffffff",
      "display": "standalone",
      "icon": "./assets/icon-512.png"
    }
  }
}
```
Run `npx expo export -p web` — Expo auto-generates `manifest.json`, a service worker, and icon sizes. Make sure `icon-512-maskable.png` (safe-zone padded) is included so Android shows a clean adaptive icon, not a cropped logo.

### 4b. Capture install prompt + custom "Install App" button
```jsx
// Frontend/components/InstallAppButton.jsx (web-only; guard with Platform.OS === 'web')
import { useEffect, useState } from "react";
import { Platform, TouchableOpacity, Text } from "react-native";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handler = (e) => {
      e.preventDefault();       // stop Chrome's mini-infobar
      setDeferredPrompt(e);     // save it — trigger manually on button press
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setInstalled(true));

    // Already installed / running standalone?
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (Platform.OS !== "web" || installed || !deferredPrompt) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();                  // shows Chrome's native install dialog
    const { outcome } = await deferredPrompt.userChoice; // "accepted" | "dismissed"
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null); // one-time use
  };

  return (
    <TouchableOpacity onPress={handleInstall}
      style={{ backgroundColor: "#0b5d3b", padding: 12, borderRadius: 8 }}>
      <Text style={{ color: "#fff", fontWeight: "600" }}>Install App</Text>
    </TouchableOpacity>
  );
}
```

**Why this gives "100% one-step install":** `beforeinstallprompt` is the exact event Chrome fires when a page qualifies as an installable PWA (valid manifest + registered service worker + served over HTTPS — Vercel gives you HTTPS by default). Calling `.prompt()` on it opens Chrome's *native* "Install app?" dialog — one tap, and Chrome handles placing the icon on the home screen / app drawer and listing it under `chrome://apps` and the OS "Installed apps" list itself. There is no custom install logic to write beyond capturing and replaying this event.

**Checklist for it to actually qualify (if the button never appears, one of these is missing):**
- `manifest.json` linked in `<head>` via `<link rel="manifest" href="/manifest.json">`
- A registered service worker (Expo web emits one — confirm `serviceWorker.js` is registered in `index.html` output)
- Icons at 192×192 and 512×512 minimum, correct MIME type
- Served over HTTPS (Vercel ✅)
- `start_url` and `scope` valid, same-origin

---

## 5. Persistent Login Session (auto-login on next open)

### Backend — issue both access + refresh token on login
```js
const jwt = require("jsonwebtoken");

function issueTokens(user) {
  const accessToken = jwt.sign({ id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
  const refreshToken = jwt.sign({ id: user.id },
    process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });
  return { accessToken, refreshToken };
}

// POST /api/auth/refresh
router.post("/api/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { data: user } = await supabase.from("users").select("*").eq("id", payload.id).single();
    if (!user) return res.status(401).json({ message: "Invalid session" });
    res.json(issueTokens(user));
  } catch {
    res.status(401).json({ message: "Session expired, please login again" });
  }
});
```

### Mobile — store securely, auto-check on app start
```bash
npx expo install expo-secure-store
```
```js
// Frontend/services/authStorage.js
import * as SecureStore from "expo-secure-store";

export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
};
export const getTokens = async () => ({
  accessToken: await SecureStore.getItemAsync("accessToken"),
  refreshToken: await SecureStore.getItemAsync("refreshToken"),
});
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};
```
```jsx
// Frontend/App.jsx (or root layout) — silent auto-login on boot
useEffect(() => {
  (async () => {
    const { accessToken, refreshToken } = await getTokens();
    if (!refreshToken) return setChecking(false); // show login screen

    try {
      const res = await api.post("/api/auth/refresh", { refreshToken });
      await saveTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      router.replace("/(tabs)/home"); // skip login, go straight in
    } catch {
      await clearTokens();
    } finally {
      setChecking(false);
    }
  })();
}, []);
```
Axios interceptor auto-attaches token and retries once on 401 using `/api/auth/refresh` — keeps the session alive without the user re-entering credentials until the refresh token itself expires (30 days here).

> On **web** (PWA), swap `expo-secure-store` for `localStorage`/`IndexedDB` behind a `Platform.OS === 'web'` check — SecureStore has no web implementation.

---

## 6. Admin/User/Lawyer separate logins + Google OAuth + Forgot Password OTP

### 6a. Google OAuth ("Continue with Google")
Use `expo-auth-session` for the mobile/web client (works across RN + web without a separate flow):
```bash
npx expo install expo-auth-session expo-web-browser
```
```jsx
// Frontend/components/GoogleLoginButton.jsx
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { Button } from "react-native";
import api from "../services/api";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton({ role, onSuccess }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      api.post("/api/auth/google", { idToken: authentication.idToken, role })
        .then((res) => onSuccess(res.data));
    }
  }, [response]);

  return <Button title="Continue with Google" disabled={!request} onPress={() => promptAsync()} />;
}
```
Backend verifies the token and creates/logs in the user **scoped to the role of the page they used** (user/lawyer/admin are separate tables or a `role` column):
```js
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/api/auth/google", async (req, res) => {
  const { idToken, role } = req.body; // role passed from which login page was used
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, name, picture } = ticket.getPayload();

  let { data: user } = await supabase.from("users").select("*").eq("email", email).eq("role", role).single();
  if (!user) {
    ({ data: user } = await supabase.from("users")
      .insert({ email, name, avatar: picture, role, provider: "google" }).select().single());
  }
  res.json({ user, ...issueTokens(user) });
});
```
For the **Next.js Admin Panel**, use `next-auth` with the Google provider instead (cleaner for Next.js App Router) — same backend verification principle, restrict allowed emails to your admin whitelist.

### 6b. Forgot Password — OTP flow

**Backend**
```js
const speakeasy = require("speakeasy");
const otpStore = new Map(); // use Redis in production instead of in-memory Map

router.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
  if (!user) return res.status(404).json({ message: "No account with this email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });

  const { otpEmail } = require("../utils/emailTemplates");
  const { sendMail } = require("../utils/mailer");
  const mail = otpEmail(user.name, otp);
  await sendMail({ to: email, ...mail });

  res.json({ message: "OTP sent" });
});

router.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record || Date.now() > record.expires)
    return res.status(400).json({ message: "OTP expired, request a new one" });

  record.attempts++;
  if (record.attempts > 5) { otpStore.delete(email); return res.status(429).json({ message: "Too many attempts" }); }
  if (record.otp !== otp) return res.status(400).json({ message: "Incorrect OTP, try again" });

  // OTP correct → issue a short-lived reset token so the client can set a new password
  const resetToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "10m" });
  otpStore.delete(email);
  res.json({ message: "OTP verified", resetToken });
});

router.post("/api/auth/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const bcrypt = require("bcryptjs");
  try {
    const { email } = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);
    await supabase.from("users").update({ password: hashed }).eq("email", email);
    res.json({ message: "Password updated" });
  } catch {
    res.status(400).json({ message: "Reset link expired, start over" });
  }
});
```

### 6c. OTP Input UI — auto-advance boxes (the "best in class" pattern)
This is the same pattern banks/OTP apps use: one hidden `TextInput` capturing input, 6 visual boxes reflecting it, auto-advance + auto-submit on completion, backspace goes back a box.
```jsx
// Frontend/components/OtpInput.jsx
import { useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

export default function OtpInput({ length = 6, onComplete }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = (text) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, length);
    setValue(digits);
    if (digits.length === length) onComplete(digits); // auto-submit when full
  };

  return (
    <View style={styles.wrapper}>
      {/* Invisible input drives real keyboard/paste behavior */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        style={styles.hiddenInput}
        textContentType="oneTimeCode"   // iOS auto-fill from SMS/clipboard
        autoComplete="sms-otp"          // Android auto-fill
      />
      <View style={styles.boxRow} pointerEvents="none">
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={[styles.box, i === value.length && styles.boxActive]}>
            <Text style={styles.boxText}>{value[i] || ""}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative", width: "100%" },
  hiddenInput: { position: "absolute", opacity: 0, height: 1, width: 1 },
  boxRow: { flexDirection: "row", justifyContent: "space-between" },
  box: { width: 44, height: 54, borderWidth: 1.5, borderColor: "#ccc",
         borderRadius: 8, alignItems: "center", justifyContent: "center" },
  boxActive: { borderColor: "#0b5d3b" },
  boxText: { fontSize: 22, fontWeight: "600" },
});
```
Usage:
```jsx
<OtpInput length={6} onComplete={(otp) =>
  api.post("/api/auth/verify-otp", { email, otp })
    .then(res => goToResetPasswordScreen(res.data.resetToken))
    .catch(() => Alert.alert("Incorrect OTP", "Please try again"))
} />
```
This gives: tap once → keyboard opens → typing/pasting fills boxes and auto-advances (because it's driven by one real input, there's no manual `focus()` juggling between boxes to get wrong) → wrong OTP just clears/re-prompts, no dead-end → auto-fill from SMS works on both platforms via `textContentType`/`autoComplete`.

---

## 7. Wiring notes for Antigravity

- All **email-sending code paths above are fire-and-forget from the request/response flow** — don't `await` them inline before responding to the client where speed matters (e.g. request creation); or do `await` where the user needs confirmation it was sent (OTP).
- **Role-scoped auth**: since Admin/User/Lawyer are separate login pages/apps, keep a `role` column (or three tables) and always filter by role — a Google login on the user page should never resolve to an admin account with the same email.
- **Rate-limit** `/api/auth/forgot-password` and `/api/auth/verify-otp` (e.g. `express-rate-limit`) — OTP endpoints are a common brute-force target.
- Replace the in-memory `otpStore` Map with **Redis** (or a Supabase table with a TTL cron cleanup) before production — a plain Map won't survive Vercel's serverless cold starts/multiple instances.
- For the **PWA icon**, generate all sizes from one 512×512 master with padding (use `npx pwa-asset-generator` or Expo's `expo-icon-generator`) so Android's maskable icon doesn't crop your logo.
