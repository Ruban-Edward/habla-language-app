import { useEffect, useRef, useState, type FormEvent } from 'react';
import { checkText } from '../lib/answer';
import type { PhraseDraft, SavedPhrase } from '../lib/progress';
import { sfx } from '../lib/sfx';
import { speak } from '../lib/speech';
import type { Course, Mission, MissionLine, MissionReply, SessionResult } from '../types';
import { Mascot } from './Mascot';
import { ReportProblem } from './ReportProblem';
import { RomanToggle } from './RomanToggle';
import { Modal, SpeakButton } from './ui';

type Props = {
  course: Course;
  mission: Mission;
  sound: boolean;
  showRoman: boolean;
  savedPhrases: SavedPhrase[];
  userId: string | null;
  onToggleRoman: () => void;
  onTogglePhrase: (phrase: PhraseDraft) => void;
  onExit: () => void;
  onFinish: (result: SessionResult) => void;
};

type LogEntry = { who: 'partner' | 'you'; line: MissionLine };
type Outcome = { correct: boolean; feedback: string; reply: MissionReply; typed?: string; note?: string };

export function MissionScreen(props: Props) {
  const { course, mission, sound, showRoman, savedPhrases, userId, onToggleRoman, onTogglePhrase, onExit, onFinish } = props;
  const [turnIndex, setTurnIndex] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([{ who: 'partner', line: mission.turns[0].partner }]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [wrongPicks, setWrongPicks] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const startedAt = useRef(Date.now());
  const logEnd = useRef<HTMLDivElement>(null);

  const turn = mission.turns[turnIndex];
  const total = mission.turns.length;
  const correctReplies = turn.replies.filter((reply) => reply.correct);
  const canType = course.typeInTarget;

  useEffect(() => {
    if (sound && !done) void speak(turn.partner.t, course.lang);
  }, [course.lang, done, sound, turn.partner.t]);

  useEffect(() => {
    logEnd.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [log.length, outcome, done]);

  const choose = (index: number) => {
    if (outcome?.correct) return;
    const reply = turn.replies[index];
    setOutcome({ correct: reply.correct, feedback: reply.feedback, reply });
    if (reply.correct) {
      if (sound) sfx.correct();
    } else {
      if (sound) sfx.wrong();
      setMistakes((m) => m + 1);
      setWrongPicks((picks) => new Set(picks).add(index));
    }
  };

  const submitTyped = (event: FormEvent) => {
    event.preventDefault();
    if (!typed.trim() || outcome) return;
    const result = checkText(typed, correctReplies.map((reply) => reply.t), { typos: true });
    const model = correctReplies.find((reply) => reply.t === result.answer) ?? correctReplies[0];
    if (result.correct) {
      if (sound) sfx.correct();
      setOutcome({ correct: true, feedback: model.feedback, reply: model, typed, note: result.note });
    } else {
      if (sound) sfx.wrong();
      setMistakes((m) => m + 1);
      const close = turn.replies.find((reply) => !reply.correct && checkText(typed, [reply.t], { typos: true }).correct);
      setOutcome({
        correct: false,
        feedback: close ? close.feedback : `A natural reply here: “${model.t}”. ${model.feedback}`,
        reply: model,
        typed,
      });
    }
  };

  /** Move on: after a right answer, or after a typed miss (the model reply is shown and used). */
  const advance = () => {
    if (!outcome) return;
    const spoken: MissionLine = outcome.typed && outcome.correct ? { ...outcome.reply, t: outcome.typed.trim() } : outcome.reply;
    const nextLog: LogEntry[] = [...log, { who: 'you', line: outcome.typed && !outcome.correct ? outcome.reply : spoken }];
    setOutcome(null);
    setWrongPicks(new Set());
    setTyped('');
    if (turnIndex + 1 >= total) {
      setLog(nextLog);
      setDone(true);
      if (sound) sfx.complete();
      return;
    }
    setLog([...nextLog, { who: 'partner', line: mission.turns[turnIndex + 1].partner }]);
    setTurnIndex((i) => i + 1);
  };

  const retry = () => setOutcome(null);

  const finish = () =>
    onFinish({
      practice: true,
      missionId: mission.id,
      mistakes,
      accuracy: Math.round((100 * total) / (total + mistakes)),
      durationMs: Date.now() - startedAt.current,
    });

  // Phrases worth keeping: what the other person said and the model reply for each turn.
  const usefulPhrases: MissionLine[] = mission.turns.flatMap((t) => [t.partner, t.replies.find((r) => r.correct)!]);
  const savedIds = new Set(savedPhrases.map((phrase) => phrase.id));
  const draft = (line: MissionLine): PhraseDraft => ({
    courseId: course.id,
    target: line.t,
    meaning: line.en,
    ...(line.roman ? { roman: line.roman } : {}),
  });
  const typedMiss = outcome && !outcome.correct && outcome.typed !== undefined;
  const progressDone = done ? total : turnIndex;

  return (
    <div className="lesson mission">
      <header className="lesson-top">
        <button type="button" className="icon-btn" aria-label="Quit mission" onClick={() => (done ? onExit() : setConfirmQuit(true))}>
          ✕
        </button>
        <div className="progress" role="progressbar" aria-label="Mission progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={progressDone}>
          <span style={{ width: `${(100 * progressDone) / total}%` }} />
        </div>
        {course.glossary && <RomanToggle compact shown={showRoman} onToggle={onToggleRoman} />}
        <span className="badge">Mission</span>
      </header>

      <main className="lesson-body mission-body">
        <section className="mission-scenario">
          <span className="mission-emoji" aria-hidden="true">{mission.emoji}</span>
          <div>
            <span className="eyebrow">REAL-LIFE MISSION</span>
            <h2>{mission.title}</h2>
            <p>{mission.scenario}</p>
          </div>
        </section>

        <ol className="mission-log" aria-live="polite">
          {log.map((entry, index) => (
            <li key={index} className={`chat-bubble chat-bubble-${entry.who}`}>
              <div className="chat-bubble-copy">
                <span lang={course.lang}>{entry.line.t}</span>
                {entry.line.roman && <small className="roman">{entry.line.roman}</small>}
                <small className="chat-bubble-meaning">{entry.line.en}</small>
              </div>
              <SpeakButton text={entry.line.t} lang={course.lang} label={`Hear ${entry.line.t}`} />
            </li>
          ))}
        </ol>

        {!done ? (
          <section className="mission-turn" aria-labelledby="mission-goal">
            <p className="mission-goal" id="mission-goal">
              <span>Your turn</span>
              {turn.goal}
            </p>
            {canType && (
              <div className="mission-mode" role="tablist" aria-label="How to reply">
                <button type="button" role="tab" aria-selected={!typing} className={!typing ? 'selected' : ''} disabled={!!outcome} onClick={() => setTyping(false)}>
                  Choose a reply
                </button>
                <button type="button" role="tab" aria-selected={typing} className={typing ? 'selected' : ''} disabled={!!outcome} onClick={() => setTyping(true)}>
                  Type it yourself
                </button>
              </div>
            )}
            {typing && canType ? (
              <form id="mission-type-form" className="mission-type" onSubmit={submitTyped}>
                <label className="sr-only" htmlFor="mission-typed">Your reply in {course.name}</label>
                <input
                  id="mission-typed"
                  className="answer-input"
                  lang={course.lang}
                  value={typed}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder={course.typePlaceholder}
                  disabled={!!outcome}
                  onChange={(event) => setTyped(event.target.value)}
                />
                {course.specialChars.length > 0 && (
                  <div className="accent-keys" aria-label={`${course.name} characters`}>
                    {course.specialChars.map((char) => (
                      <button
                        key={char}
                        type="button"
                        className="key"
                        disabled={!!outcome}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => setTyped((value) => value + char)}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <div className="mission-replies">
                {turn.replies.map((reply, index) => {
                  const picked = outcome?.reply === reply && !outcome.typed;
                  const wrong = wrongPicks.has(index);
                  return (
                    <button
                      key={reply.t}
                      type="button"
                      className={`mission-reply ${wrong ? 'is-wrong' : ''} ${picked && outcome?.correct ? 'is-right' : ''}`}
                      disabled={wrong || !!outcome}
                      onClick={() => choose(index)}
                    >
                      <span lang={course.lang}>{reply.t}</span>
                      {reply.roman && <small className="roman">{reply.roman}</small>}
                      {(wrong || (picked && outcome?.correct)) && <small className="mission-reply-meaning">{reply.en}</small>}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="mission-summary" aria-labelledby="mission-summary-title">
            <h3 id="mission-summary-title">Phrases to keep</h3>
            <p>Save the ones you want in your phrasebook for when you need them.</p>
            <ul>
              {usefulPhrases.map((line) => {
                const saved = savedIds.has(`${course.id}:${line.t}`);
                return (
                  <li key={line.t}>
                    <div>
                      <span lang={course.lang}>{line.t}</span>
                      {line.roman && <small className="roman">{line.roman}</small>}
                      <small>{line.en}</small>
                    </div>
                    <button type="button" className={`phrase-save ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={() => onTogglePhrase(draft(line))}>
                      {saved ? 'Saved' : 'Save'}
                    </button>
                    <SpeakButton text={line.t} lang={course.lang} label={`Hear ${line.t}`} />
                  </li>
                );
              })}
            </ul>
            <ReportProblem
              course={course}
              context={mission.id}
              items={mission.turns.flatMap((t) => [t.partner, ...t.replies]).map((line) => ({ target: line.t, meaning: line.en }))}
              userId={userId}
            />
          </section>
        )}
        <div ref={logEnd} />
      </main>

      <footer className={`lesson-foot ${outcome ? (outcome.correct ? 'is-correct' : 'is-wrong') : ''}`}>
        <div className="foot-inner">
          <div className="feedback" aria-live="polite">
            {outcome && (
              <>
                <Mascot mood={outcome.correct ? 'cheer' : 'sad'} size={52} />
                <div>
                  <strong>{outcome.correct ? 'Natural reply' : typedMiss ? 'Not quite' : 'Try another reply'}</strong>
                  <p>{outcome.feedback}</p>
                  {outcome.note && <p>{outcome.note}</p>}
                </div>
              </>
            )}
            {done && (
              <>
                <Mascot mood="cheer" size={52} />
                <div>
                  <strong>Mission complete</strong>
                  <p>{mistakes === 0 ? 'Every reply was natural the first time.' : `You fixed ${mistakes} ${mistakes === 1 ? 'reply' : 'replies'} along the way.`}</p>
                </div>
              </>
            )}
          </div>
          {done ? (
            <button type="button" className="btn primary" onClick={finish}>Finish</button>
          ) : typing && canType && !outcome ? (
            <button type="submit" form="mission-type-form" className="btn primary" disabled={!typed.trim()}>Check</button>
          ) : outcome && !outcome.correct && !typedMiss ? (
            <button type="button" className="btn danger" onClick={retry}>Try again</button>
          ) : (
            <button type="button" className="btn primary" disabled={!outcome} onClick={advance}>Continue</button>
          )}
        </div>
      </footer>

      {confirmQuit && (
        <Modal onClose={() => setConfirmQuit(false)}>
          <Mascot mood="sad" size={80} />
          <h2>Leave this mission?</h2>
          <p>You can start it again from the home screen at any time.</p>
          <div className="modal-actions">
            <button type="button" className="btn primary" autoFocus onClick={() => setConfirmQuit(false)}>Keep going</button>
            <button type="button" className="btn ghost danger-text" onClick={onExit}>Leave</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
