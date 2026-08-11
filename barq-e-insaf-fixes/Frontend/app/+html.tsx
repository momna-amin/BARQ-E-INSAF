import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * app/+html.tsx
 * Expo Router's custom root HTML wrapper for the web build.
 * Adds the PWA meta tags + service-worker registration that Chrome needs
 * to install this as a real app (app-drawer icon, no browser badge)
 * instead of a plain bookmark shortcut.
 */
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

        {/* PWA identity */}
        <meta name="theme-color" content="#0b5d3b" />
        <meta name="application-name" content="Barq-e-Insaf" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-any-192.png" />

        {/* iOS install support (Safari doesn't read manifest.json for these) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Barq-e-Insaf" />
        <link rel="apple-touch-icon" href="/icons/icon-any-192.png" />

        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        {/* Register the service worker — required by Chrome/Android to
            generate a real WebAPK on install (app-drawer entry, no
            Chrome badge on the icon). Safe no-op on unsupported browsers. */}
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
