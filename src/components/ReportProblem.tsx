import { useState, type FormEvent } from 'react';
import { CONTENT_ISSUES, errorMessage, reportContent, supabase, type ContentIssue } from '../lib/supabase';
import type { Course } from '../types';
import { Modal } from './ui';

type Item = { target: string; meaning: string };

type Props = {
  course: Course;
  /** Lesson or mission id. */
  context: string;
  items: Item[];
  /** Signed-in user id, or null when signed out. */
  userId: string | null;
};

/** Lets learners flag a word or phrase so fluent speakers can check it. */
export function ReportProblem({ course, context, items, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [issue, setIssue] = useState<ContentIssue>('translation');
  const [comment, setComment] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }>({ kind: 'idle' });

  if (!items.length) return null;

  const close = () => {
    setOpen(false);
    if (state.kind === 'sent') {
      setState({ kind: 'idle' });
      setComment('');
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    const item = items[itemIndex];
    setState({ kind: 'sending' });
    try {
      await reportContent(userId, { course_id: course.id, context, target: item.target, meaning: item.meaning, issue, comment });
      setState({ kind: 'sent' });
    } catch (error) {
      setState({ kind: 'error', message: errorMessage(error) });
    }
  };

  return (
    <>
      <button type="button" className="link-btn report-link" onClick={() => setOpen(true)}>
        Report a problem with this content
      </button>
      {open && (
        <Modal className="report-modal" onClose={close}>
          <div className="report-dialog">
            <header className="phrasebook-heading">
              <div>
                <span className="eyebrow">HELP US IMPROVE</span>
                <h2>Report a problem</h2>
              </div>
              <button type="button" className="icon-btn" aria-label="Close" onClick={close}>✕</button>
            </header>
            {!supabase ? (
              <p className="report-note">Reporting needs the optional account setup described in the README.</p>
            ) : !userId ? (
              <p className="report-note">Sign in to send a report. Reports go to the people who review the course content.</p>
            ) : state.kind === 'sent' ? (
              <>
                <p className="report-note">Thank you. Fluent speakers review every report before changing a course.</p>
                <button type="button" className="btn primary" onClick={close}>Done</button>
              </>
            ) : (
              <form className="report-form" onSubmit={(event) => void submit(event)}>
                <label>
                  <span>Which word or phrase?</span>
                  <select value={itemIndex} onChange={(event) => setItemIndex(Number(event.target.value))}>
                    {items.map((item, index) => (
                      <option key={`${item.target}-${index}`} value={index}>
                        {item.target} · {item.meaning}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend>What’s wrong?</legend>
                  {CONTENT_ISSUES.map((option) => (
                    <label key={option.id} className="report-option">
                      <input
                        type="radio"
                        name="issue"
                        value={option.id}
                        checked={issue === option.id}
                        onChange={() => setIssue(option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </fieldset>
                <label>
                  <span>Details (optional)</span>
                  <textarea
                    value={comment}
                    maxLength={1000}
                    rows={3}
                    placeholder="For example, how you would say it, or where it’s said differently"
                    onChange={(event) => setComment(event.target.value)}
                  />
                </label>
                {state.kind === 'error' && <p className="account-error" role="alert">{state.message}</p>}
                <button type="submit" className="btn primary" disabled={state.kind === 'sending'}>
                  {state.kind === 'sending' ? 'Sending…' : 'Send report'}
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
