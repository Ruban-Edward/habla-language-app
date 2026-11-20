import { useState } from 'react';
import { LEARNING_REASONS } from '../data/courses';
import type { Course, LearningReason } from '../types';

export const DAILY_PACES = [
  { value: 15, label: 'Gentle', hint: 'About 5 minutes' },
  { value: 30, label: 'Steady', hint: 'About 10 minutes' },
  { value: 50, label: 'Focused', hint: 'About 15–20 minutes' },
];

type Props = {
  course: Course;
  reason: LearningReason | null;
  dailyGoal: number;
  onSave: (reason: LearningReason, dailyGoal: number) => void;
  onCancel?: () => void;
};

/** A short first step: why you're learning (to suggest missions) and how much time you have. */
export function GoalSetup({ course, reason, dailyGoal, onSave, onCancel }: Props) {
  const [picked, setPicked] = useState<LearningReason | null>(reason);
  const [pace, setPace] = useState(DAILY_PACES.some((p) => p.value === dailyGoal) ? dailyGoal : 30);

  return (
    <section className="goal-setup card" aria-labelledby="goal-setup-title">
      <div className="goal-setup-head">
        <span className="eyebrow">SET YOUR GOAL</span>
        <h2 id="goal-setup-title">What do you want {course.name} for?</h2>
        <p>We’ll suggest real-life missions that fit, and you can change this at any time.</p>
      </div>
      <div className="goal-reasons" role="radiogroup" aria-label="Your reason for learning">
        {LEARNING_REASONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={picked === option.id}
            className={`goal-reason ${picked === option.id ? 'selected' : ''}`}
            onClick={() => setPicked(option.id)}
          >
            <span className="goal-reason-emoji" aria-hidden="true">{option.emoji}</span>
            <strong>{option.label}</strong>
            <small>{option.hint}</small>
          </button>
        ))}
      </div>
      <div className="goal-paces" role="radiogroup" aria-label="Daily pace">
        <span>How much time most days?</span>
        <div>
          {DAILY_PACES.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={pace === option.value}
              className={pace === option.value ? 'selected' : ''}
              onClick={() => setPace(option.value)}
            >
              <strong>{option.label}</strong>
              <small>{option.hint}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="goal-setup-actions">
        <button type="button" className="btn primary" disabled={!picked} onClick={() => picked && onSave(picked, pace)}>
          Save my goal
        </button>
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            {reason ? 'Cancel' : 'Skip for now'}
          </button>
        )}
      </div>
    </section>
  );
}
