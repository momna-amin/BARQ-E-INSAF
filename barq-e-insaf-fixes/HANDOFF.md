# Barq-e-Insaf — Auth, OTP, PWA-Install Fix Package
**For: Antigravity implementation** · Repo: `momna-amin/BARQ-E-INSAF` · Prepared: 12 Aug 2026

---

## 0. THE #1 ROOT CAUSE — READ THIS FIRST

`Backend/controllers/authController.js` currently has a **fatal syntax error** (confirmed with `node --check`). A bad merge-conflict cleanup left:

- An unclosed `if (lawyerError) { ... }` block inside `register()`
- A reference to an undefined variable `mailErr`
- **`sendRegisterOtp` and `verifyRegisterOtpAndCreate` exported but never defined anywhere in the file**

`Backend/server.js` does `app.use('/api/auth', require('./routes/auth'))` **synchronously at import time**, and `routes/auth.js` requires this broken controller. Result: **the entire Express app fails to load** — not just `/auth/*`, but `/lawyers`, `/cases`, `/admin`, `/chat`, `/requests` too. Every API call currently 500s on Vercel.

On top of that, **`Alert.alert()` in `react-native-web` is a literal no-op** (`static alert() {}` — confirmed by pulling the package source). So on the web/PWA build, any error path that only calls `Alert.alert(...)` shows the user **nothing** — button looks like it "does nothing."

Those two facts together explain all three of your reported bugs (signup OTP, forgot-password OTP, and the general "koi notification show nahi hoti" pattern) in one shot.

**Fix applied:** rewrote `authController.js` correctly, implemented the two missing functions, and added a `showAlert()` helper that actually shows feedback on web. Full details per-feature below.

---

## 1. Google Login ("Continue with Google")

**Status: code was already correct**, just not wired up with real credentials.
- `Frontend/components/GoogleLoginButton.js` and `Backend/controllers/authController.js → googleAuth` are functionally complete (Expo AuthSession + `google-auth-library` id-token verification + Supabase upsert).
- It currently shows *"Google OAuth Client ID is not configured yet"* because `GOOGLE_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_CLIENT_ID` are unset.

**To activate (manual — needs your Google Cloud project):**
1. Google Cloud Console → Create OAuth 2.0 Client ID (Web application) → Authorized redirect URIs: add your Expo/Vercel domain.
2. Backend (Vercel) env var: `GOOGLE_CLIENT_ID=<client id>`
3. Frontend (Vercel) env var: `EXPO_PUBLIC_GOOGLE_CLIENT_ID=<same client id>`
4. Redeploy both.

No code changes needed for this one — just the two env vars.

---

## 2. Create Account → OTP Page → Supabase Save → Redirect to Login

**What was broken:** `verify-register-otp` route pointed at a function that didn't exist (see §0) → every signup silently 500'd.

