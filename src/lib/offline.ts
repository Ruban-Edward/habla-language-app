import { useEffect, useState } from 'react';

/** The browser's install prompt event (Chromium only; not yet in the DOM typings). */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let installEvent: InstallPromptEvent | null = null;
const installListeners = new Set<() => void>();
const notifyInstall = () => installListeners.forEach((listener) => listener());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event as InstallPromptEvent;
    notifyInstall();
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    notifyInstall();
  });
}

/** Register the service worker in production builds so the app opens and works offline. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.warn('Offline support could not be enabled.', error);
    });
  });
}

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isAppleMobile(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** Whether the browser offered to install the app, and a function to show its prompt. */
export function useInstallPrompt(): { canInstall: boolean; install: () => Promise<boolean> } {
  const [canInstall, setCanInstall] = useState(installEvent !== null);
  useEffect(() => {
    const update = () => setCanInstall(installEvent !== null);
    installListeners.add(update);
    update();
    return () => {
      installListeners.delete(update);
    };
  }, []);
  const install = async () => {
    const event = installEvent;
    if (!event) return false;
    await event.prompt();
    const { outcome } = await event.userChoice;
    installEvent = null;
    notifyInstall();
    return outcome === 'accepted';
  };
  return { canInstall, install };
}

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

export type AppOfflineStatus = 'ready' | 'preparing' | 'development' | 'unsupported';

/** Whether lessons are stored for offline use: the service worker is active and its app shell is cached. */
export async function appOfflineStatus(): Promise<AppOfflineStatus> {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return 'unsupported';
  if (!import.meta.env.PROD) return 'development';
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) return 'preparing';
    const keys = await window.caches.keys();
    return keys.some((key) => key.startsWith('habla-shell-')) ? 'ready' : 'preparing';
  } catch {
    return 'unsupported';
  }
}

/** Ask the browser to keep this site's storage (so offline lessons and voices aren't evicted). */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
