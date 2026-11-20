import type { Course, UsageNote } from '../types';
import { SpeakButton } from './ui';

type Props = {
  course: Course;
  notes: UsageNote[];
  /** Expanded on first view of a unit; collapsed elsewhere so it doesn't crowd the page. */
  defaultOpen?: boolean;
  className?: string;
};

export function UsageNotes({ course, notes, defaultOpen = false, className = '' }: Props) {
  if (!notes.length) return null;
  return (
    <details className={`usage-notes ${className}`} open={defaultOpen}>
      <summary>
        <span className="usage-notes-icon" aria-hidden="true">✎</span>
        <span>
          <strong>How it works</strong>
          <small>{notes.length} usage note{notes.length === 1 ? '' : 's'}</small>
        </span>
        <span className="usage-notes-caret" aria-hidden="true">▾</span>
      </summary>
      <div className="usage-notes-list">
        {notes.map((note) => (
          <article className="usage-note" key={note.title}>
            <h4>{note.title}</h4>
            <p>{note.body}</p>
            {note.examples && (
              <ul>
                {note.examples.map((example) => (
                  <li key={example.t}>
                    <div>
                      <span lang={course.lang}>{example.t}</span>
                      {example.roman && <small className="roman">{example.roman}</small>}
                      <small>{example.en}</small>
                    </div>
                    <SpeakButton text={example.t.replace(/[→/]/g, ',')} lang={course.lang} label={`Hear ${example.t}`} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </details>
  );
}