**What changed:**
- `Backend/controllers/authController.js` — implemented `sendRegisterOtp` (hashes password, stores the *entire* pending signup payload + a 6-digit OTP against the email, emails the code via your existing `welcomeOtpEmail` template) and `verifyRegisterOtpAndCreate` (checks the OTP, then inserts the user — and lawyer profile row if applicable — into Supabase).
- `Backend/utils/otpStore.js` (**new**) — OTPs are now stored in a Supabase table (`otp_codes`, migration in `Backend/sql/otp_codes.sql`) instead of an in-memory `Map()`. This matters because Vercel serverless functions don't guarantee the same instance handles both the "send" and "verify" requests — an in-memory Map can silently lose the OTP between requests. This was very likely *also* intermittently breaking OTP verification even once the syntax error is fixed.
- `Frontend/app/RegisterVerifyOtp.js` (**new file**) — a real dedicated **page** (Expo Router route), not a modal, as you asked. Reuses your existing `Frontend/components/OtpInput.js`, which already had the exact behavior you described (single hidden input driving 6 visual boxes → type-to-advance and paste-anywhere both already work — it just wasn't hooked up outside the old modal). On success it redirects to `LoginScreen` with the login tab active.
- `Frontend/app/LoginScreen.js` — `handleSignup()` now does `router.push('/RegisterVerifyOtp', { email, role })` after the OTP is sent, instead of opening the old in-page `<Modal>`. The modal and its now-dead state/handlers were removed.

**Manual step required:** run `Backend/sql/otp_codes.sql` once in the Supabase SQL editor.

---

## 3. Forgot Password — "Send OTP does nothing"

**Root cause:** exactly §0 — the request was failing (whole backend down), and the failure was invisible because `Alert.alert()` is a no-op on web.

**What changed:**
- `Backend/controllers/authController.js → forgotPassword/verifyOtp/resetPassword` — same fix, now backed by the persistent `otp_codes` table (previously used the same broken in-memory `Map`).
- `Frontend/utils/showAlert.js` (**new**) — cross-platform alert: native keeps using `Alert.alert`, web uses `window.alert` (and still fires the button's `onPress`, so navigation-after-alert flows keep working identically to native).
- `Frontend/app/ForgotPassword.js` — every `Alert.alert(...)` call swapped for `showAlert(...)`. This screen's logic (3-step flow, 5-attempt limit, 10-min expiry, resend cooldown) was already well-built — it just needed a backend that responds and a way to actually show that response on web.

Once the backend fix is deployed, this flow should work exactly as originally designed — no further UI rework needed.

---

## 4. Premium Loading Overlay

**What changed:**
- `Frontend/components/LoadingOverlay.js` (**new**) — a translucent deep-blue (`rgba(7,21,46,0.55)`) overlay with a centered spinner card, absolutely positioned over whatever screen is currently mounted. It is **not** an opaque full-screen replacement — the real page stays visible underneath (with a `backdropFilter: blur` on web), matching "loading sirf real page ke upar overlay ho, koi background color na ho."
- Wired into `LoginScreen.js` and `ForgotPassword.js` (`<LoadingOverlay visible={loading} />` as the last element).

**To roll out app-wide:** drop `<LoadingOverlay visible={loading} />` as the last child of any screen/layout that currently shows a spinner. One good candidate already in the codebase: `Frontend/app/_layout.tsx`'s session-check screen currently renders a **solid** `#07152e` full-screen `ActivityIndicator` — swap that block for the real `(tabs)`/route content + `<LoadingOverlay visible={checking} />` so the destination page can paint underneath the spinner instead of a blank screen.

---

## 5. PWA Install — Real App-Drawer Entry, No Chrome Badge

**Root cause:** the manifest had no service worker registered anywhere in the project. Without one, Chrome/Android cannot generate a **WebAPK** — "Install" just creates a lightweight bookmark-shortcut, which is exactly why it showed the small Chrome badge on the icon and never appeared as a real app-drawer entry. Separately, both icon entries in the manifest used the same unpadded `logo.png` for `purpose: "any maskable"`, which is why a maskable icon (no safe-zone padding) tends to render cropped/ugly once Android applies its shape mask.

**What changed:**
- `Frontend/public/sw.js` (**new**) — minimal service worker (install/activate/fetch, network-first with cache fallback). Just registering *any* service worker is what flips Chrome into offering a real WebAPK install.
- `Frontend/app/+html.tsx` (**new**) — Expo Router's custom root-HTML hook. Adds the PWA/iOS meta tags (`theme-color`, `apple-mobile-web-app-capable`, `apple-touch-icon`, manifest `<link>`) and an inline script that registers `/sw.js` on load.
- `Frontend/public/manifest.json` (**fixed**) — split into proper separate `"purpose": "any"` and `"purpose": "maskable"` icon entries instead of a combined `"any maskable"` on the same unpadded image.
- `Frontend/public/icons/` (**new**, generated) — `icon-any-{192,512}.png` (your existing `logo.png`, safe to show un-cropped) and `icon-maskable-{192,512}.png` (composited from your existing `android-icon-foreground.png` + `android-icon-background.png` — those adaptive-icon assets were already sitting unused in `assets/images/`, authored with the correct safe-zone padding for exactly this purpose).
- `Frontend/app.json` — `web.icons` updated to reference the same new icon set (keeps Expo's own config consistent with the manifest actually being served).
- `Frontend/components/InstallAppButton.js` — **no changes needed**, it was already correctly implemented (captures `beforeinstallprompt`, calls `.prompt()` directly with no manual "here's how to install" instructions, hides itself once installed or if the browser hasn't fired the event). It's already placed top-right on both `StartScreen.js` and `LoginScreen.js`.

**Manual step required:** after deploying, uninstall any previously-installed copy of the PWA on a test Android device first (old installs won't retroactively pick up the service worker/manifest changes), then reinstall via the button and confirm it lands in the app drawer without the Chrome badge.

---

## File Manifest (what's in this zip)

```
Backend/
  controllers/authController.js      ← FIXED (was crashing entire backend)
  utils/otpStore.js                  ← NEW (Supabase-backed OTP store)
  sql/otp_codes.sql                  ← NEW (run once in Supabase SQL editor)

Frontend/
  app/LoginScreen.js                 ← MODIFIED (signup → new page, showAlert, LoadingOverlay)
  app/ForgotPassword.js              ← MODIFIED (showAlert, LoadingOverlay)
  app/RegisterVerifyOtp.js           ← NEW (dedicated OTP page)
  app/+html.tsx                      ← NEW (PWA meta tags + SW registration)
  app.json                           ← MODIFIED (manifest icon set)
  components/LoadingOverlay.js       ← NEW
  utils/showAlert.js                 ← NEW
  public/manifest.json               ← FIXED (any vs maskable icons)
  public/sw.js                       ← NEW (service worker)
  public/icons/*.png                 ← NEW (generated icon set)
```

## Deploy Checklist
1. Merge these files into the repo (paths above match the repo structure exactly).
2. Run `Backend/sql/otp_codes.sql` in Supabase.
3. Set `GOOGLE_CLIENT_ID` (backend) + `EXPO_PUBLIC_GOOGLE_CLIENT_ID` (frontend) env vars in Vercel if you want Google login live now.
4. Confirm existing SMTP env vars (`SMTP_USER`, `SMTP_PASS`, etc.) are set in the Backend Vercel project — the mailer code was already correct and untouched.
5. Redeploy both Backend and Frontend on Vercel.
6. Smoke test: signup with a real email → OTP arrives → new OTP page verifies → redirected to login → login works. Then forgot-password with the same account.
7. On an Android phone: open the deployed PWA in Chrome, uninstall any old install, tap "Install App," confirm it appears in the app drawer with your logo and no Chrome badge.
