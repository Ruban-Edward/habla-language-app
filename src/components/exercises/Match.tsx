import { useState } from 'react';
import { shuffle } from '../../lib/generate';
import { sfx } from '../../lib/sfx';
import { playSpeech } from '../../lib/speechStatus';
import type { MatchExercise } from '../../types';
import type { ExerciseProps } from './types';

export function Match({ exercise, course, disabled, sound, onAnswer }: ExerciseProps<MatchExercise>) {
  const { pairs } = exercise;
  const [left] = useState(() => shuffle(pairs));
  const [right] = useState(() => shuffle(pairs.map((p) => p.en)));
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [miss, setMiss] = useState<{ t: string; en: string } | null>(null);

  const matchedEn = new Set(pairs.filter((p) => matched.includes(p.t)).map((p) => p.en));

  const attempt = (t: string | null, en: string | null) => {
    setSelLeft(t);
    setSelRight(en);
    if (!t || !en) return;
    const pair = pairs.find((p) => p.t === t);
    if (pair?.en === en) {
      const next = [...matched, t];
      setMatched(next);
      setSelLeft(null);
      setSelRight(null);
      if (sound) sfx.pair();
      if (next.length === pairs.length) onAnswer('done');
    } else {
      setMiss({ t, en });
      if (sound) sfx.miss();
      setTimeout(() => {
        setMiss(null);
        setSelLeft(null);
        setSelRight(null);
      }, 650);
    }
  };

  const cls = (side: 't' | 'en', value: string) => {
    const isMatched = side === 't' ? matched.includes(value) : matchedEn.has(value);
    const isSel = side === 't' ? selLeft === value : selRight === value;
    const isMiss = miss && miss[side] === value;
    return `match-card ${isMatched ? 'matched' : ''} ${isSel ? 'selected' : ''} ${isMiss ? 'miss' : ''}`;
  };

  return (
    <div className="match">
      <div className="match-col" lang={course.lang}>
        {left.map(({ t, roman }) => (
          <button
            key={t}
            type="button"
            className={cls('t', t)}
            disabled={disabled || matched.includes(t) || !!miss}
            onClick={() => {
              if (sound) void playSpeech(t, course.lang);
              attempt(selLeft === t ? null : t, selRight);
            }}
          >
            <span>{t}</span>
            {roman && <small className="roman">{roman}</small>}
          </button>
        ))}
      </div>
      <div className="match-col" lang="en">
        {right.map((en) => (
          <button
            key={en}
            type="button"
            className={cls('en', en)}
            disabled={disabled || matchedEn.has(en) || !!miss}
            onClick={() => attempt(selLeft, selRight === en ? null : en)}
          >
            {en}
          </button>
        ))}
      </div>
    </div>
  );
}
