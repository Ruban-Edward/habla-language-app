import type { Course, Exercise, Side } from '../../types';

export type ExerciseProps<E extends Exercise> = {
  exercise: E;
  course: Course;
  disabled: boolean;
  sound: boolean;
  /** Report the learner's current answer, or null if there is nothing to check yet. */
  onAnswer: (answer: string | null) => void;
};

export const langOf = (course: Course, side: Side | undefined) => (side === 'en' ? 'en' : course.lang);
