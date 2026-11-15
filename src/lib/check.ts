import type { CheckResult, Exercise } from '../types';
import { checkText, toTiles } from './answer';

export function checkExercise(ex: Exercise, answer: string): CheckResult {
  switch (ex.kind) {
    case 'choice': {
      const roman = ex.options.find((o) => o.label === ex.answer)?.roman;
      return { correct: answer === ex.answer, answer: ex.answer, answerRoman: roman };
    }
    case 'tiles': {
      const r = checkText(answer, ex.accepted, { typos: false });
      const map = ex.roman;
      if (map) {
        const parts = toTiles(r.answer).map((w) => map[w]);
        if (parts.every(Boolean)) r.answerRoman = parts.join(' ');
      }
      return r;
    }
    case 'type':
      return checkText(answer, ex.accepted, { typos: true });
    case 'match':
      return { correct: true, answer: '' };
  }
}
