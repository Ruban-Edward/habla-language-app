let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tones(notes: [freq: number, at: number, dur: number][], type: OscillatorType, volume = 0.12) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const [freq, at, dur] of notes) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0 + at);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0 + at);
    osc.stop(t0 + at + dur + 0.02);
  }
}

export const sfx = {
  correct: () => tones([[587, 0, 0.12], [880, 0.09, 0.22]], 'sine'),
  wrong: () => tones([[196, 0, 0.18], [147, 0.12, 0.28]], 'triangle', 0.14),
  pair: () => tones([[740, 0, 0.1]], 'sine', 0.08),
  miss: () => tones([[220, 0, 0.12]], 'triangle', 0.08),
  complete: () =>
    tones([[523, 0, 0.16], [659, 0.12, 0.16], [784, 0.24, 0.16], [1047, 0.36, 0.4]], 'sine', 0.12),
};
