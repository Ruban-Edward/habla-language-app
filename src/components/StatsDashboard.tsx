import { useState } from 'react';
import { dayKey, shiftDay, type Progress } from '../lib/progress';
import type { Course } from '../types';

type Props = { course: Course; progress: Progress; now: number };
type Range = 7 | 30;

/** Weeks shown in the practice calendar. */
const CALENDAR_WEEKS = 16;
/** A word counts as mastered once its review interval reaches two weeks. */
const MASTERED_DAYS = 14;
const ACCURACY_POINTS = 20;

const dateOf = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const formatDay = (key: string) => dateOf(key).toLocaleDateString('en', { month: 'short', day: 'numeric' });
const weekdayLetter = (key: string) => dateOf(key).toLocaleDateString('en', { weekday: 'narrow' });

function formatMinutes(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** Where a tooltip sits so it never runs off the card: anchored left, centred or right. */
const tipAlign = (i: number, count: number) => (i < count * 0.2 ? 'start' : i > count * 0.8 ? 'end' : 'middle');

/** Practice intensity relative to the daily goal: 0 (none) to 4 (double the goal or more). */
function level(xp: number, goal: number): number {
  if (xp <= 0) return 0;
  if (xp < goal / 2) return 1;
  if (xp < goal) return 2;
  if (xp < goal * 2) return 3;
  return 4;
}

export function StatsDashboard({ course, progress, now }: Props) {
  const [range, setRange] = useState<Range>(7);
  const today = dayKey(now);
  const goal = Math.max(1, progress.dailyGoal);

  // Words and sessions for this course.
  const prefix = `${course.id}:`;
  const reviews = Object.entries(progress.wordReviews).filter(([key]) => key.startsWith(prefix));
  const learned = reviews.length;
  const mastered = reviews.filter(([, review]) => review.intervalDays >= MASTERED_DAYS).length;
  const sessions = progress.sessionHistory.filter((s) => s.courseId === course.id);
  const studyMs = sessions.reduce((sum, s) => sum + s.durationMs, 0);
  const rangeStart = shiftDay(today, -(range - 1));
  const inRange = sessions.filter((s) => s.date >= rangeStart);
  const accuracy = inRange.length ? Math.round(inRange.reduce((sum, s) => sum + s.accuracy, 0) / inRange.length) : null;

  // Daily XP (all courses, like the streak and daily goal).
  const days = Array.from({ length: range }, (_, i) => shiftDay(today, i - (range - 1)));
  const xpByDay = days.map((day) => ({ day, xp: progress.dailyXp[day] ?? 0 }));
  const maxXp = Math.max(goal, ...xpByDay.map((d) => d.xp));
  const rangeXp = xpByDay.reduce((sum, d) => sum + d.xp, 0);
  const activeDays = xpByDay.filter((d) => d.xp > 0).length;

  // Practice calendar: columns are weeks (Monday first), the last column is this week.
  const weekday = (dateOf(today).getDay() + 6) % 7;
  const calendarStart = shiftDay(today, -weekday - (CALENDAR_WEEKS - 1) * 7);
  const calendar = Array.from({ length: CALENDAR_WEEKS * 7 }, (_, i) => {
    const day = shiftDay(calendarStart, i);
    return { day, xp: progress.dailyXp[day] ?? 0, future: day > today };
  });
  const practisedDays = calendar.filter((c) => c.xp > 0).length;
  const elapsedDays = calendar.filter((c) => !c.future).length;

  return (
    <section className="stats-dashboard card" aria-labelledby="stats-title">
      <div className="stats-head">
        <div>
          <span className="eyebrow">YOUR PROGRESS</span>
          <h2 id="stats-title">Your {course.name} at a glance</h2>
        </div>
        <div className="segmented" role="group" aria-label="Time range">
          {([7, 30] as const).map((r) => (
            <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>
              {r} days
            </button>
          ))}
        </div>
      </div>

      <dl className="stats-metrics">
        <div><dt>Words in review</dt><dd>{learned}</dd></div>
        <div><dt>Mastered</dt><dd>{mastered}</dd></div>
        <div><dt>Study time</dt><dd>{formatMinutes(studyMs)}</dd></div>
        <div><dt>Accuracy, {range} days</dt><dd>{accuracy === null ? '—' : `${accuracy}%`}</dd></div>
      </dl>

      <figure className="stats-figure">
        <figcaption>
          <strong>Daily XP</strong>
          <span>{rangeXp} XP over {activeDays} of the last {range} days · all languages</span>
        </figcaption>
        <div className={`xp-chart xp-chart-${range}`}>
          <span className="xp-goal" style={{ bottom: `${(goal / maxXp) * 100}%` }}>
            <span>Goal {goal}</span>
          </span>
          {xpByDay.map(({ day, xp }, i) => (
            <div className="xp-col" key={day} data-align={tipAlign(i, range)}>
              <span
                className={`xp-bar ${xp === 0 ? 'is-zero' : ''} ${day === today ? 'is-today' : ''}`}
                style={{ height: xp ? `${(xp / maxXp) * 100}%` : undefined }}
              />
              <span className="chart-tip" aria-hidden="true">{formatDay(day)} · {xp} XP</span>
            </div>
          ))}
        </div>
        <div className={`xp-axis xp-axis-${range}`} aria-hidden="true">
          {xpByDay.map(({ day }, i) => (
            <span key={day} data-align={range === 30 ? tipAlign(i, range) : undefined}>
              {range === 7 ? weekdayLetter(day) : i % 7 === (range - 1) % 7 ? formatDay(day) : ''}
            </span>
          ))}
        </div>
        <table className="sr-only">
          <caption>XP earned each day</caption>
          <tbody>
            {xpByDay.map(({ day, xp }) => <tr key={day}><th scope="row">{formatDay(day)}</th><td>{xp} XP</td></tr>)}
          </tbody>
        </table>
      </figure>

      <AccuracyTrend points={sessions.slice(-ACCURACY_POINTS).map((s) => ({ date: s.date, accuracy: s.accuracy }))} />

      <figure className="stats-figure">
        <figcaption>
          <strong>Practice calendar</strong>
          <span>Practised on {practisedDays} of the last {elapsedDays} days</span>
        </figcaption>
        <div
          className="streak-calendar"
          role="img"
          aria-label={`Practice calendar for the last ${CALENDAR_WEEKS} weeks: practised on ${practisedDays} of ${elapsedDays} days.`}
        >
          {calendar.map(({ day, xp, future }, i) => (
            <span
              key={day}
              className={`cal-cell cal-${future ? 'future' : level(xp, goal)}`}
              data-align={tipAlign(Math.floor(i / 7), CALENDAR_WEEKS)}
              title={future ? undefined : `${formatDay(day)}: ${xp ? `${xp} XP` : 'no practice'}`}
            />
          ))}
        </div>
        <div className="cal-legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cal-cell cal-${l}`} />)}
          <span>More</span>
        </div>
      </figure>
    </section>
  );
}

/** Accuracy of recent sessions in this course, as one line from oldest to newest. */
function AccuracyTrend({ points }: { points: { date: string; accuracy: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const W = 300;
  const H = 96;
  const PAD = { top: 10, right: 40, bottom: 8, left: 6 };
  const latest = points[points.length - 1];
  const min = Math.min(50, ...points.map((p) => p.accuracy));
  const x = (i: number) => PAD.left + (points.length < 2 ? 0 : (i / (points.length - 1)) * (W - PAD.left - PAD.right));
  const y = (a: number) => PAD.top + ((100 - a) / Math.max(1, 100 - min)) * (H - PAD.top - PAD.bottom);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.accuracy).toFixed(1)}`).join(' ');
  const shown = active ?? points.length - 1;

  return (
    <figure className="stats-figure">
      <figcaption>
        <strong>Accuracy trend</strong>
        <span>{points.length >= 2 ? `Your last ${points.length} sessions in this course` : 'Finish a couple of lessons to see your trend'}</span>
      </figcaption>
      {points.length >= 2 && latest ? (
        <div className="accuracy-chart" onPointerLeave={() => setActive(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <line className="acc-grid" x1={PAD.left} x2={W - PAD.right} y1={y(100)} y2={y(100)} />
            <line className="acc-grid" x1={PAD.left} x2={W - PAD.right} y1={y(min)} y2={y(min)} />
            <path className="acc-area" d={`${line} L${x(points.length - 1)},${H - PAD.bottom} L${x(0)},${H - PAD.bottom} Z`} />
            <path className="acc-line" d={line} vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Dots and labels sit outside the stretched SVG so they stay round and crisp. */}
          <span className="acc-tick acc-tick-top" style={{ top: `${(y(100) / H) * 100}%` }}>100%</span>
          <span className="acc-tick" style={{ top: `${(y(min) / H) * 100}%` }}>{min}%</span>
          {points.map((p, i) => (
            <span
              key={i}
              className={`acc-hit ${i === shown ? 'is-active' : ''}`}
              style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(p.accuracy) / H) * 100}%` }}
              onPointerEnter={() => setActive(i)}
            >
              <span className="acc-dot" />
            </span>
          ))}
          <span
            className="chart-tip is-visible"
            data-align={tipAlign(shown, points.length)}
            style={{ left: `${(x(shown) / W) * 100}%`, top: `${(y(points[shown].accuracy) / H) * 100}%` }}
          >
            {formatDay(points[shown].date)} · {points[shown].accuracy}%
          </span>
          <table className="sr-only">
            <caption>Accuracy per session</caption>
            <tbody>
              {points.map((p, i) => <tr key={i}><th scope="row">{formatDay(p.date)}</th><td>{p.accuracy}%</td></tr>)}
            </tbody>
          </table>
        </div>
      ) : null}
    </figure>
  );
}
