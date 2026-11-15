export type Mood = 'happy' | 'sad' | 'cheer' | 'think';

const MOUTHS: Record<Mood, string> = {
  happy: 'M40 58 Q50 68 60 58',
  cheer: 'M38 56 Q50 74 62 56 Z',
  sad: 'M40 64 Q50 55 60 64',
  think: 'M42 62 L58 60',
};

/** Pip, the app's speech-bubble mascot. */
export function Mascot({ mood = 'happy', size = 64 }: { mood?: Mood; size?: number }) {
  const look = mood === 'think' ? 3 : mood === 'sad' ? -1 : 1;
  return (
    <svg className={`mascot mascot-${mood}`} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path
        d="M50 8C76 8 92 24 92 46S76 82 54 82L38 95l3-14C21 76 8 63 8 46 8 24 24 8 50 8Z"
        fill="var(--mascot)"
      />
      <ellipse cx="27" cy="57" rx="6" ry="3.5" fill="#fff" opacity=".35" />
      <ellipse cx="73" cy="57" rx="6" ry="3.5" fill="#fff" opacity=".35" />
      <circle cx="36" cy="42" r="10" fill="#fff" />
      <circle cx="64" cy="42" r="10" fill="#fff" />
      <circle cx={36 + look} cy={mood === 'sad' ? 45 : 43} r="5" fill="#1d1b2e" />
      <circle cx={64 + look} cy={mood === 'sad' ? 45 : 43} r="5" fill="#1d1b2e" />
      {mood === 'sad' && (
        <g stroke="#1d1b2e" strokeWidth="3" strokeLinecap="round">
          <path d="M28 28 L42 31" />
          <path d="M72 28 L58 31" />
        </g>
      )}
      <path
        d={MOUTHS[mood]}
        stroke="#1d1b2e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={mood === 'cheer' ? '#1d1b2e' : 'none'}
      />
    </svg>
  );
}
