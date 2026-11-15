import type { SessionResult } from '../types';
import { Mascot } from './Mascot';
import { formatDuration } from './ui';

type Props = {
  result: SessionResult;
  xp: number;
  streak: number;
  streakUp: boolean;
  heartGained: boolean;
  goalJustMet: boolean;
  onContinue: () => void;
};

export function Complete({ result, xp, streak, streakUp, heartGained, goalJustMet, onContinue }: Props) {
  return (
    <main className="complete">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i % 6) * 0.12}s` }} />
        ))}
      </div>
      <Mascot mood="cheer" size={128} />
      <h1>{result.practice ? 'Practice complete!' : 'Lesson complete!'}</h1>
      {result.mistakes === 0 && <p className="perfect">Perfect, no mistakes ✨</p>}

      <div className="stat-cards">
        <div className="stat-card c-xp">
          <span>XP earned</span>
          <strong>+{xp}</strong>
        </div>
        <div className="stat-card c-acc">
          <span>Accuracy</span>
          <strong>{result.accuracy}%</strong>
        </div>
        <div className="stat-card c-time">
          <span>Time</span>
          <strong>{formatDuration(result.durationMs)}</strong>
        </div>
      </div>

      <ul className="rewards">
        {streakUp && <li>🔥 {streak}-day streak!</li>}
        {goalJustMet && <li>🎯 Daily goal reached</li>}
        {heartGained && <li>❤️ +1 heart</li>}
      </ul>

      <button type="button" className="btn primary wide" autoFocus onClick={onContinue}>
        Continue
      </button>
    </main>
  );
}
