import { useEffect, useRef, useState } from 'react';
import { playSpeech } from '../../lib/speechStatus';
import type { TypeExercise } from '../../types';
import { Prompt } from './Prompt';
import { langOf, type ExerciseProps } from './types';

export function TypeAnswer({ exercise, course, disabled, sound, onAnswer }: ExerciseProps<TypeExercise>) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const answerInTarget = exercise.answerSide === 't';

  useEffect(() => {
    if (sound && exercise.promptSide === 't') void playSpeech(exercise.prompt, course.lang);
  }, [exercise.prompt, exercise.promptSide, course.lang, sound]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const change = (v: string) => {
    setValue(v);
    onAnswer(v.trim() ? v : null);
  };

  const insert = (ch: string) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    change(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  return (
    <div className="type-answer">
      <Prompt text={exercise.prompt} roman={exercise.promptRoman} side={exercise.promptSide} course={course} />
      <textarea
        ref={ref}
        className="answer-input"
        value={value}
        disabled={disabled}
        onChange={(e) => change(e.target.value)}
        placeholder={answerInTarget ? course.typePlaceholder : 'Type in English'}
        rows={3}
        lang={langOf(course, exercise.answerSide)}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        aria-label="Your answer"
      />
      {answerInTarget && course.specialChars.length > 0 && (
        <div className="accent-keys" aria-label={`${course.name} characters`}>
          {course.specialChars.map((k) => (
            <button
              key={k}
              type="button"
              className="key"
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
