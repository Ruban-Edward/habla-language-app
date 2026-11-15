# Habla

A small language-learning web app with **Spanish, French and Hindi** courses (taught from English):
bite-sized lessons, XP, daily streaks, hearts and a review mode.
All course content, art and the mascot (Pip) are original.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit + content tests
npm run build    # production build in dist/
```

## How it works

- **Courses**: one file each in `src/data/courses/` (`es.ts`, `fr.ts`, `hi.ts`), 4 units × 3 lessons.
  Pick or switch course from the badge in the top bar; streak, XP and hearts are shared, lesson
  progress and per-course XP are tracked separately.
- **Hindi** starts with a *Script basics* unit (Devanagari vowels and consonants: pick the letter for
  a sound, the sound for a letter, match letters to sounds). After that, every Hindi word, tile and
  sentence shows a romanization (from the course `glossary`). Hindi answers are built from tiles, never typed.
- **Sentences** use a small pattern syntax so many correct translations are accepted: `(a|b)` = alternatives, `[x]` = optional.
  Example: `"I( am|'m) (well|fine), (thank you|thanks)."`
- **Exercises** are generated per lesson (`src/lib/generate.ts`): picture choice, listen-and-choose,
  match pairs, word-tile translation (both directions), listen-and-build and typed translation.
- **Answer checking** (`src/lib/answer.ts`) ignores case and punctuation, accepts missing accents
  with a hint, and forgives a one-letter typo in typed answers.
- **Missed exercises** come back at the end of the lesson until answered correctly.
- **Hearts**: 5 max, lose one per mistake, refill one every 15 minutes; a practice session costs no
  hearts and earns one back.
- **Streak / daily goal**: a session on consecutive days grows the streak; the daily goal is 30 XP.
  Lessons give 10 XP (+5 for no mistakes), practice gives 5.
- **Audio** uses the browser's built-in speech synthesis in the course language. Listening
  exercises are skipped when sound is off or the browser has no voice for that language.
- Progress is saved in `localStorage`.

To add content, add lessons to a course file; `npm test` checks that every generated exercise is
solvable and that every Hindi word has a romanization. To add a language, copy `fr.ts`, fill in the
course fields and register it in `src/data/courses.ts`.
