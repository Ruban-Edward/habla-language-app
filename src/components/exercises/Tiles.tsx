import { useEffect, useState } from 'react';
import { speak } from '../../lib/speech';
import type { TilesExercise } from '../../types';
import { AudioPrompt } from '../ui';
import { Prompt } from './Prompt';
import { langOf, type ExerciseProps } from './types';

export function Tiles({ exercise, course, disabled, sound, onAnswer }: ExerciseProps<TilesExercise>) {
  const [picked, setPicked] = useState<number[]>([]);
  const { tiles } = exercise;
  const answerLang = langOf(course, exercise.answerSide);

  useEffect(() => {
    if (!sound) return;
    if (exercise.audio) speak(exercise.audio, course.lang);
    else if (exercise.promptSide === 't' && exercise.prompt) speak(exercise.prompt, course.lang);
  }, [exercise.audio, exercise.prompt, exercise.promptSide, course.lang, sound]);

  const update = (next: number[]) => {
    if (disabled) return;
    setPicked(next);
    onAnswer(next.length ? next.map((i) => tiles[i]).join(' ') : null);
  };

  const label = (t: string) => (
    <>
      <span>{t}</span>
      {exercise.roman?.[t] && <small className="roman">{exercise.roman[t]}</small>}
    </>
  );

  return (
    <div className="tiles">
      {exercise.audio ? (
        <AudioPrompt text={exercise.audio} lang={course.lang} />
      ) : (
        exercise.prompt && (
          <Prompt
            text={exercise.prompt}
            roman={exercise.promptRoman}
            side={exercise.promptSide ?? 't'}
            course={course}
          />
        )
      )}

      <div className="tile-line" aria-label="Your answer" lang={answerLang}>
        {picked.map((i) => (
          <button
            key={i}
            type="button"
            className="tile"
            disabled={disabled}
            onClick={() => update(picked.filter((x) => x !== i))}
          >
            {label(tiles[i])}
          </button>
        ))}
      </div>

      <div className="tile-bank" aria-label="Word bank" lang={answerLang}>
        {tiles.map((t, i) =>
          picked.includes(i) ? (
            <span key={i} className="tile tile-ghost" aria-hidden="true">
              {label(t)}
            </span>
          ) : (
            <button key={i} type="button" className="tile" disabled={disabled} onClick={() => update([...picked, i])}>
              {label(t)}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
