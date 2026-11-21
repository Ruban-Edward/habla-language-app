import { useState } from 'react';
import type { Course, CultureNote } from '../types';
import { SpeakButton } from './ui';

const DAY_MS = 24 * 60 * 60 * 1000;

/** One cultural note a day, with buttons to browse the rest. */
export function CultureCard({ course, now, onSeeAll }: { course: Course; now: number; onSeeAll?: () => void }) {
  const notes = course.culture ?? [];
  const [offset, setOffset] = useState(0);
  if (!notes.length) return null;
  const today = Math.floor(now / DAY_MS);
  const index = (((today + offset) % notes.length) + notes.length) % notes.length;
  const note = notes[index];

  return (
    <section className="culture-card card" aria-labelledby="culture-title">
      <div className="culture-head">
        <span className="eyebrow">CULTURE NOTE · {index + 1}/{notes.length}</span>
        <div className="culture-nav">
          <button type="button" className="icon-btn" aria-label="Previous culture note" onClick={() => setOffset((o) => o - 1)}>‹</button>
          <button type="button" className="icon-btn" aria-label="Next culture note" onClick={() => setOffset((o) => o + 1)}>›</button>
        </div>
      </div>
      <div aria-live="polite">
        <h2 id="culture-title"><span aria-hidden="true">{note.emoji}</span> {note.title}</h2>
        <p>{note.body}</p>
        <CulturePhrase course={course} note={note} />
      </div>
      {onSeeAll && (
        <button type="button" className="link-btn culture-all" onClick={onSeeAll}>
          See all {notes.length} culture notes <span aria-hidden="true">→</span>
        </button>
      )}
    </section>
  );
}

function CulturePhrase({ course, note }: { course: Course; note: CultureNote }) {
  if (!note.phrase) return null;
  return (
    <div className="culture-phrase">
      <div>
        <strong lang={course.lang}>{note.phrase.t}</strong>
        {note.phrase.roman && <small className="roman">{note.phrase.roman}</small>}
        <small>{note.phrase.en}</small>
      </div>
      <SpeakButton text={note.phrase.t} lang={course.lang} label={`Hear ${note.phrase.t}`} />
    </div>
  );
}

/** Every culture note for the course, for the Culture tab. */
export function CultureList({ course }: { course: Course }) {
  const notes = course.culture ?? [];
  return (
    <section className="culture-section" aria-labelledby="culture-list-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CUSTOMS AND MANNERS</span>
          <h2 id="culture-list-title">Culture notes</h2>
        </div>
      </div>
      <p className="missions-intro">Small things that make a big difference when you use your {course.name} for real.</p>
      <ul className="culture-grid">
        {notes.map((note) => (
          <li key={note.id} className="culture-card card">
            <h3><span aria-hidden="true">{note.emoji}</span> {note.title}</h3>
            <p>{note.body}</p>
            <CulturePhrase course={course} note={note} />
          </li>
        ))}
      </ul>
    </section>
  );
}
