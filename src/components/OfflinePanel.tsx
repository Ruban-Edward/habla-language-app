import { useEffect, useState } from 'react';
import { COURSES } from '../data/courses';
import {
  appOfflineStatus,
  isAppleMobile,
  isStandalone,
  requestPersistentStorage,
  useInstallPrompt,
  useOnline,
  type AppOfflineStatus,
} from '../lib/offline';
import {
  deviceVoiceStatus,
  downloadFrenchVoice,
  frenchModelSizeMb,
  frenchVoiceStatus,
  onVoicesChanged,
  removeFrenchVoice,
  type DeviceVoiceStatus,
  type FrenchVoiceStatus,
  type SpeechProgress,
} from '../lib/speech';
import { CourseBadge, Modal } from './ui';

/** The speech engine (WebAssembly runtime) downloaded alongside the French voice model, in MB uncompressed. */
const FRENCH_ENGINE_MB = 15;

/** Home-screen card that opens the offline panel. */
export function OfflineCard() {
  const [open, setOpen] = useState(false);
  const online = useOnline();
  return (
    <>
      <section className="offline-card card">
        <span className="offline-icon" aria-hidden="true">⇩</span>
        <div>
          <span className="eyebrow">{online ? 'TAKE IT WITH YOU' : 'YOU’RE OFFLINE'}</span>
          <h2>Study offline</h2>
          <p>Install Habla and check which audio works without a connection.</p>
        </div>
        <button type="button" className="btn ghost" onClick={() => setOpen(true)}>
          Offline &amp; audio <span aria-hidden="true">→</span>
        </button>
      </section>
      {open && <OfflinePanel onClose={() => setOpen(false)} />}
    </>
  );
}

function appStatusText(status: AppOfflineStatus | null): { title: string; detail: string; ok: boolean } {
  switch (status) {
    case 'ready':
      return { ok: true, title: 'Lessons are ready offline', detail: 'Lessons, missions, reviews and your phrasebook all work without a connection. Progress is saved on this device.' };
    case 'preparing':
      return { ok: false, title: 'Getting ready for offline use…', detail: 'Keep this page open for a moment while Habla stores its lessons on this device.' };
    case 'development':
      return { ok: false, title: 'Offline mode runs in the built app', detail: 'The development server doesn’t install offline support. Build and preview the app to try it.' };
    case 'unsupported':
      return { ok: false, title: 'This browser can’t store Habla offline', detail: 'Lessons need a connection here. Try a current version of Chrome, Edge, Firefox or Safari.' };
    default:
      return { ok: false, title: 'Checking offline support…', detail: '' };
  }
}

function voiceText(status: DeviceVoiceStatus, name: string): { label: string; detail: string; ok: boolean } {
  switch (status.kind) {
    case 'offline':
      return { ok: true, label: 'Works offline', detail: `Uses your device’s ${name} voice (${status.name}).` };
    case 'online':
      return { ok: false, label: 'Needs a connection', detail: `Your device’s ${name} voice (${status.name}) streams from the internet. To use it offline, install a ${name} voice in your device’s speech or language settings.` };
    case 'missing':
      return { ok: false, label: 'No voice installed', detail: `Install a ${name} text-to-speech voice in your device settings to hear pronunciation.` };
    default:
      return { ok: false, label: 'Not supported', detail: 'This browser can’t play speech.' };
  }
}

function progressText(progress: SpeechProgress | null): string {
  if (!progress) return 'Starting download…';
  if (progress.phase === 'loading-model') return progress.percent === null ? 'Downloading the voice…' : `Downloading the voice: ${progress.percent}%`;
  return 'Preparing the speech engine…';
}

