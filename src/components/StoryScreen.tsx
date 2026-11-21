import { useMemo, useState } from 'react';
import { shuffle } from '../lib/generate';
import type { SavedPhrase } from '../lib/progress';
import { playSpeech } from '../lib/speechStatus';
import type { Course, Exercise, SessionResult, Story } from '../types';
import { Lesson } from './Lesson';
import { RomanToggle } from './RomanToggle';
import { SpeakButton } from './ui';

type Props = {
  course: Course;
  story: Story;
  sound: boolean;
  showRoman: boolean;
  savedPhrases: SavedPhrase[];
  userId: string | null;
  onToggleRoman: () => void;
  onExit: () => void;
  onFinish: (result: SessionResult) => void;
};

/** Comprehension questions become ordinary choice exercises, so the lesson engine runs them. */
function questionsOf(story: Story): Exercise[] {
  return story.questions.map((q, i) => ({
    kind: 'choice',
    key: `${story.id}-q${i}`,
    instruction: q.question,
    optionSide: 'en',
    options: shuffle(q.options).map((label) => ({ label })),
    answer: q.answer,
  }));
}

/** Read a five-sentence story (tap a line for its meaning), then answer questions about it. */
export function StoryScreen(props: Props) {
  const { course, story, sound, showRoman, savedPhrases, userId, onToggleRoman, onExit, onFinish } = props;
  const [phase, setPhase] = useState<'read' | 'quiz'>('read');
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const exercises = useMemo(() => questionsOf(story), [story]);

  const toggleLine = (i: number) =>
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const lines = (compact: boolean) => (
    <ol className={`story-lines ${compact ? 'is-compact' : ''}`}>
      {story.lines.map((line, i) => {
        const open = revealed.has(i);
        return (
          <li key={i} className="story-line">
            {!compact && <SpeakButton text={line.t} lang={course.lang} label={`Hear ${line.t}`} />}
            <button type="button" className="story-line-text" aria-expanded={open} onClick={() => toggleLine(i)}>
              <span lang={course.lang}>{line.t}</span>
              {line.roman && <small className="roman">{line.roman}</small>}
              <small className="story-line-meaning">{open ? line.en : 'Tap for the meaning'}</small>
            </button>
          </li>
        );
      })}
    </ol>
  );

  if (phase === 'quiz') {
    return (
      <Lesson
        course={course}
        exercises={exercises}
        practice
        badge="Story"
        hearts={0}
        sound={sound}
        savedPhrases={savedPhrases}
        showRoman={showRoman}
        userId={userId}
        onToggleRoman={onToggleRoman}
        onTogglePhrase={() => {}}
        onReview={() => {}}
        onWrong={() => {}}
        onExit={onExit}
        onOutOfHearts={onExit}
        onFinish={(result) => onFinish({ ...result, practice: false, storyId: story.id })}
        context={
          <details className="story-recap">
            <summary>Read the story again</summary>
            {lines(true)}
          </details>
        }
      />
    );
  }

  return (
    <div className="lesson story">
      <header className="lesson-top">
        <button type="button" className="icon-btn" aria-label="Close story" onClick={onExit}>✕</button>
        <h1 className="story-top-title">{story.title}</h1>
        {course.glossary && <RomanToggle compact shown={showRoman} onToggle={onToggleRoman} />}
        <span className="badge">Story</span>
      </header>

      <main className="lesson-body story-body">
        <section className="mission-scenario">
          <span className="mission-emoji" aria-hidden="true">{story.emoji}</span>
          <div>
            <span className="eyebrow">MINI-STORY</span>
            <h2>{story.title}</h2>
            <p>{story.summary}</p>
          </div>
        </section>
        <div className="story-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => void playSpeech(story.lines.map((line) => line.t).join(' '), course.lang)}
          >
            <span aria-hidden="true">▶</span> Listen to the story
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => setRevealed(revealed.size === story.lines.length ? new Set() : new Set(story.lines.map((_, i) => i)))}
          >
            {revealed.size === story.lines.length ? 'Hide all meanings' : 'Show all meanings'}
          </button>
        </div>
        {lines(false)}
      </main>

      <footer className="lesson-foot">
        <div className="foot-inner">
          <p className="story-foot-note">{story.questions.length} questions about the story</p>
          <button type="button" className="btn primary" onClick={() => setPhase('quiz')}>
            Answer questions <span aria-hidden="true">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
