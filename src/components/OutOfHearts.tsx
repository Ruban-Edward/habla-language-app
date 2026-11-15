import { Mascot } from './Mascot';
import { formatDuration } from './ui';

type Props = { msUntilNext: number | null; onPractice: () => void; onHome: () => void };

export function OutOfHearts({ msUntilNext, onPractice, onHome }: Props) {
  return (
    <main className="complete">
      <Mascot mood="sad" size={120} />
      <h1>Out of hearts</h1>
      <p className="muted">
        {msUntilNext !== null ? `Next heart in ${formatDuration(msUntilNext)}.` : 'Your hearts are back!'} Practice
        doesn't cost hearts, and finishing a session earns one back.
      </p>
      <button type="button" className="btn primary wide" autoFocus onClick={onPractice}>
        Practice to earn a heart
      </button>
      <button type="button" className="btn ghost wide" onClick={onHome}>
        Back home
      </button>
    </main>
  );
}
