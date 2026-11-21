import { useState } from 'react';
import { COURSES } from '../data/courses';
import { normalize } from '../lib/answer';
import type { SavedPhrase } from '../lib/progress';
import { CourseBadge, SpeakButton } from './ui';

/** Dashboard summary that opens the Phrasebook tab. */
export function PhrasebookCard({ count, onOpen }: { count: number; onOpen: () => void }) {
  return (
    <section className="phrasebook-card card">
      <span className="phrasebook-icon" aria-hidden="true">▤</span>
      <div>
        <span className="eyebrow">KEEP IT CLOSE</span>
        <h2>Your phrasebook</h2>
        <p>{count ? `${count} saved words and phrases` : 'Save useful words and phrases from lesson previews.'}</p>
      </div>
      <button type="button" className="btn ghost" onClick={onOpen}>
        Open phrasebook <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

type Props = {
  entries: SavedPhrase[];
  onRemove: (id: string) => void;
};

/** Every saved word and phrase, with search, for the Phrasebook tab. */
export function PhrasebookPanel({ entries, onRemove }: Props) {
  const [query, setQuery] = useState('');
  const search = normalize(query);
  // Accents and case don't matter, and romanized Hindi finds the Devanagari entry.
  const ordered = entries
    .filter((entry) => !search || normalize(`${entry.target} ${entry.roman ?? ''} ${entry.meaning}`).includes(search))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="phrasebook-section" aria-labelledby="phrasebook-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
          <h2 id="phrasebook-title">Phrasebook</h2>
        </div>
        {entries.length > 0 && <span className="section-progress">{entries.length} <span>saved</span></span>}
      </div>
      {entries.length > 0 && (
        <input
          type="search"
          className="phrasebook-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search saved words"
          aria-label="Search phrasebook"
        />
      )}
      {!entries.length ? (
        <p className="phrasebook-empty">Save a useful word or example from any lesson preview, mission or the translator, and it will be waiting here.</p>
      ) : !ordered.length ? (
        <p className="phrasebook-empty" role="status">No saved phrases match “{query.trim()}”.</p>
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
    </section>
  );
}
