import { Alert, Platform } from 'react-native';

export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    const actionBtn = buttons?.find((b) => b.style !== 'cancel') || buttons?.[0];
    actionBtn?.onPress?.();
    return;
  }
  Alert.alert(title, message, buttons);
}

export default showAlert;
