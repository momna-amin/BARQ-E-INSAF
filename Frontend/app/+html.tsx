import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ur">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
        />

        <meta name="theme-color" content="#07152e" />
        <meta name="application-name" content="Barq-e-Insaf" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-any-192.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Barq-e-Insaf" />
        <link rel="apple-touch-icon" href="/icons/icon-any-192.png" />

        <ScrollViewStyleReset />

        {/* Google Website Translator — persists via googtrans cookie across all routes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  { pageLanguage: 'ur', autoDisplay: false, layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
      </head>
      <body>
        <div
          id="google_translate_element"
          style={{
            position: 'fixed',
            top: '8px',
            right: '8px',
            zIndex: 9999,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            padding: '2px 4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function (err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
