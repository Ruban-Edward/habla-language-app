import type { Progress } from '../lib/progress';
import type { Course } from '../types';

type Props = { course: Course; progress: Progress; onStart: (storyId: string) => void };

/** Short reads with comprehension questions, on the home screen. */
export function StoriesSection({ course, progress, onStart }: Props) {
  const stories = course.stories ?? [];
  if (!stories.length) return null;

  return (
    <section className="stories" aria-labelledby="stories-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">READ AND UNDERSTAND</span>
          <h2 id="stories-title">Mini-stories</h2>
        </div>
      </div>
      <ul className="story-grid">
        {stories.map((story) => {
          const record = progress.missions[story.id];
          const unit = course.units.find((u) => u.id === story.afterUnit);
          return (
            <li key={story.id}>
              <button type="button" className={`mission-card story-card ${record ? 'is-done' : ''}`} onClick={() => onStart(story.id)}>
                <span className="mission-card-emoji" aria-hidden="true">{story.emoji}</span>
                <span className="mission-card-copy">
                  {record && (
                    <span className="mission-card-tags">
                      <span className="mission-tag is-done">✓ Read · best {record.bestAccuracy}%</span>
                    </span>
                  )}
                  <strong>{story.title}</strong>
                  <small>{story.summary}</small>
                  {unit && <small className="mission-card-unit">5 sentences · {story.questions.length} questions · after “{unit.title}”</small>}
                </span>
                <span className="mission-card-cta" aria-hidden="true">{record ? 'Read again' : 'Read'} →</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
