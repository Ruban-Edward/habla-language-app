# habla-language-app

The interface supports light and dark themes from the header (also available while choosing a course). Your selection is saved in this browser.

French pronunciation is generated locally in the browser with the Piper SIWIS voice; lesson text is not sent to a speech service. The first playback downloads about 63 MB of voice data from Hugging Face and loads the speech runtime, then stores the model in browser storage when available so later playback can work offline.

French voice attribution: [fr_FR-siwis-medium](https://huggingface.co/Trelis/piper-fr-fr-siwis-medium), trained on the [SIWIS French Speech Synthesis Database](https://datashare.is.ed.ac.uk/handle/10283/2353), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Spanish, French, and Hindi each offer a 24-lesson path organized into Starter, Everyday, and More confident stages. Finish every lesson in a stage to unlock the next one. These are learning stages, not CEFR certifications. Hindi starts with Devanagari script lessons and shows romanization alongside vocabulary and example sentences.

Every vocabulary lesson starts with a preview of its words, meanings, pronunciations, and example sentences before the exercises begin. Learners can replay any word or example as they study.

## Learning features

- **Goal setting.** On first visit, learners say why they're learning (travel, people they know, work, or curiosity) and pick a daily pace. The goal decides which missions are suggested first, and both can be changed at any time.
- **Spaced review.** Each word a learner meets is scheduled for review. A miss brings it back after 15 minutes; correct answers in a row space it out to 1, 3, 7, 14, then 30 days. The home screen also shows **week-later recall**: how many words the learner still knew when they came back to them after a week or more.
- **Usage notes.** Every unit has short notes on how words work, such as Spanish gender and regional words, French articles, elision and *tu*/*vous*, and Hindi vowel signs, sound contrasts and *aap*/*tum*. The notes appear in lesson previews and under each unit on the learning path. They live in [`src/data/notes.ts`](./src/data/notes.ts).
- **Romanization control.** Hindi learners can turn romanization off from the home screen or with the **abc** button during a lesson or mission, and turn it back on at any time.
- **Real-life missions.** Short dialogues such as ordering at a café, finding your hotel, or meeting a new colleague. The learner chooses a reply (or types one in Spanish and French), and every wrong reply comes with a correction explaining what to change. Useful phrases can be saved at the end. Missions live in [`src/data/missions.ts`](./src/data/missions.ts).
- **Phrasebook.** Save words, example sentences, and mission phrases to replay outside lessons.

## Offline use

The production build installs as an app and stores lessons, missions, reviews, and the phrasebook on the device, so studying works without a connection. Progress is always saved locally; cloud sync resumes when the device reconnects. The **Offline & audio** card on the home screen shows whether the app is ready offline, offers installation, and shows the audio status for each language:

- **French** uses the built-in voice. Learners can download it ahead of time (about 63 MB for the voice plus up to 15 MB for the speech engine) and remove it to free space.
- **Spanish and Hindi** use the device's own text-to-speech voices. The panel says whether the installed voice works offline or needs a connection, and what to install if no voice is available.

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
- Each word's review schedule keeps the most recent review.
- Phrasebook entries saved on any device are kept, and a phrase removed on one device stays removed.
- Settings (daily goal, sound, romanization, learning goal, course) take the most recent change, and the streak continues across days practised on different devices.
- **Reset progress** wins over older progress from other devices.

Each save checks that the cloud copy hasn't changed since it was read; if another device wrote first, the app reads, merges, and tries again. The browser always keeps a local copy. Without the Supabase environment variables, the app continues to work with local-only progress.