export function OfflinePanel({ onClose }: { onClose: () => void }) {
  const online = useOnline();
  const { canInstall, install } = useInstallPrompt();
  const [appStatus, setAppStatus] = useState<AppOfflineStatus | null>(null);
  const [french, setFrench] = useState<FrenchVoiceStatus | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<SpeechProgress | null>(null);
  const [frenchMessage, setFrenchMessage] = useState('');
  const [, setVoicesVersion] = useState(0);
  const standalone = isStandalone();

  useEffect(() => {
    let active = true;
    const check = () => {
      void appOfflineStatus().then((status) => active && setAppStatus(status));
      void frenchVoiceStatus().then((status) => active && setFrench(status));
    };
    check();
    const timer = window.setInterval(check, 3000);
    const stopVoices = onVoicesChanged(() => setVoicesVersion((v) => v + 1));
    return () => {
      active = false;
      window.clearInterval(timer);
      stopVoices();
    };
  }, []);

  const downloadFrench = async () => {
    setDownloading(true);
    setFrenchMessage('');
    setProgress(null);
    void requestPersistentStorage();
    const result = await downloadFrenchVoice(setProgress);
    setDownloading(false);
    if (!result.ok) setFrenchMessage(`The download didn’t finish: ${result.message}`);
    else if (result.warning) setFrenchMessage(result.warning);
    setFrench(await frenchVoiceStatus());
  };

  const removeFrench = async () => {
    await removeFrenchVoice();
    setFrenchMessage('Removed. The voice will download again the next time you play French audio.');
    setFrench(await frenchVoiceStatus());
  };

  const app = appStatusText(appStatus);

  return (
    <Modal className="offline-modal" onClose={onClose}>
      <div className="offline-dialog">
        <header className="phrasebook-heading">
          <div>
            <span className="eyebrow">STUDY ANYWHERE</span>
            <h2>Offline &amp; audio</h2>
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </header>

        {!online && (
          <p className="offline-notice" role="status">
            You’re offline right now. Anything marked “works offline” is available; cloud sync resumes when you reconnect.
          </p>
        )}

        <section className="offline-section">
          <div className={`offline-status ${app.ok ? 'is-ok' : ''}`}>
            <span aria-hidden="true">{app.ok ? '✓' : '…'}</span>
            <div>
              <strong>{app.title}</strong>
              {app.detail && <p>{app.detail}</p>}
            </div>
          </div>
          {!standalone && (
            <div className="offline-install">
              {canInstall ? (
                <button type="button" className="btn primary" onClick={() => void install()}>Install Habla</button>
              ) : isAppleMobile() ? (
                <p>To install on iPhone or iPad: tap Share, then <strong>Add to Home Screen</strong>.</p>
              ) : (
                <p>To install, use your browser’s <strong>Install app</strong> or <strong>Add to Home Screen</strong> option.</p>
              )}
            </div>
          )}
        </section>

        <section className="offline-section">
          <h3>Pronunciation audio</h3>
          <p className="offline-intro">Lesson text is always offline once the app is stored. Audio depends on the language:</p>
          <ul className="offline-voices">
            {COURSES.map((course) => {
              if (course.lang.toLowerCase().startsWith('fr')) {
                const ready = french === 'downloaded';
                return (
                  <li key={course.id} className="offline-voice">
                    <CourseBadge course={course} size={34} />
                    <div className="offline-voice-copy">
                      <strong>{course.name}</strong>
                      <span className={`offline-pill ${ready ? 'is-ok' : ''}`}>
                        {french === null ? 'Checking…' : ready ? 'Downloaded · works offline' : french === 'unavailable' ? 'Not available in this browser' : 'Download needed'}
                      </span>
                      <p>
                        A built-in voice that runs on your device: about {frenchModelSizeMb} MB for the voice plus up to {FRENCH_ENGINE_MB} MB for the speech engine. Download it before you travel; nothing you study is sent to a speech service.
                      </p>
                      {downloading && <p className="offline-progress" role="status">{progressText(progress)}</p>}
                      {frenchMessage && <p className="offline-message" role="status">{frenchMessage}</p>}
                    </div>
                    <div className="offline-voice-action">
                      {french === 'missing' && (
                        <button type="button" className="btn primary" disabled={downloading || !online} onClick={() => void downloadFrench()}>
                          {downloading ? 'Downloading…' : online ? `Download (~${frenchModelSizeMb + FRENCH_ENGINE_MB} MB)` : 'Connect to download'}
                        </button>
                      )}
                      {ready && (
                        <button type="button" className="btn ghost" onClick={() => void removeFrench()}>Remove</button>
                      )}
                    </div>
                  </li>
                );
              }
              const voice = voiceText(deviceVoiceStatus(course.lang), course.name);
              return (
                <li key={course.id} className="offline-voice">
                  <CourseBadge course={course} size={34} />
                  <div className="offline-voice-copy">
                    <strong>{course.name}</strong>
                    <span className={`offline-pill ${voice.ok ? 'is-ok' : ''}`}>{voice.label}</span>
                    <p>{voice.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Modal>
  );
}
