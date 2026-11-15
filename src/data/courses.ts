import type { Course, Lesson, Unit } from '../types';
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

export function getCourse(id: string | null): Course {
  return COURSES.find((c) => c.id === id) ?? COURSES[0];
}

export function lessonsOf(course: Course): Lesson[] {
  return course.units.flatMap((u) => u.lessons);
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
  return i === 0 || lessonId in completed || lessons[i - 1].id in completed;
}
