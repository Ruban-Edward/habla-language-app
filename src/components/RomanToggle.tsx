type Props = {
  shown: boolean;
  onToggle: () => void;
  /** Compact form for the lesson header. */
  compact?: boolean;
};

/** Switch romanization on or off for courses written in a non-Latin script. */
export function RomanToggle({ shown, onToggle, compact = false }: Props) {
  if (compact) {
    return (
      <button
        type="button"
        className={`roman-toggle-compact ${shown ? 'is-on' : ''}`}
        aria-pressed={shown}
        aria-label={shown ? 'Hide romanization' : 'Show romanization'}
        title={shown ? 'Hide romanization' : 'Show romanization'}
        onClick={onToggle}
      >
        abc
      </button>
    );
  }
  return (
    <button type="button" role="switch" aria-checked={shown} className="roman-switch" onClick={onToggle}>
      <span className="roman-switch-copy">
        <strong>Show romanization</strong>
        <small>{shown ? 'Latin letters appear under the script.' : 'Script only: tap to bring romanization back.'}</small>
      </span>
      <span className="roman-switch-track" aria-hidden="true"><span /></span>
    </button>
  );
}
