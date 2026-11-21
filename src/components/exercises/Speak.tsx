import { useEffect, useRef, useState } from 'react';
import { checkSpeech } from '../../lib/answer';
import { playSpeech } from '../../lib/speechStatus';
import type { SpeakExercise } from '../../types';
import { Prompt } from './Prompt';
import type { ExerciseProps } from './types';

type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionCtor = new () => Recognition;

const getRecognition = (): RecognitionCtor | undefined =>
  (window as unknown as { SpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
  (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition;

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings, or choose “Can’t speak now”.',
  'service-not-allowed': 'Speech recognition isn’t allowed here. Choose “Can’t speak now” to carry on.',
  'audio-capture': 'No microphone was found. Choose “Can’t speak now” to carry on.',
  network: 'Speech recognition needs a connection in this browser. Try again online, or choose “Can’t speak now”.',
  'no-speech': 'I didn’t hear anything. Tap the microphone and try again.',
};

/** Of the recogniser's guesses, prefer one that matches; otherwise its top guess. */
function bestGuess(event: RecognitionResultEvent, accepted: string[]): string {
  const alternatives = Array.from(event.results?.[0] ?? [], (alt) => alt.transcript.trim()).filter(Boolean);
  return alternatives.find((text) => checkSpeech(text, accepted).correct) ?? alternatives[0] ?? '';
}

export function Speak({ exercise, course, disabled, sound, onAnswer }: ExerciseProps<SpeakExercise>) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState('Listen, then tap the microphone and say it.');
  const recognition = useRef<Recognition | null>(null);
  const supported = !!getRecognition();

  useEffect(() => {
    if (sound) void playSpeech(exercise.prompt, course.lang);
  }, [exercise.prompt, course.lang, sound]);

  // Stop the microphone when the exercise is checked, skipped or left.
  useEffect(() => {
    if (disabled) recognition.current?.abort();
  }, [disabled]);
  useEffect(() => () => {
    const r = recognition.current;
    if (!r) return;
    r.onresult = r.onerror = r.onend = null;
    r.abort();
  }, []);

  const start = () => {
    const Ctor = getRecognition();
    if (!Ctor || disabled) return;
    const r = new Ctor();
    recognition.current = r;
    r.lang = course.lang;
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.onresult = (event) => {
      const text = bestGuess(event, exercise.accepted);
      setTranscript(text);
      onAnswer(text || null);
      setMessage(text ? 'Got it. Check your answer, or tap the microphone to try again.' : 'I didn’t catch that. Try again.');
    };
    r.onerror = (event) => {
      setListening(false);
      setMessage(ERROR_MESSAGES[event.error ?? ''] ?? 'I couldn’t hear you. Try again, or choose “Can’t speak now”.');
    };
    r.onend = () => setListening(false);
    setListening(true);
    setMessage('Listening…');
    try {
      r.start();
    } catch {
      setListening(false);
      setMessage('The microphone is busy. Try again in a moment.');
    }
  };

  return (
    <div className="speak-exercise">
      <Prompt text={exercise.prompt} roman={exercise.promptRoman} side="t" course={course} />
      {exercise.meaning && <p className="speak-meaning">“{exercise.meaning}”</p>}
      {supported ? (
        <button
          type="button"
          className={`mic-button ${listening ? 'is-listening' : ''}`}
          disabled={disabled}
          onClick={listening ? () => recognition.current?.stop() : start}
          aria-label={listening ? 'Stop listening' : 'Tap and say it'}
          aria-pressed={listening}
        >
          <span aria-hidden="true">{listening ? '◼' : '🎙️'}</span>
        </button>
      ) : null}
      <p className="speak-loop" role="status">
        {supported ? message : 'Speech recognition isn’t available in this browser. Choose “Can’t speak now” to carry on.'}
      </p>
      {transcript && (
        <p className="transcript">
          <span>You said</span> <span lang={course.lang}>{transcript}</span>
        </p>
      )}
    </div>
  );
}
