import type { Course, LearningLevel, LearningReason, Lesson, Mission, Unit } from '../types';
import { spanish } from './courses/es';
import { french } from './courses/fr';
import { hindi } from './courses/hi';
import { MISSIONS } from './missions';
import { USAGE_NOTES } from './notes';

/**
 * Course ids are prefixed onto unit, lesson and mission ids so progress never collides between courses.
 * Usage notes and missions live in their own files (for easier review) and are attached here.
 */
function withPrefixedIds(c: Course): Course {
  return {
    ...c,
    units: c.units.map((u) => ({
      ...u,
      id: `${c.id}-${u.id}`,
      notes: u.notes ?? USAGE_NOTES[c.id]?.[u.id],
      lessons: u.lessons.map((l) => ({ ...l, id: `${c.id}-${l.id}` })),
    })),
    missions: (c.missions ?? MISSIONS[c.id] ?? []).map((m) => ({
      ...m,
      id: `${c.id}-${m.id}`,
      afterUnit: `${c.id}-${m.afterUnit}`,
    })),
  };
}

export const COURSES: Course[] = [spanish, french, hindi].map(withPrefixedIds);

export const LEARNING_REASONS: { id: LearningReason; label: string; hint: string; emoji: string }[] = [
  { id: 'travel', label: 'Travel', hint: 'Get around, eat out and ask for help', emoji: '🧳' },
  { id: 'people', label: 'People I know', hint: 'Talk with friends, family or a partner', emoji: '💬' },
  { id: 'work', label: 'Work', hint: 'Meet colleagues and handle everyday tasks', emoji: '💼' },
  { id: 'curious', label: 'Just curious', hint: 'Explore the language at your own pace', emoji: '✨' },
];

/** Missions in the order to suggest them: matching the learner's reason first, then by path order. */
export function missionsFor(course: Course, reason: LearningReason | null): Mission[] {
  const unitOrder = (m: Mission) => course.units.findIndex((u) => u.id === m.afterUnit);
  return [...(course.missions ?? [])].sort((a, b) => {
    const fit = Number(reason !== null && b.reasons.includes(reason)) - Number(reason !== null && a.reasons.includes(reason));
    return fit || unitOrder(a) - unitOrder(b);
  });
}

export function findMission(course: Course, id: string): Mission | undefined {
  return course.missions?.find((m) => m.id === id);
}
export const LEARNING_LEVELS: LearningLevel[] = ['beginner', 'intermediate', 'advanced'];
export const LEVEL_INFO: Record<LearningLevel, { stage: string; title: string; description: string }> = {
  beginner: {
    stage: '01',
    title: 'Starter',
    description: 'Build your foundations for everyday conversation.',
  },
  intermediate: {
    stage: '02',
    title: 'Everyday',
    description: 'Use the language with growing independence.',
  },
  advanced: {
    stage: '03',
    title: 'More confident',
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
