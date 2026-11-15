import type { Course, Side } from '../../types';
import { Mascot } from '../Mascot';
import { SpeakButton } from '../ui';
import { langOf } from './types';

/** The mascot "saying" the sentence to translate. */
export function Prompt({ text, roman, side, course }: { text: string; roman?: string; side: Side; course: Course }) {
  return (
    <div className="prompt">
      <Mascot mood="think" size={72} />
      <div className="bubble">
        {side === 't' && <SpeakButton text={text} lang={course.lang} />}
        <span className="bubble-text">
          <span lang={langOf(course, side)}>{text}</span>
          {roman && <small className="roman">{roman}</small>}
        </span>
      </div>
    </div>
  );
}
