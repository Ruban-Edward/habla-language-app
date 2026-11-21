import { useEffect, useState } from 'react';
import { playSpeech } from '../../lib/speechStatus';
import type { ChoiceExercise } from '../../types';
import { AudioPrompt } from '../ui';
import { langOf, type ExerciseProps } from './types';

export function Choice({ exercise, course, disabled, sound, onAnswer }: ExerciseProps<ChoiceExercise>) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (exercise.audio && sound) void playSpeech(exercise.audio, course.lang);
  }, [exercise.audio, course.lang, sound]);

  const choose = (i: number) => {
    if (disabled) return;
    setSelected(i);
    onAnswer(exercise.options[i].label);
    const s = exercise.options[i].speak;
    if (s && sound && !exercise.audio) void playSpeech(s, course.lang);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= exercise.options.length) choose(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const withArt = exercise.options.some((o) => o.emoji);
  const optionLang = langOf(course, exercise.optionSide);
  const glyphs = exercise.optionSide === 't' && !withArt && exercise.options.every((o) => o.label.length <= 2);
  // Phrase-length answers, and odd sets like a story's three answers, read better as a list than a grid.
  const long = !withArt && !glyphs && (exercise.options.length % 2 === 1 || exercise.options.some((o) => o.label.length > 16));
  return (
    <div className="choice">
      {exercise.audio && <AudioPrompt text={exercise.audio} lang={course.lang} />}
      {exercise.prompt && (
        <div className="glyph-card" lang={course.lang}>
          {exercise.prompt}
        </div>
      )}
      <div className={`choice-grid ${withArt ? 'with-art' : ''} ${glyphs ? 'glyphs' : ''} ${long ? 'long-options' : ''}`}>
        {exercise.options.map((o, i) => (
          <button
            key={o.label}
            type="button"
            className={`choice-card ${selected === i ? 'selected' : ''}`}
            aria-pressed={selected === i}
            disabled={disabled}
            onClick={() => choose(i)}
          >
            {o.emoji && <span className="choice-art">{o.emoji}</span>}
            <span className="choice-label" lang={optionLang}>
              {o.label}
            </span>
            {o.roman && <small className="roman">{o.roman}</small>}
            <kbd>{i + 1}</kbd>
          </button>
        ))}
      </div>
    </div>
  );
}
