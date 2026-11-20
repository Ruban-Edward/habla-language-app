/** A pattern string supports `(a|b)` alternatives and `[optional]` parts, e.g. "I( am|'m) a man." */
export type Pattern = string | string[];

/** `t` is always the language being learned; `en` is English. */
export type Word = { t: string; en: string; emoji?: string };
export type Sentence = { t: Pattern; en: Pattern };
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
export type Lesson = {
  id: string;
  title: string;
  /** Script lessons teach letters and their sounds instead of word meanings. */
  kind?: 'script';
  words: Word[];
  sentences: Sentence[];
};
/** A short explanation of how words work: gender, register, spelling, regional use. */
export type UsageNote = {
  title: string;
  body: string;
  examples?: { t: string; en: string; roman?: string }[];
};
export type Unit = {
  id: string;
  title: string;
  description: string;
  color: string;
  level?: LearningLevel;
  lessons: Lesson[];
  /** Usage notes shown with the unit's lessons. */
  notes?: UsageNote[];
};

/** Why the learner is studying; used to suggest relevant missions. */
export type LearningReason = 'travel' | 'people' | 'work' | 'curious';

export type MissionLine = { t: string; en: string; roman?: string };
export type MissionReply = MissionLine & {
  /** Whether this is a natural, appropriate reply in context. */
  correct: boolean;
  /** Why the reply works, or a correction explaining what to change. */
  feedback: string;
};
export type MissionTurn = {
  /** What the other person says. */
  partner: MissionLine;
  /** What the learner wants to get across, in English. */
  goal: string;
  replies: MissionReply[];
};
/** A short real-life task: a dialogue the learner takes part in. */
export type Mission = {
  id: string;
  title: string;
  emoji: string;
  /** The situation, in English. */
  scenario: string;
  /** Unit whose vocabulary the mission draws on. */
  afterUnit: string;
  reasons: LearningReason[];
  turns: MissionTurn[];
};

export type Course = {
  id: string;
  name: string;
  /** Short text shown in the course badge. */
  badge: string;
  color: string;
  tagline: string;
  /** BCP-47 tag used for speech and `lang` attributes. */
  lang: string;
  hello: string;
  congrats: string;
  praise: string[];
  typePlaceholder: string;
  specialChars: string[];
  /** Whether learners type free-text answers in this language (false for non-Latin scripts). */
  typeInTarget: boolean;
  /** Word → romanization, for courses in a non-Latin script. */
  glossary?: Record<string, string>;
  units: Unit[];
  missions?: Mission[];
};

export type Side = 't' | 'en';
export type ChoiceOption = { label: string; emoji?: string; roman?: string; speak?: string };

export type ChoiceExercise = {
  kind: 'choice';
  key: string;
  instruction: string;
  /** Target-language text to play aloud ("tap what you hear"). */
  audio?: string;
  /** A large glyph to identify (script lessons). */
  prompt?: string;
  optionSide: Side;
  options: ChoiceOption[];
  answer: string;
  reviewIds?: string[];
};

export type TilesExercise = {
  kind: 'tiles';
  key: string;
  instruction: string;
  prompt?: string;
  promptRoman?: string;
  promptSide?: Side;
  audio?: string;
  answerSide: Side;
  tiles: string[];
  /** Romanization for target-language tiles, when the course has one. */
  roman?: Record<string, string>;
  accepted: string[];
  reviewIds?: string[];
};

export type TypeExercise = {
  kind: 'type';
  key: string;
  instruction: string;
  prompt: string;
  promptRoman?: string;
  promptSide: Side;
  answerSide: Side;
  accepted: string[];
  reviewIds?: string[];
};

export type MatchExercise = {
  kind: 'match';
  key: string;
  instruction: string;
  pairs: { t: string; en: string; roman?: string }[];
  reviewIds?: string[];
};

export type Exercise = ChoiceExercise | TilesExercise | TypeExercise | MatchExercise;

export type CheckResult = { correct: boolean; answer: string; answerRoman?: string; note?: string };

export type SessionResult = {
  practice: boolean;
  lessonId?: string;
  missionId?: string;
  mistakes: number;
  accuracy: number;
  durationMs: number;
};
