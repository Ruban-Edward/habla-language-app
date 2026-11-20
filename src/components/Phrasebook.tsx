import { useState } from 'react';
import { COURSES } from '../data/courses';
import type { SavedPhrase } from '../lib/progress';
import { CourseBadge, Modal, SpeakButton } from './ui';

type Props = {
  entries: SavedPhrase[];
  onRemove: (id: string) => void;
};

export function Phrasebook({ entries, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const ordered = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <section className="phrasebook-card card">
        <span className="phrasebook-icon" aria-hidden="true">▤</span>
        <div>
          <span className="eyebrow">KEEP IT CLOSE</span>
          <h2>Your phrasebook</h2>
          <p>{entries.length ? `${entries.length} saved words and phrases` : 'Save useful words and phrases from lesson previews.'}</p>
        </div>
        <button type="button" className="btn ghost" onClick={() => setOpen(true)}>
          Open phrasebook <span aria-hidden="true">→</span>
        </button>
      </section>

      {open && (
        <Modal className="phrasebook-modal" onClose={() => setOpen(false)}>
          <div className="phrasebook-dialog">
            <header className="phrasebook-heading">
              <div><span className="eyebrow">YOUR PERSONAL COLLECTION</span><h2>Phrasebook</h2></div>
              <button type="button" className="icon-btn" aria-label="Close phrasebook" onClick={() => setOpen(false)}>✕</button>
            </header>
            {!ordered.length ? (
              <p className="phrasebook-empty">Save a useful word or example from any lesson preview and it will be waiting here.</p>
            ) : (
              <ul className="phrasebook-list">
                {ordered.map((entry) => {
                  const course = COURSES.find((item) => item.id === entry.courseId);
                  if (!course) return null;
                  return (
                    <li className="phrasebook-entry" key={entry.id}>
                      <CourseBadge course={course} size={34} />
                      <div className="phrasebook-copy">
                        <strong lang={course.lang}>{entry.target}</strong>
                        {entry.roman && <small className="roman">{entry.roman}</small>}
                        <small>{entry.meaning}</small>
                      </div>
                      <SpeakButton text={entry.target} lang={course.lang} label={`Hear ${entry.target}`} />
                      <button
                        type="button"
                        className="icon-btn phrase-remove"
                        aria-label={`Remove ${entry.target} from phrasebook`}
                        onClick={() => onRemove(entry.id)}
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
