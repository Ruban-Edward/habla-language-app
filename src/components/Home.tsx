import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  isLevelComplete,
  isLevelUnlocked,
  isUnlocked,
  lessonsOf,
  LEARNING_LEVELS,
  LEVEL_INFO,
  unitsInLevel,
} from '../data/courses';
import type { Progress } from '../lib/progress';
import type { Course, LearningReason } from '../types';
import { DAILY_PACES, GoalSetup } from './GoalSetup';
import { CultureCard, CultureList } from './CultureCard';
import { HomeTabs, initialTab, type HomeTab } from './HomeTabs';
import { MissionsSection } from './MissionsSection';
import { OfflineCard } from './OfflinePanel';
import { PhrasebookCard, PhrasebookPanel } from './Phrasebook';
import { RomanToggle } from './RomanToggle';
import { StatsDashboard } from './StatsDashboard';
import { StoriesSection } from './StoriesSection';
import { GoalRing, SpeakButton } from './ui';
import { UsageNotes } from './UsageNotes';

const GOAL_SKIPPED_KEY = 'habla-goal-skipped';

function goalSkipped(): boolean {
  try {
    return window.localStorage.getItem(GOAL_SKIPPED_KEY) === '1';
  } catch {
    return false;
  }
}

type Props = {
  course: Course;
  progress: Progress;
  todayXp: number;
  now: number;
  dueReviewCount: number;
  streak: number;
  onStart: (lessonId: string) => void;
  onPractice: () => void;
  onStartReview: () => void;
  onStartMission: (missionId: string) => void;
  onStartStory: (storyId: string) => void;
  onSetDailyGoal: (goal: number) => void;
  onSetGoal: (reason: LearningReason, dailyGoal: number) => void;
  onToggleRoman: () => void;
  onRemovePhrase: (id: string) => void;
  onReset: () => void;
};

