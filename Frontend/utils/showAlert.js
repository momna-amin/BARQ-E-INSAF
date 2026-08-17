import { Alert, Platform } from 'react-native';

export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      // 1. Create backdrop overlay container
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.65)'; // Sleek slate backdrop
      overlay.style.backdropFilter = 'blur(4px)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '999999';
      overlay.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      overlay.style.padding = '20px';

      // 2. Create modern card container
      const card = document.createElement('div');
      card.style.backgroundColor = '#ffffff';
      card.style.borderRadius = '16px';
      card.style.padding = '24px';
      card.style.maxWidth = '400px';
      card.style.width = '100%';
      card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      card.style.textAlign = 'center';
      card.style.animation = 'scaleIn 0.2s ease-out';

      // Add simple scale-in animation keyframe
      const styleSheet = document.createElement('style');
      styleSheet.innerText = `
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(styleSheet);

      // 3. Render Title & Description
      const titleEl = document.createElement('h3');
      titleEl.innerText = title;
      titleEl.style.margin = '0 0 10px 0';
      titleEl.style.fontSize = '19px';
      titleEl.style.fontWeight = '800';
      titleEl.style.color = '#1e293b';

      const messageEl = document.createElement('p');
      messageEl.innerText = message || '';
      messageEl.style.margin = '0 0 24px 0';
      messageEl.style.fontSize = '14px';
      messageEl.style.color = '#475569';
      messageEl.style.lineHeight = '1.6';

      card.appendChild(titleEl);
      if (message) card.appendChild(messageEl);

      // 4. Render Action Buttons
      const buttonRow = document.createElement('div');
      buttonRow.style.display = 'flex';
      buttonRow.style.justifyContent = 'center';
      buttonRow.style.gap = '12px';

      const modalButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];

      modalButtons.forEach((btn) => {
        const actionBtn = document.createElement('button');
        actionBtn.innerText = btn.text || 'OK';
        
        // Button Styles
        actionBtn.style.padding = '10px 20px';
        actionBtn.style.fontSize = '14px';
        actionBtn.style.fontWeight = '700';
        actionBtn.style.borderRadius = '10px';
        actionBtn.style.border = 'none';
        actionBtn.style.cursor = 'pointer';
        actionBtn.style.transition = 'all 0.15s ease';
        actionBtn.style.flex = '1';

        if (btn.style === 'cancel' || btn.text.toLowerCase() === 'cancel' || btn.text.toLowerCase() === 'no') {
          // Secondary button styling
          actionBtn.style.backgroundColor = '#f1f5f9';
          actionBtn.style.color = '#475569';
          actionBtn.onmouseover = () => { actionBtn.style.backgroundColor = '#e2e8f0'; };
          actionBtn.onmouseout = () => { actionBtn.style.backgroundColor = '#f1f5f9'; };
        } else {
          // Primary action button styling (matching dark red theme)
          actionBtn.style.backgroundColor = '#5C1A1A';
          actionBtn.style.color = '#ffffff';
          actionBtn.onmouseover = () => { actionBtn.style.backgroundColor = '#7c2222'; };
          actionBtn.onmouseout = () => { actionBtn.style.backgroundColor = '#5C1A1A'; };
        }

        // OnClick Handler
        actionBtn.onclick = () => {
          document.body.removeChild(overlay);
          document.head.removeChild(styleSheet);
          if (btn.onPress) btn.onPress();
        };

        buttonRow.appendChild(actionBtn);
      });

      card.appendChild(buttonRow);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }
    return;
  }
  Alert.alert(title, message, buttons);
}

export default showAlert;
