import { primary, romanize } from '../lib/answer';
import type { PhraseDraft, SavedPhrase } from '../lib/progress';
import type { Course, Lesson, Unit } from '../types';
import { ReportProblem } from './ReportProblem';
import { SpeakButton } from './ui';
import { UsageNotes } from './UsageNotes';

type Props = {
  course: Course;
  lesson: Lesson;
  unit: Unit;
  savedPhrases: SavedPhrase[];
  userId: string | null;
  onTogglePhrase: (phrase: PhraseDraft) => void;
};

export function LessonPreview({ course, lesson, unit, savedPhrases, userId, onTogglePhrase }: Props) {
  const examples = lesson.sentences.slice(0, 2);
  const isScript = lesson.kind === 'script';
  const savedIds = new Set(savedPhrases.map((phrase) => phrase.id));
  const phraseDraft = (target: string, meaning: string): PhraseDraft => {
    const roman = course.glossary ? romanize(target, course.glossary) : undefined;
    return { courseId: course.id, target, meaning, ...(roman ? { roman } : {}) };
  };

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
            <button
              type="button"
              className={`phrase-save ${savedIds.has(`${course.id}:${word.t}`) ? 'is-saved' : ''}`}
              aria-pressed={savedIds.has(`${course.id}:${word.t}`)}
              onClick={() => onTogglePhrase(phraseDraft(word.t, word.en))}
            >
              {savedIds.has(`${course.id}:${word.t}`) ? 'Saved' : 'Save'}
            </button>
            <SpeakButton text={word.t} lang={course.lang} label={`Hear ${word.t}`} />
          </li>
        ))}
      </ul>

      {examples.length > 0 && (
        <section className="lesson-examples" aria-labelledby="lesson-examples-title">
          <h3 id="lesson-examples-title">See the words in a sentence</h3>
          {examples.map((sentence, index) => {
            const target = primary(sentence.t);
            const meaning = primary(sentence.en);
            const saved = savedIds.has(`${course.id}:${target}`);
            return (
              <article className="lesson-example" key={`${target}-${index}`}>
                <div>
                  <p lang={course.lang}>{target}</p>
                  {course.glossary && <small className="roman">{romanize(target, course.glossary)}</small>}
                  <small lang="en">{meaning}</small>
                </div>
                <button
                  type="button"
                  className={`phrase-save ${saved ? 'is-saved' : ''}`}
                  aria-pressed={saved}
                  onClick={() => onTogglePhrase(phraseDraft(target, meaning))}
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
                <SpeakButton text={target} lang={course.lang} label={`Hear ${target}`} />
              </article>
            );
          })}
        </section>
      )}

      {unit.notes && <UsageNotes course={course} notes={unit.notes} defaultOpen={unit.lessons[0]?.id === lesson.id} />}

      {!isScript && (
        <ReportProblem
          course={course}
          context={lesson.id}
          items={[
            ...lesson.words.map((word) => ({ target: word.t, meaning: word.en })),
            ...lesson.sentences.map((sentence) => ({ target: primary(sentence.t), meaning: primary(sentence.en) })),
          ]}
          userId={userId}
        />
      )}
    </section>
  );
}
