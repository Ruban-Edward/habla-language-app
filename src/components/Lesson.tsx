import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { findLesson, unitOf } from '../data/courses';
import { checkExercise } from '../lib/check';
import { sfx } from '../lib/sfx';
import type { CheckResult, Course, Exercise, SessionResult } from '../types';
import { Choice } from './exercises/Choice';
import { Match } from './exercises/Match';
import { Tiles } from './exercises/Tiles';
import { TypeAnswer } from './exercises/TypeAnswer';
import { Speak } from './exercises/Speak';
import { LessonPreview } from './LessonPreview';
import { Mascot } from './Mascot';
import { Modal } from './ui';
import type { SavedPhrase } from '../lib/progress';
import { RomanToggle } from './RomanToggle';

type Props = {
  course: Course;
  exercises: Exercise[];
  lessonId?: string;
  practice: boolean;
  hearts: number;
  sound: boolean;
  savedPhrases: SavedPhrase[];
  showRoman: boolean;
  userId: string | null;
  onToggleRoman: () => void;
  onTogglePhrase: (phrase: Omit<SavedPhrase, 'id' | 'createdAt'>) => void;
  onReview: (targets: string[], correct: boolean) => void;
  onWrong: () => void;
  onExit: () => void;
  onFinish: (r: SessionResult) => void;
  onOutOfHearts: () => void;
  /** The learner can't talk right now: speaking exercises pause for a while. */
  onSkipSpeaking?: () => void;
  /** Label in the header instead of “Practice” (for example “Story”). */
  badge?: string;
  /** Shown above every exercise, such as the story being asked about. */
  context?: ReactNode;
};

const PRAISE = ['Nice!', 'Great job!', 'Correct!', 'You got it!'];

export function Lesson(props: Props) {
  const {
    course,
    exercises,
    lessonId,
    practice,
    hearts,
    sound,
    savedPhrases,
    showRoman,
    userId,
    onToggleRoman,
    onTogglePhrase,
    onReview,
    onWrong,
    onExit,
    onFinish,
    onOutOfHearts,
    onSkipSpeaking,
    badge,
    context,
  } = props;
  const lesson = lessonId ? findLesson(course, lessonId) : undefined;
  const [showPreview, setShowPreview] = useState(!practice && !!lesson?.words.length);
  const praise = [...PRAISE, ...course.praise];
  const [queue, setQueue] = useState(exercises);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [outOfHearts, setOutOfHearts] = useState(false);
  // Exercises that count toward the progress bar and accuracy; skipped speaking exercises are taken out.
  const [total, setTotal] = useState(exercises.length);
  const startedAt = useRef(Date.now());
  const reviewedWords = useRef(new Set<string>());

  const current = queue[index];
  const isRetry = current.key.includes('~');

  const check = useCallback(() => {
    if (result || answer === null) return;
    const r = checkExercise(current, answer);
    setResult(r);
    if (!current.key.includes('~')) {
      const newReviewIds = (current.reviewIds ?? []).filter((id) => !reviewedWords.current.has(id));
      for (const id of newReviewIds) reviewedWords.current.add(id);
      if (newReviewIds.length) onReview(newReviewIds, r.correct);
    }
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
  }, [answer, current, onReview, onWrong, practice, result, sound]);

  const finish = useCallback((counted: number) => {
    if (sound) sfx.complete();
    onFinish({
      practice,
      lessonId,
      mistakes,
      accuracy: counted + mistakes > 0 ? Math.round((100 * counted) / (counted + mistakes)) : 100,
      durationMs: Date.now() - startedAt.current,
    });
  }, [lessonId, mistakes, onFinish, practice, sound]);

  const next = useCallback(() => {
    if (!result) return;
    if (!practice && !result.correct && hearts <= 0) {
      setOutOfHearts(true);
      return;
    }
    if (index + 1 >= queue.length) return finish(total);
    setIndex((i) => i + 1);
    setAnswer(null);
    setResult(null);
  }, [finish, hearts, index, practice, queue.length, result, total]);

  /** Drop this and every later speaking exercise, with no mistake recorded. */
  const skipSpeaking = () => {
    const later = queue.slice(index);
    const kept = later.filter((exercise) => exercise.kind !== 'speak');
    const removed = later.filter((exercise) => exercise.kind === 'speak' && !exercise.key.includes('~')).length;
    const nextTotal = total - removed;
    onSkipSpeaking?.();
    setTotal(nextTotal);
    if (!kept.length) return finish(nextTotal);
    setQueue([...queue.slice(0, index), ...kept]);
    setAnswer(null);
    setResult(null);
  };

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
          aria-label={showPreview ? 'Lesson introduction' : 'Lesson progress'}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={showPreview ? 0 : Math.min(correctCount, total)}
        >
          <span style={{ width: `${showPreview ? 0 : Math.min(100, (100 * correctCount) / Math.max(1, total))}%` }} />
        </div>
        {course.glossary && <RomanToggle compact shown={showRoman} onToggle={onToggleRoman} />}
        {practice ? (
          <span className="badge">{badge ?? 'Practice'}</span>
        ) : (
          <span className="stat stat-heart" aria-label={`${hearts} hearts`}>
            ❤️<b>{hearts}</b>
          </span>
        )}
      </header>

      <main className="lesson-body">
        {showPreview && lesson ? (
          <LessonPreview
            course={course}
            lesson={lesson}
            unit={unitOf(course, lesson.id)}
            savedPhrases={savedPhrases}
            userId={userId}
            onTogglePhrase={onTogglePhrase}
          />
        ) : (
          <>
            {context}
            {isRetry && <p className="retry-tag">↻ Let's try that again</p>}
            <h2 className="instruction">{current.instruction}</h2>
            {current.kind === 'choice' && <Choice key={current.key} exercise={current} {...exerciseProps} />}
            {current.kind === 'tiles' && <Tiles key={current.key} exercise={current} {...exerciseProps} />}
            {current.kind === 'type' && <TypeAnswer key={current.key} exercise={current} {...exerciseProps} />}
            {current.kind === 'match' && <Match key={current.key} exercise={current} {...exerciseProps} />}
            {current.kind === 'speak' && <Speak key={current.key} exercise={current} {...exerciseProps} />}
          </>
        )}
      </main>

      <footer className={`lesson-foot ${showPreview ? '' : result ? (result.correct ? 'is-correct' : 'is-wrong') : ''}`}>
        <div className="foot-inner">
          {showPreview ? (
            <button type="button" className="btn primary" onClick={() => setShowPreview(false)}>
              Start lesson <span aria-hidden="true">→</span>
            </button>
          ) : (
            <>
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
              {current.kind === 'speak' && !result && (
                <button type="button" className="btn ghost skip-speaking" onClick={skipSpeaking}>
                  Can’t speak now
                </button>
              )}
              <button
                type="button"
                className={`btn ${result && !result.correct ? 'danger' : 'primary'}`}
                disabled={!result && answer === null}
                onClick={result ? next : check}
              >
                {result ? 'Continue' : 'Check'}
              </button>
            </>
          )}
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
