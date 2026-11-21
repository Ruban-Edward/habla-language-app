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
  builtInVoiceLanguage,
  builtInVoiceSizeMb,
  builtInVoiceStatus,
  deviceVoiceStatus,
  downloadBuiltInVoice,
  onVoicesChanged,
  removeBuiltInVoice,
  SPEECH_ENGINE_MB,
  type BuiltInVoiceStatus,
  type DeviceVoiceStatus,
  type SpeechProgress,
  type VoiceLanguage,
} from '../lib/speech';
import type { Course } from '../types';
import { CourseBadge, Modal } from './ui';

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

const BUILT_IN_LANGUAGES: VoiceLanguage[] = ['fr', 'es', 'hi'];

/** One language's built-in voice: its status, with download and remove buttons. */
function BuiltInVoiceRow({ course, language, online }: { course: Course; language: VoiceLanguage; online: boolean }) {
  const [status, setStatus] = useState<BuiltInVoiceStatus | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<SpeechProgress | null>(null);
  const [message, setMessage] = useState('');
  const size = builtInVoiceSizeMb(language);

  useEffect(() => {
    let active = true;
    const check = () => void builtInVoiceStatus(language).then((next) => active && setStatus(next));
    check();
    const timer = window.setInterval(check, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [language]);

  const download = async () => {
    setDownloading(true);
    setMessage('');
    setProgress(null);
    void requestPersistentStorage();
    const result = await downloadBuiltInVoice(language, setProgress);
    setDownloading(false);
    if (!result.ok) setMessage(`The download didn’t finish: ${result.message}`);
    else if (result.warning) setMessage(result.warning);
    setStatus(await builtInVoiceStatus(language));
  };

  const remove = async () => {
    await removeBuiltInVoice(language);
    setMessage(`Removed. The voice will download again the next time you play ${course.name} audio.`);
    setStatus(await builtInVoiceStatus(language));
  };

  const ready = status === 'downloaded';
  return (
    <li className="offline-voice">
      <CourseBadge course={course} size={34} />
      <div className="offline-voice-copy">
        <strong>{course.name}</strong>
        <span className={`offline-pill ${ready ? 'is-ok' : ''}`}>
          {status === null ? 'Checking…' : ready ? 'Downloaded · works offline' : status === 'unavailable' ? 'Not available in this browser' : 'Download needed'}
        </span>
        <p>
          About {size} MB. It downloads the first time you play {course.name} audio; download it now to have it offline.
        </p>
        {downloading && <p className="offline-progress" role="status">{progressText(progress)}</p>}
        {message && <p className="offline-message" role="status">{message}</p>}
      </div>
      <div className="offline-voice-action">
        {status === 'missing' && (
          <button type="button" className="btn primary" disabled={downloading || !online} onClick={() => void download()}>
            {downloading ? 'Downloading…' : online ? `Download (~${size} MB)` : 'Connect to download'}
          </button>
        )}
        {ready && (
          <button type="button" className="btn ghost" onClick={() => void remove()}>Remove</button>
        )}
      </div>
    </li>
  );
}

export function OfflinePanel({ onClose }: { onClose: () => void }) {
  const online = useOnline();
  const { canInstall, install } = useInstallPrompt();
  const [appStatus, setAppStatus] = useState<AppOfflineStatus | null>(null);
  const [, setVoicesVersion] = useState(0);
  const standalone = isStandalone();

  useEffect(() => {
    let active = true;
    const check = () => void appOfflineStatus().then((status) => active && setAppStatus(status));
    check();
    const timer = window.setInterval(check, 3000);
    const stopVoices = onVoicesChanged(() => setVoicesVersion((v) => v + 1));
    return () => {
      active = false;
      window.clearInterval(timer);
      stopVoices();
    };
  }, []);

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
          <p className="offline-intro">
            Lesson text is always offline once the app is stored. Pronunciation comes from built-in voices that run on your
            device, so nothing you study is sent to a speech service. The speech engine they share adds up to {SPEECH_ENGINE_MB} MB
            to the first download.
          </p>
          <ul className="offline-voices">
            {COURSES.map((course) => {
              const language = builtInVoiceLanguage(course.lang);
              if (language && BUILT_IN_LANGUAGES.includes(language)) {
                return <BuiltInVoiceRow key={course.id} course={course} language={language} online={online} />;
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