export function Home({
  course,
  progress,
  todayXp,
  now,
  dueReviewCount,
  streak,
  onStart,
  onPractice,
  onStartReview,
  onStartMission,
  onStartStory,
  onSetDailyGoal,
  onSetGoal,
  onToggleRoman,
  onRemovePhrase,
  onReset,
}: Props) {
  const [tab, setTab] = useState<HomeTab>(initialTab);
  const scrollToCurrent = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [skipped, setSkipped] = useState(goalSkipped);
  const showGoalSetup = editingGoal || (progress.learningReason === null && !skipped);
  const recall = progress.recall[course.id];
  const lessons = lessonsOf(course);
  const done = lessons.filter((l) => l.id in progress.completed).length;
  const nextLesson = lessons.find((l) => !(l.id in progress.completed));
  const goalMet = todayXp >= progress.dailyGoal;
  const progressPercent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const warmupWord = lessons[0]?.words[0]?.t ?? course.hello;
  const greeting = course.hello.replace(/[!?.]+$/, '');
  const availableLevels = LEARNING_LEVELS.filter((level) => unitsInLevel(course, level).length > 0);
  const currentLevel = availableLevels.find((level) => !isLevelComplete(course, level, progress.completed))
    ?? availableLevels[availableLevels.length - 1]
    ?? 'beginner';
  const allLevelsComplete = availableLevels.every((level) => isLevelComplete(course, level, progress.completed));

  const headline = done === 0
    ? `A little ${course.name}, a lot of possibility.`
    : !nextLesson
      ? `${course.congrats} You made it through the course.`
      : goalMet
        ? `Daily goal reached. ${course.praise[0]}`
        : streak > 0
          ? `Your ${streak}-day streak is looking good.`
          : 'Welcome back. Let’s keep going.';

  /** Switch tab; `toCurrent` scrolls the learning path to the chapter the learner is on. */
  const openTab = (next: HomeTab, toCurrent = false) => {
    setTab(next);
    scrollToCurrent.current = toCurrent;
    try {
      const url = next === 'dashboard' ? window.location.pathname + window.location.search : `#${next}`;
      window.history.replaceState(null, '', url);
    } catch {
      // The tab still changes; it just isn't remembered in the address.
    }
  };

  // Each tab starts at its own top (just under the tab bar); the path can jump to the current chapter.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (tab === 'path' && scrollToCurrent.current) {
      scrollToCurrent.current = false;
      document.querySelector('.unit-current')?.scrollIntoView({ block: 'start' });
      return;
    }
    const bar = tabsRef.current;
    if (bar && bar.getBoundingClientRect().top <= 80) window.scrollTo({ top: 0 });
  }, [tab]);

  const tabs: { id: HomeTab; label: string; icon: string; count?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '◎' },
    { id: 'path', label: 'Learning path', icon: '↗', count: `${done}/${lessons.length}` },
    { id: 'missions', label: 'Missions', icon: '💬', count: String(course.missions?.length ?? 0) },
    { id: 'stories', label: 'Stories', icon: '📖', count: String(course.stories?.length ?? 0) },
    { id: 'culture', label: 'Culture', icon: '🌍' },
    { id: 'phrasebook', label: 'Phrasebook', icon: '▤', count: progress.savedPhrases.length ? String(progress.savedPhrases.length) : undefined },
  ];

  return (
    <main className="home">
      <HomeTabs tabs={tabs} active={tab} onSelect={(id) => openTab(id)} barRef={tabsRef} />

      {tab === 'dashboard' && (
        <div className="home-panel" role="tabpanel" id="home-panel-dashboard" aria-labelledby="home-tab-dashboard">
          <div className="home-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> YOUR {course.name.toUpperCase()} STUDIO</span>
              <h1>{headline}</h1>
              <p className="home-subtitle">A thoughtful path from your first {greeting.toLowerCase()} to speaking with confidence.</p>
            </div>
            <span className="level-chip"><span>{course.badge}</span> {`${LEVEL_INFO[currentLevel].title.toUpperCase()} PATH${allLevelsComplete ? ' COMPLETE' : ''}`}</span>
          </div>

          <div className="home-grid">
            <div className="home-main">
              {showGoalSetup && (
                <GoalSetup
                  course={course}
                  reason={progress.learningReason}
                  dailyGoal={progress.dailyGoal}
                  onSave={(reason, goal) => {
                    onSetGoal(reason, goal);
                    setEditingGoal(false);
                  }}
                  onCancel={() => {
                    if (!editingGoal) {
                      setSkipped(true);
                      try {
                        window.localStorage.setItem(GOAL_SKIPPED_KEY, '1');
                      } catch {
                        // The prompt simply returns next visit when storage is unavailable.
                      }
                    }
                    setEditingGoal(false);
                  }}
                />
              )}
              <section className="hero card">
                <div className="hero-copy">
                  <span className="hero-kicker">YOUR NEXT STEP</span>
                  <h2>{nextLesson ? nextLesson.title : 'A course well learned'}</h2>
                  <p>{nextLesson ? course.units.find((unit) => unit.lessons.some((lesson) => lesson.id === nextLesson.id))?.description : `Keep your ${course.name} fresh with a quick review.`}</p>
                  <div className="hero-meta"><span>◷ 5 MIN</span><span>✦ {nextLesson?.words.length ?? 0} NEW WORDS</span></div>
                  <div className="hero-actions">
                    {nextLesson && <button type="button" className="btn primary" onClick={() => onStart(nextLesson.id)}>Continue learning <span aria-hidden="true">→</span></button>}
                    {!nextLesson && <button type="button" className="btn primary" onClick={onPractice}>Review your {course.name} <span aria-hidden="true">→</span></button>}
                    <button type="button" className="btn ghost" onClick={() => openTab('path', true)}>View learning path</button>
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <span className="hero-art-orbit hero-art-orbit-one" />
                  <span className="hero-art-orbit hero-art-orbit-two" />
                  <span className="hero-art-word">{greeting}<span>.</span></span>
                  {course.id === 'fr' && <span className="hero-art-caption">/ bɔ̃.ʒuʁ /</span>}
                  <span className="hero-art-note">the beginning<br />of something</span>
                </div>
              </section>

              <StatsDashboard course={course} progress={progress} now={now} />
            </div>

            <aside className="home-aside">
              <section className="daily-card card">
                <div className="aside-heading"><div><span className="eyebrow">A LITTLE, OFTEN</span><h2>Your daily rhythm</h2></div><GoalRing value={todayXp} goal={progress.dailyGoal} size={60} /></div>
                <p className="daily-copy">{goalMet ? 'Lovely work. Your daily goal is in the bag.' : 'Small, steady practice is how fluency happens.'}</p>
                <div className="daily-meter"><span style={{ width: `${Math.min(100, (100 * todayXp) / progress.dailyGoal)}%` }} /></div>
                <div className="daily-metric"><strong>{todayXp} <span>XP</span></strong><span>of {progress.dailyGoal} daily goal</span></div>
                <div className="goal-choices" role="group" aria-label="Choose your daily XP goal">
                  <span>Choose your pace</span>
                  <div>
                    {DAILY_PACES.map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        aria-pressed={progress.dailyGoal === goal.value}
                        className={progress.dailyGoal === goal.value ? 'selected' : ''}
                        onClick={() => onSetDailyGoal(goal.value)}
                      >
                        {goal.label}<small>{goal.value} XP</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="streak-row"><span className="streak-icon">✳</span><span><strong>{streak} day{streak === 1 ? '' : 's'}</strong><small>your current streak</small></span><span className="streak-sparkle">✦</span></div>
              </section>

              <section className="practice-card card">
                <span className="practice-icon" aria-hidden="true">↗</span>
                <div>
                  <span className="eyebrow">MAKE IT STICK</span>
                  <h2>{dueReviewCount ? `${dueReviewCount} words ready to revisit` : 'You’re caught up'}</h2>
                  <p>{dueReviewCount ? 'A short, focused review brings words back before they fade.' : 'Words will appear here when they are due for review.'}</p>
                  {recall && recall.attempts > 0 && (
                    <p className="recall-stat" title="Answers given a week or more after you last saw the word">
                      <strong>{Math.round((100 * recall.correct) / recall.attempts)}%</strong> remembered after a week or more
                      <small> ({recall.correct} of {recall.attempts})</small>
                    </p>
                  )}
                </div>
                <button type="button" className="btn ghost" disabled={!dueReviewCount} onClick={onStartReview}>
                  Review due words <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="link-btn practice-mixed" onClick={onPractice}>Start mixed practice</button>
              </section>

              <CultureCard course={course} now={now} onSeeAll={() => openTab('culture')} />

              <section className="speaking-card">
                <span className="speaking-label">SPEAKING · 01</span>
                <span className="speaking-quote" lang={course.lang}>{warmupWord}</span>
                <span className="speaking-hint">Listen. Say it out loud. Own the sound.</span>
                <SpeakButton text={warmupWord} lang={course.lang} label={`Listen to ${warmupWord}`} />
              </section>
              {course.glossary && (
                <section className="reading-card card">
                  <span className="eyebrow">READING SUPPORT</span>
                  <RomanToggle shown={progress.showRoman} onToggle={onToggleRoman} />
                </section>
              )}
              <PhrasebookCard count={progress.savedPhrases.length} onOpen={() => openTab('phrasebook')} />
              <OfflineCard />
              <footer className="home-foot">
                <button type="button" className="link-btn" onClick={() => {
                  if (confirm('Reset all progress in every course? This cannot be undone.')) onReset();
                }}>Reset progress</button>
              </footer>
            </aside>
          </div>
        </div>
      )}

      {tab === 'path' && (
        <div className="home-panel home-panel-wide" role="tabpanel" id="home-panel-path" aria-labelledby="home-tab-path">
            <section className="curriculum" aria-labelledby="curriculum-title">
              <div className="section-heading">
                <div><span className="eyebrow">THE LEARNING PATH</span><h2 id="curriculum-title">Your {course.name} journey</h2></div>
                <span className="section-progress">{done} <span>/ {lessons.length} lessons</span></span>
              </div>
              <div className="curriculum-progress" role="progressbar" aria-label={`${course.name} course progress`} aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              {availableLevels.map((level, levelIndex) => {
                const info = LEVEL_INFO[level];
                const units = unitsInLevel(course, level);
                const unlocked = isLevelUnlocked(course, level, progress.completed);
                const complete = isLevelComplete(course, level, progress.completed);
                const previousLevel = LEARNING_LEVELS[levelIndex - 1];
                return (
                  <section
                    key={level}
                    className={`learning-level learning-level-${level} ${unlocked ? 'level-unlocked' : 'level-locked'}`}
                    aria-labelledby={`level-${course.id}-${level}`}
                  >
                    <header className="learning-level-head">
                      <span className="learning-level-code">{info.stage}</span>
                      <div className="learning-level-title">
                        <span className="eyebrow">STAGE {String(levelIndex + 1).padStart(2, '0')}</span>
                        <h3 id={`level-${course.id}-${level}`}>{info.title}</h3>
                        <p>{info.description}</p>
                      </div>
                      <span className={`level-status ${complete ? 'status-complete' : unlocked ? 'status-active' : 'status-locked'}`}>
                        {complete ? 'COMPLETE' : unlocked ? 'IN PROGRESS' : 'LOCKED'}
                      </span>
                    </header>
                    {!unlocked && previousLevel && (
                      <p className="level-unlock-note">
                        Complete all {LEVEL_INFO[previousLevel].title} lessons to unlock {info.title}.
                      </p>
                    )}
                    {units.map((unit) => {
                      const unitIndex = course.units.indexOf(unit);
                      const unitDone = unit.lessons.filter((lesson) => lesson.id in progress.completed).length;
                      const unitCurrent = unit.lessons.some((lesson) => lesson.id === nextLesson?.id);
                      return (
                        <section
                          key={unit.id}
                          className={`unit ${unitCurrent ? 'unit-current' : ''}`}
                          style={{ '--unit': unit.color } as CSSProperties}
                        >
                          <header className="unit-head">
                            <span className="unit-index">{String(unitIndex + 1).padStart(2, '0')}</span>
                            <div className="unit-title-wrap">
                              <span className="unit-kicker">{unitCurrent ? 'UP NEXT' : `CHAPTER ${String(unitIndex + 1).padStart(2, '0')}`}</span>
                              <h4>{unit.title}</h4>
                              <p>{unit.description}</p>
                            </div>
                            <span className="unit-count">{unitDone}/{unit.lessons.length}</span>
                          </header>
                          {unit.notes && unlocked && <UsageNotes course={course} notes={unit.notes} className="unit-notes" />}
                          <ol className="steps">
                            {unit.lessons.map((lesson, lessonIndex) => {
                              const completed = lesson.id in progress.completed;
                              const lessonUnlocked = isUnlocked(course, lesson.id, progress.completed);
                              const current = lesson.id === nextLesson?.id;
                              const state = completed ? 'done' : current ? 'current' : lessonUnlocked ? 'open' : 'locked';
                              return (
                                <li key={lesson.id} className={`step step-${state}`}>
                                  <button type="button" disabled={!lessonUnlocked} onClick={() => onStart(lesson.id)}>
                                    <span className="step-dot">{completed ? '✓' : lessonUnlocked ? String(lessonIndex + 1).padStart(2, '0') : '·'}</span>
                                    <span className="step-text">
                                      <strong>{lesson.title}</strong>
                                      <small lang={course.lang}>{lesson.words.map((word) => word.t).join(' · ')}</small>
                                    </span>
                                    <span className="step-cta">{completed ? 'REVISIT' : current ? 'START' : lessonUnlocked ? 'OPEN' : 'LOCKED'}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ol>
                        </section>
                      );
                    })}
                  </section>
                );
              })}
            </section>
        </div>
      )}

      {tab === 'missions' && (
        <div className="home-panel home-panel-wide" role="tabpanel" id="home-panel-missions" aria-labelledby="home-tab-missions">
          <MissionsSection
            course={course}
            progress={progress}
            onStart={onStartMission}
            onChangeGoal={() => {
              setEditingGoal(true);
              openTab('dashboard');
            }}
          />
        </div>
      )}

      {tab === 'stories' && (
        <div className="home-panel home-panel-wide" role="tabpanel" id="home-panel-stories" aria-labelledby="home-tab-stories">
          <StoriesSection course={course} progress={progress} onStart={onStartStory} />
        </div>
      )}

      {tab === 'culture' && (
        <div className="home-panel home-panel-wide" role="tabpanel" id="home-panel-culture" aria-labelledby="home-tab-culture">
          <CultureList course={course} />
        </div>
      )}

      {tab === 'phrasebook' && (
        <div className="home-panel home-panel-wide" role="tabpanel" id="home-panel-phrasebook" aria-labelledby="home-tab-phrasebook">
          <PhrasebookPanel entries={progress.savedPhrases} onRemove={onRemovePhrase} />
        </div>
      )}
    </main>
  );
}
