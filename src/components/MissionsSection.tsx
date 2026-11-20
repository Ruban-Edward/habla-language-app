import { isLevelUnlocked, LEARNING_REASONS, missionsFor } from '../data/courses';
import type { Progress } from '../lib/progress';
import type { Course } from '../types';

type Props = {
  course: Course;
  progress: Progress;
  onStart: (missionId: string) => void;
  onChangeGoal: () => void;
};

/** Real-life tasks on the home screen, ordered by the learner's goal. */
export function MissionsSection({ course, progress, onStart, onChangeGoal }: Props) {
  const missions = missionsFor(course, progress.learningReason);
  if (!missions.length) return null;
  const reason = LEARNING_REASONS.find((r) => r.id === progress.learningReason);

  return (
    <section className="missions" aria-labelledby="missions-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">USE IT FOR REAL</span>
          <h2 id="missions-title">Real-life missions</h2>
        </div>
        <button type="button" className="link-btn missions-goal" onClick={onChangeGoal}>
          {reason ? `Goal: ${reason.label} · change` : 'Set your goal'}
        </button>
      </div>
      <p className="missions-intro">
        Short conversations where you choose what to say, and get a correction when a reply would sound off.
      </p>
      <ul className="mission-grid">
        {missions.map((mission) => {
          const unit = course.units.find((u) => u.id === mission.afterUnit);
          const unitDone = unit ? unit.lessons.every((lesson) => lesson.id in progress.completed) : true;
          const levelOpen = unit ? isLevelUnlocked(course, unit.level ?? 'beginner', progress.completed) : true;
          const record = progress.missions[mission.id];
          const suggested = reason !== undefined && mission.reasons.includes(reason.id);
          return (
            <li key={mission.id}>
              <button type="button" className={`mission-card ${record ? 'is-done' : ''}`} onClick={() => onStart(mission.id)}>
                <span className="mission-card-emoji" aria-hidden="true">{mission.emoji}</span>
                <span className="mission-card-copy">
                  <span className="mission-card-tags">
                    {record ? (
                      <span className="mission-tag is-done">✓ Done · best {record.bestAccuracy}%</span>
                    ) : suggested ? (
                      <span className="mission-tag is-suggested">Fits your goal</span>
                    ) : null}
                  </span>
                  <strong>{mission.title}</strong>
                  <small>{mission.scenario}</small>
                  {unit && (
                    <small className="mission-card-unit">
                      {unitDone ? `Uses words from “${unit.title}”` : `Best after “${unit.title}”${levelOpen ? '' : ' (a later stage)'}`}
                    </small>
                  )}
                </span>
                <span className="mission-card-cta" aria-hidden="true">{record ? 'Again' : 'Start'} →</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
