import { primary, romanize } from '../lib/answer';
import type { Course, Lesson, Unit } from '../types';
import { SpeakButton } from './ui';

type Props = {
  course: Course;
  lesson: Lesson;
  unit: Unit;
};

export function LessonPreview({ course, lesson, unit }: Props) {
  const examples = lesson.sentences.slice(0, 2);
  const isScript = lesson.kind === 'script';

  return (
    <section className="lesson-preview" aria-labelledby="lesson-preview-title">
      <header className="lesson-preview-heading">
        <span className="eyebrow">{course.name.toUpperCase()} · {unit.title.toUpperCase()}</span>
        <h2 id="lesson-preview-title">{isScript ? 'Get to know these letters' : 'Get to know these words'}</h2>
        <p>
          {unit.description}. {isScript
            ? 'Explore each letter and hear its sound before you practise.'
            : 'Take a moment to see the meaning and hear each word before you practise.'}
        </p>
      </header>

      <ul className="vocab-list">
        {lesson.words.map((word) => (
          <li className="vocab-card" key={word.t}>
            {word.emoji && <span className="vocab-emoji" aria-hidden="true">{word.emoji}</span>}
            <div className="vocab-copy">
              <span className="vocab-target" lang={course.lang}>{word.t}</span>
              {course.glossary && !isScript && <span className="roman">{romanize(word.t, course.glossary)}</span>}
              <span className="vocab-meaning">{isScript ? `Sound: ${word.en}` : word.en}</span>
            </div>
            <SpeakButton text={word.t} lang={course.lang} label={`Hear ${word.t}`} />
          </li>
        ))}
      </ul>

      {examples.length > 0 && (
        <section className="lesson-examples" aria-labelledby="lesson-examples-title">
          <h3 id="lesson-examples-title">See the words in a sentence</h3>
          {examples.map((sentence, index) => {
            const target = primary(sentence.t);
            return (
              <article className="lesson-example" key={`${target}-${index}`}>
                <div>
                  <p lang={course.lang}>{target}</p>
                  {course.glossary && <small className="roman">{romanize(target, course.glossary)}</small>}
                  <small lang="en">{primary(sentence.en)}</small>
                </div>
                <SpeakButton text={target} lang={course.lang} label={`Hear ${target}`} />
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}
