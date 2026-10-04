import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { HomeContentProvider } from './context/HomeContentContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { registerCertificateServiceWorker } from './services/offlineCertificateCache';
import './index.css';

// Filter out benign cross-origin stylesheet access warnings triggered by third-party scripts (e.g. Google Translate)
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.map(a => (typeof a === 'string' ? a : (a instanceof Error ? a.message : ''))).join(' ');
    if (
      message.includes("Error inlining remote css file") ||
      message.includes("Error loading remote stylesheet") ||
      message.includes("Error while reading CSS rules") ||
      message.includes("Cannot access rules")
    ) {
      console.debug('[Suppressed third-party CSSStyleSheet cross-origin warning]:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Safe global error listener to suppress non-fatal DOM resource load events
  window.addEventListener('error', (event) => {
    if (event && (event.target instanceof HTMLImageElement || event.target instanceof HTMLScriptElement || event.target instanceof HTMLLinkElement)) {
      // Benign resource failure handled by fallback UI
      event.preventDefault?.();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && typeof reason === 'string' && (reason.includes('GSI') || reason.includes('quota'))) {
      event.preventDefault?.();
    }
  });
}

// Register Service Worker for offline PWA & certificate caching
registerCertificateServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <AdminAuthProvider>
          <HomeContentProvider>
            <App />
          </HomeContentProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

