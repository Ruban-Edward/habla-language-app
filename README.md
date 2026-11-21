# habla-language-app

The interface supports light and dark themes from the header (also available while choosing a course). Your selection is saved in this browser.

Pronunciation for all three courses is generated locally in the browser with [Piper](https://github.com/OHF-Voice/piper1-gpl) voices; lesson text is not sent to a speech service. The first playback in a language downloads about 63 MB of voice data from Hugging Face and loads the speech runtime, then stores the model in browser storage when available so later playback works offline. If a voice can't load, the device's own text-to-speech voice is used when one is installed. Only the voice for the language being played stays in memory.

Each voice needs phonemes in the form it was trained on. French uses the `@piper-plus/g2p` French phonemizer. Spanish, Hindi and German use small rule-based phonemizers in [`src/lib/g2p/`](./src/lib/g2p/) that produce eSpeak NG-style phonemes (the voices were trained on them) without shipping eSpeak NG: Spanish handles stress, diphthongs and soft b/d/g; Hindi handles the inherent vowel and its deletion, nasalisation and conjuncts; German handles vowel length, stress and prefixes, ch/sch/sp/st, final devoicing and vocalised r, with a list of loanwords and irregular words. The Spanish and Hindi tests compare against eSpeak NG's phonemes for course text; the German expectations are hand-written and should be checked against `espeak-ng -v de --ipa`.

Voice attribution:

- French: [fr_FR-siwis-medium](https://huggingface.co/Trelis/piper-fr-fr-siwis-medium), trained on the [SIWIS French Speech Synthesis Database](https://datashare.is.ed.ac.uk/handle/10283/2353), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Spanish: [es_ES-davefx-medium](https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_ES/davefx/medium), trained on a [CC0](https://creativecommons.org/publicdomain/zero/1.0/) dataset from [OHF-Voice/voice-datasets](https://github.com/OHF-Voice/voice-datasets).
- German: [de_DE-thorsten-medium](https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE/thorsten/medium), trained on Thorsten Müller's [Thorsten-Voice](https://www.thorsten-voice.de/) dataset, released under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- Hindi: [hi_IN-rohan-medium](https://huggingface.co/rhasspy/piper-voices/tree/main/hi/hi_IN/rohan/medium), trained on the IIT Madras [Indic TTS](https://www.iitm.ac.in/donlab/indictts) Hindi Mono Male database under the [Indic TTS licence](https://www.iitm.ac.in/donlab/indictts/downloads/license.pdf). Review that licence's terms before commercial use.

Spanish, French, Hindi, German and Japanese each offer a 24-lesson path organized into Starter, Everyday, and More confident stages. Finish every lesson in a stage to unlock the next one. These are learning stages, not CEFR certifications. Hindi starts with Devanagari script lessons and Japanese with hiragana; both show romanization (Hepburn romaji for Japanese) alongside vocabulary and example sentences. Japanese sentences are written with a space between words, as beginner textbooks do, so they can be built from word tiles; answer checking ignores those spaces.

Every vocabulary lesson starts with a preview of its words, meanings, pronunciations, and example sentences before the exercises begin. Learners can replay any word or example as they study.

## Learning features

The home screen is split into tabs (**Dashboard**, **Learning path**, **Missions**, **Stories**, **Culture** and **Phrasebook**) so nothing needs a long scroll. The selected tab is kept in the address (for example `#path`), so finishing a lesson or reloading returns to it, and **View learning path** on the dashboard jumps straight to the current chapter.

- **Goal setting.** On first visit, learners say why they're learning (travel, people they know, work, or curiosity) and pick a daily pace. The goal decides which missions are suggested first, and both can be changed at any time.
- **Spaced review.** Each word a learner meets is scheduled for review. A miss brings it back after 15 minutes; correct answers in a row space it out to 1, 3, 7, 14, then 30 days. The home screen also shows **week-later recall**: how many words the learner still knew when they came back to them after a week or more.
- **Usage notes.** Every unit has short notes on how words work, such as Spanish gender and regional words, French articles, elision and *tu*/*vous*, German genders, cases and word order, Hindi vowel signs, sound contrasts and *aap*/*tum*, and Japanese particles, politeness and counters. The notes appear in lesson previews and under each unit on the learning path. They live in [`src/data/notes.ts`](./src/data/notes.ts).
- **Romanization control.** Hindi and Japanese learners can turn romanization off from the home screen or with the **abc** button during a lesson or mission, and turn it back on at any time.
- **Speaking practice.** Where the browser supports speech recognition (Chrome, Edge), lessons and reviews include *listen → repeat → check* exercises: first single words, then one short sentence per lesson. Recognised speech is matched leniently (accents and punctuation don't count, and a near miss is accepted). **Can't speak now** skips the rest of the session's speaking exercises without a penalty and pauses them for an hour. Listening exercises are unaffected, and speaking exercises never appear when sound is off.
- **Progress dashboard.** Daily XP for the last 7 or 30 days, words in review and mastered (review interval of 14 days or more), study time, an accuracy trend for recent sessions, and a 16-week practice calendar.
- **Real-life missions.** Short dialogues such as ordering at a café, shopping at a market, seeing a doctor, booking a table by phone, checking in at the airport, or asking for the Wi-Fi. The learner chooses a reply (or types one in Spanish, French and German), and every wrong reply comes with a correction explaining what to change. Useful phrases can be saved at the end. Missions live in [`src/data/missions.ts`](./src/data/missions.ts) and [`src/data/missions-everyday.ts`](./src/data/missions-everyday.ts).
- **Mini-stories.** Five-sentence stories: tap a line for its meaning or listen to the whole story, then answer comprehension questions. They live in [`src/data/stories.ts`](./src/data/stories.ts).
- **Culture notes.** A short note on customs each day (greetings, tipping, *tú*/*usted*, *la bise*, namaste and more), with a phrase to try. They live in [`src/data/culture.ts`](./src/data/culture.ts).
- **Accessibility.** Answer feedback is announced to screen readers, animations stop when the device asks for reduced motion, and **Text size** (in the top bar, or the menu on phones) enlarges everything, including Devanagari. Keyboard: Enter checks and continues, 1–4 picks an answer, and Escape quits a lesson.
- **Phrasebook.** Save words, example sentences, and mission phrases to replay outside lessons.
- **Translator.** Translate between English and the selected course language, hear the result at normal or half speed, and save it to the phrasebook. Translation needs an internet connection and sends submitted text to MyMemory; do not enter private or sensitive text. The free anonymous service has daily limits and accepts up to 500 bytes per request.

## Offline use

The production build installs as an app and stores lessons, missions, reviews, and the phrasebook on the device, so studying works without a connection. Progress is always saved locally; cloud sync resumes when the device reconnects. The **Offline & audio** card on the home screen shows whether the app is ready offline, offers installation, and shows the audio status for each language:

- **Japanese** uses the device's own text-to-speech voice for now (most phones and computers include one); the offline panel shows whether this device has it.
- **French, Spanish, Hindi and German** each have a built-in voice. Learners can download a voice ahead of time (about 63 MB each, plus up to 15 MB for the speech engine they share) and remove it to free space.
- **English** (heard in the translator) uses the device's own text-to-speech voice.

Offline support comes from a small service worker in [`pwa/service-worker.js`](./pwa/service-worker.js). It is built by a Vite plugin in [`vite.config.ts`](./vite.config.ts), which lists the app files to store on install. Offline support only runs in a production build (`npm run build && npm run preview`), not on the development server.

## Content review

The course content needs review by fluent speakers and by learners: translations, natural phrasing, regional usage, and difficulty. Signed-in learners can use **Report a problem with this content** in any lesson preview or at the end of a mission. Reports go to the `content_reports` table (see the setup below), where learners can submit but not read them; review them in the Supabase dashboard. Week-later recall on the home screen gives a first signal of whether learners actually remember what they studied, not just whether they finished lessons.

## Optional account and cloud progress setup

Progress is stored in this browser by default. To enable accounts and sync progress across devices:

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) to create the per-user progress table, the content-report table, and their row-level security policies. If you set up an earlier version, run only the `content_reports` part at the end of the file.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from **Project Settings → API**:

   ```sh
   cp .env.example .env.local
   ```

4. Restart the Vite development server. For deployed sites, set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the static host's build settings.
5. In Supabase Authentication settings, enable email/password sign-in and add the app's local and deployed URLs to the allowed redirect URLs. To enable Google sign-in, configure the Google OAuth provider in Supabase with a Google OAuth web client ID and secret. In Google Cloud, add your app origins and the Supabase callback URL shown in the provider settings.
6. Open **Sign in** in the app to create an account. If the account has no cloud save yet, the current browser's progress is uploaded. If a cloud save exists, progress made on this browser while signed out is merged into it. If this browser's progress belongs to a different account, the account's cloud save replaces it, so two people's progress is never mixed.

The anon key is intended for browser use. Do not put a service-role key in the app. Row-level security in the SQL script ensures each signed-in user can access only their own progress.

Progress syncs about a second after each change, when the device reconnects, and when the app is reopened. Changes from several devices are merged rather than overwritten, including progress made offline:

- XP, lesson and mission attempts, and week-later recall add up what each device earned since its last sync. Best scores take the higher value.
- Dashboard history keeps the sessions from every device, each counted once.
- Each word's review schedule keeps the most recent review.
- Phrasebook entries saved on any device are kept, and a phrase removed on one device stays removed.
- Settings (daily goal, sound, romanization, learning goal, course) take the most recent change, and the streak continues across days practised on different devices.
- **Reset progress** wins over older progress from other devices.

Each save checks that the cloud copy hasn't changed since it was read; if another device wrote first, the app reads, merges, and tries again. The browser always keeps a local copy. Without the Supabase environment variables, the app continues to work with local-only progress.