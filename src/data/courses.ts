import type { Course, LearningLevel, Lesson, Unit } from '../types';
import { spanish } from './courses/es';
import { french } from './courses/fr';
import { hindi } from './courses/hi';

/** Course ids are prefixed onto unit and lesson ids so progress never collides between courses. */
function withPrefixedIds(c: Course): Course {
  return {
    ...c,
    units: c.units.map((u) => ({
      ...u,
      id: `${c.id}-${u.id}`,
      lessons: u.lessons.map((l) => ({ ...l, id: `${c.id}-${l.id}` })),
    })),
  };
}

export const COURSES: Course[] = [spanish, french, hindi].map(withPrefixedIds);
export const LEARNING_LEVELS: LearningLevel[] = ['beginner', 'intermediate', 'advanced'];
export const LEVEL_INFO: Record<LearningLevel, { cefr: string; title: string; description: string }> = {
  beginner: {
    cefr: 'A1',
    title: 'Beginner',
    description: 'Build your foundations for everyday conversation.',
  },
  intermediate: {
    cefr: 'A2–B1',
    title: 'Intermediate',
    description: 'Use the language with growing independence.',
  },
  advanced: {
    cefr: 'B2',
    title: 'Advanced',
    description: 'Express nuanced ideas with confidence.',
  },
};

export function getCourse(id: string | null): Course {
  return COURSES.find((c) => c.id === id) ?? COURSES[0];
}

export function lessonsOf(course: Course): Lesson[] {
  return course.units.flatMap((u) => u.lessons);
}

export function unitsInLevel(course: Course, level: LearningLevel): Unit[] {
  return course.units.filter((unit) => (unit.level ?? 'beginner') === level);
}

export function isLevelComplete(
  course: Course,
  level: LearningLevel,
  completed: Record<string, unknown>,
): boolean {
  const units = unitsInLevel(course, level);
  return units.length > 0 && units.every((unit) => unit.lessons.every((lesson) => lesson.id in completed));
}

export function isLevelUnlocked(
  course: Course,
  level: LearningLevel,
  completed: Record<string, unknown>,
): boolean {
  const levelIndex = LEARNING_LEVELS.indexOf(level);
  if (levelIndex === 0) return true;
  const previousLevel = LEARNING_LEVELS[levelIndex - 1];
  return isLevelComplete(course, previousLevel, completed);
}

export function findLesson(course: Course, id: string): Lesson | undefined {
  return lessonsOf(course).find((l) => l.id === id);
}

export function unitOf(course: Course, lessonId: string): Unit {
  const unit = course.units.find((u) => u.lessons.some((l) => l.id === lessonId));
  if (!unit) throw new Error(`Unknown lesson ${lessonId}`);
  return unit;
}

export function isUnlocked(course: Course, lessonId: string, completed: Record<string, unknown>): boolean {
  const lessons = lessonsOf(course);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i < 0) return false;
  const unit = course.units.find((item) => item.lessons.some((lesson) => lesson.id === lessonId));
  if (!unit || !isLevelUnlocked(course, unit.level ?? 'beginner', completed)) return false;
  return i === 0 || lessonId in completed || lessons[i - 1].id in completed;
}
