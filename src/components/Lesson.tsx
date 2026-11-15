import { useCallback, useEffect, useRef, useState } from 'react';
import { checkExercise } from '../lib/check';
import { sfx } from '../lib/sfx';
import type { CheckResult, Course, Exercise, SessionResult } from '../types';
import { Choice } from './exercises/Choice';
import { Match } from './exercises/Match';
import { Tiles } from './exercises/Tiles';
import { TypeAnswer } from './exercises/TypeAnswer';
import { Mascot } from './Mascot';
import { Modal } from './ui';

type Props = {
  course: Course;
  exercises: Exercise[];
  lessonId?: string;
  practice: boolean;
  hearts: number;
  sound: boolean;
  onWrong: () => void;
  onExit: () => void;
  onFinish: (r: SessionResult) => void;
  onOutOfHearts: () => void;
};

const PRAISE = ['Nice!', 'Great job!', 'Correct!', 'You got it!'];

export function Lesson(props: Props) {
  const { course, exercises, lessonId, practice, hearts, sound, onWrong, onExit, onFinish, onOutOfHearts } = props;
  const praise = [...PRAISE, ...course.praise];
  const [queue, setQueue] = useState(exercises);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const startedAt = useRef(Date.now());

  const current = queue[index];
  const total = exercises.length;
  const isRetry = current.key.includes('~');

  const check = useCallback(() => {
    if (result || answer === null) return;
    const r = checkExercise(current, answer);
    setResult(r);
    if (r.correct) {
      setCorrectCount((c) => c + 1);
      if (sound) sfx.correct();
    } else {
      setMistakes((m) => m + 1);
      if (sound) sfx.wrong();
      // Missed exercises come back at the end of the lesson.
      setQueue((q) => [...q, { ...current, key: `${current.key}~${q.length}` }]);
      if (!practice) onWrong();
    }
  }, [answer, current, onWrong, practice, result, sound]);

  const next = useCallback(() => {
    if (!result) return;
    if (!practice && !result.correct && hearts <= 0) {
      setOutOfHearts(true);
      return;
    }
    if (index + 1 >= queue.length) {
      if (sound) sfx.complete();
      onFinish({
        practice,
        lessonId,
        mistakes,
        accuracy: Math.round((100 * total) / (total + mistakes)),
        durationMs: Date.now() - startedAt.current,
      });
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
    setResult(null);
  }, [hearts, index, lessonId, mistakes, onFinish, practice, queue.length, result, sound, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmQuit || outOfHearts) return;
      if (e.key === 'Escape') return setConfirmQuit(true);
      if (e.key !== 'Enter' || e.shiftKey) return;
      // A focused button handles Enter itself; avoid doing the action twice.
      if ((e.target as HTMLElement | null)?.tagName === 'BUTTON') return;
      e.preventDefault();
      if (result) next();
      else check();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [check, confirmQuit, next, outOfHearts, result]);

  const exerciseProps = { course, disabled: !!result, sound, onAnswer: setAnswer };

  return (
    <div className="lesson">
      <header className="lesson-top">
        <button type="button" className="icon-btn" aria-label="Quit lesson" onClick={() => setConfirmQuit(true)}>
          ✕
        </button>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={correctCount}
        >
          <span style={{ width: `${(100 * correctCount) / total}%` }} />
        </div>
        {practice ? (
          <span className="badge">Practice</span>
        ) : (
          <span className="stat stat-heart" aria-label={`${hearts} hearts`}>
            ❤️<b>{hearts}</b>
          </span>
        )}
      </header>

      <main className="lesson-body">
        {isRetry && <p className="retry-tag">↻ Let's try that again</p>}
        <h2 className="instruction">{current.instruction}</h2>
        {current.kind === 'choice' && <Choice key={current.key} exercise={current} {...exerciseProps} />}
        {current.kind === 'tiles' && <Tiles key={current.key} exercise={current} {...exerciseProps} />}
        {current.kind === 'type' && <TypeAnswer key={current.key} exercise={current} {...exerciseProps} />}
        {current.kind === 'match' && <Match key={current.key} exercise={current} {...exerciseProps} />}
      </main>

      <footer className={`lesson-foot ${result ? (result.correct ? 'is-correct' : 'is-wrong') : ''}`}>
        <div className="foot-inner">
          <div className="feedback" aria-live="polite">
            {result && (
              <>
                <Mascot mood={result.correct ? 'cheer' : 'sad'} size={52} />
                <div>
                  <strong>{result.correct ? praise[index % praise.length] : 'Not quite'}</strong>
                  {!result.correct && result.answer && (
                    <p>
                      Correct answer: <span className="answer-text">{result.answer}</span>
                      {result.answerRoman && <span className="roman-inline"> ({result.answerRoman})</span>}
                    </p>
                  )}
                  {result.note && <p>{result.note}</p>}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className={`btn ${result && !result.correct ? 'danger' : 'primary'}`}
            disabled={!result && answer === null}
            onClick={result ? next : check}
          >
            {result ? 'Continue' : 'Check'}
          </button>
        </div>
      </footer>

      {confirmQuit && (
        <Modal onClose={() => setConfirmQuit(false)}>
          <Mascot mood="sad" size={80} />
          <h2>Quit this {practice ? 'practice' : 'lesson'}?</h2>
          <p>Your progress in this {practice ? 'practice' : 'lesson'} will be lost.</p>
          <div className="modal-actions">
            <button type="button" className="btn primary" autoFocus onClick={() => setConfirmQuit(false)}>
              Keep learning
            </button>
            <button type="button" className="btn ghost danger-text" onClick={onExit}>
              Quit
            </button>
          </div>
        </Modal>
      )}

      {outOfHearts && (
        <Modal>
          <Mascot mood="sad" size={80} />
          <h2>You're out of hearts</h2>
          <p>Hearts refill over time, or you can earn one back with a practice session.</p>
          <div className="modal-actions">
            <button type="button" className="btn primary" autoFocus onClick={onOutOfHearts}>
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
