/**
 * showAlert.js
 *
 * WHY THIS EXISTS:
 * react-native-web's Alert.alert() is a literal no-op — `static alert() {}`.
 * It does NOT show a browser dialog. Any screen that calls Alert.alert()
 * for error/success feedback shows NOTHING on web (the PWA), even though
 * the exact same code works fine in the native app.
 *
 * This is the root cause behind "I press the button and nothing happens,
 * no error, no notification" bugs on the web build — the request may be
 * failing correctly, but the user is never told, because the alert silently
 * does nothing.
 *
 * Fix: use this helper everywhere instead of Alert.alert directly.
 * - On native (iOS/Android): behaves exactly like Alert.alert.
 * - On web: uses window.alert (or swap the body below for a custom toast/
 *   modal component if you want something more "premium" than a native
 *   browser alert box).
 */
import { Alert, Platform } from 'react-native';

export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    // Fire the first non-cancel button's onPress so web keeps working
    // exactly like the native flow (e.g. navigation after "OK").
    const actionBtn = buttons?.find((b) => b.style !== 'cancel') || buttons?.[0];
    actionBtn?.onPress?.();
    return;
  }
  Alert.alert(title, message, buttons);
}

export default showAlert;
