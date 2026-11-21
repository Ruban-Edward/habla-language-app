<div align="center">

<img src="public/favicon.svg" alt="Habla logo" width="120" />

# Habla

**A friendly place to build a language-learning habit.**

Learn Spanish, French, Hindi, German, or Japanese with short lessons, useful conversations, and practice that fits into everyday life.

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Sync-3fcf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e0b)](LICENSE)

**Learn at your pace · Keep your progress · Study offline**

</div>

---

## ✨ Highlights

<table>
  <tr>
    <td align="center" width="33%">
      <h3>🗺️ Find your way</h3>
      <ul align="left">
        <li>Follow a 24-lesson path in three stages</li>
        <li>Learn with previews and clear usage notes</li>
        <li>Learn Hindi in Devanagari or Japanese in hiragana</li>
      </ul>
    </td>
    <td align="center" width="33%">
      <h3>💬 Practice for real life</h3>
      <ul align="left">
        <li>Try everyday missions and mini-stories</li>
        <li>Listen, repeat, and practise speaking</li>
        <li>Save useful words and phrases</li>
      </ul>
    </td>
    <td align="center" width="33%">
      <h3>📈 Keep learning</h3>
      <ul align="left">
        <li>Review vocabulary with spaced repetition</li>
        <li>Track XP, streaks, accuracy, and study time</li>
        <li>Install the app and study offline</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

> **Prerequisites:** [Node.js](https://nodejs.org/) (v18+) and npm

```bash
# Clone the repo
git clone https://github.com/Ruban-Edward/habla-language-app.git
cd habla-language-app

# Install dependencies & launch
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).
A Supabase account is **not** required — you can start learning right away.

---

## 🎓 Your First Lesson

1. **Pick a language** — Spanish, French, Hindi, German, or Japanese.
2. **Set your goals** — choose a daily pace and a learning reason. Change them anytime.
3. **Start learning** — open **Learning path**, preview vocabulary, meanings, and examples, then dive into exercises.
4. **Explore more** — try **Missions** for practical dialogues, **Stories** for short reading practice, and **Phrasebook** for saved phrases.
5. **Track progress** — check the **Dashboard** for activity and words due for review.

> [!TIP]
> The home screen has six tabs: **Dashboard**, **Learning path**, **Missions**, **Stories**, **Culture**, and **Phrasebook**. The selected tab is reflected in the URL hash (e.g. `#path`) and is restored when you return.

---

## 📚 Features

### 🧩 Guided Courses

Each language has **24 lessons** grouped into three stages:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│   Starter   │───▶│  Everyday   │───▶│ More Confident  │
│  Lessons 1-8│    │ Lessons 9-16│    │  Lessons 17-24  │
└─────────────┘    └─────────────┘    └─────────────────┘
```

Complete a stage to unlock the next. These are learning stages, not CEFR certifications.

### 🔁 Spaced Vocabulary Review

New words return for review on an intelligent schedule:

| Attempt | Interval |
|:-------:|:--------:|
| ❌ Miss | 15 min |
| ✅ 1st correct | 1 day |
| ✅ 2nd correct | 3 days |
| ✅ 3rd correct | 7 days |
| ✅ 4th correct | 14 days |
| ✅ 5th correct | 30 days |

The dashboard also tracks how many words you remember after a week or more.

### 🗣️ Missions & Stories

- **Missions** — practise real conversations: ordering at a café, shopping, seeing a doctor, checking in at an airport. Get corrections when wrong, and save useful phrases when you finish.
- **Mini-stories** — read or listen to five-sentence stories, tap a line to see its meaning, then answer comprehension questions.
- **Culture notes** — discover a short daily note about customs and expressions, with a phrase to try.

### 🎙️ Speaking Practice

On browsers with speech recognition (Chrome, Edge), lessons and reviews include listen-and-repeat exercises. Accent and punctuation differences are handled leniently.

> Choose **Can't speak now** to skip speaking exercises for an hour without penalty. Speaking exercises require sound to be on.

### 📊 Progress Dashboard

Track your learning with:

- 📅 Daily XP and streaks
- ⏱️ Study time
- 🎯 Recent accuracy
- 📖 Words in review or mastered
- 📆 16-week activity calendar

### ⚙️ Personal Settings

- 🌙 Light and dark themes
- 🔤 Adjustable text size
- 🔊 Sound toggle
- 🔠 Romanization toggle for Hindi and Japanese

### ♿ Accessibility

- Feedback announced to screen readers
- Respects reduced-motion settings
- Enlargeable text

**Keyboard shortcuts during lessons:**

| Key | Action |
|:---:|:------:|
| `Enter` | Check or continue |
| `1`–`4` | Choose an answer |
| `Esc` | Exit |

---

## 🌏 Language-Specific Notes

| Language | Script | Romanization |
|:--------:|:------:|:------------:|
| 🇮🇳 Hindi | Devanagari | Toggle with **abc** button |
| 🇯🇵 Japanese | Hiragana | Toggle with **abc** button |

Japanese example sentences include spaces between words to help beginner reading and word-tile exercises. Answer checking ignores those spaces.

---

## 🔊 Audio & Offline

Install Habla from **Offline & audio** on the home screen to keep lessons, missions, reviews, and your phrasebook available without a connection.

```bash
# Offline support requires a production build
npm run build
npm run preview
```

Pronunciation audio runs **entirely on your device** — lesson text is never sent to a speech service.

<details>
<summary><strong>🎵 Voice Details</strong></summary>

| Language | Voice Type | First Download |
|:--------:|:----------:|:--------------:|
| 🇫🇷 French | Built-in downloadable | ~63 MB voice + ~15 MB engine |
| 🇪🇸 Spanish | Built-in downloadable | ~63 MB voice + ~15 MB engine |
| 🇮🇳 Hindi | Built-in downloadable | ~63 MB voice + ~15 MB engine |
| 🇩🇪 German | Built-in downloadable | ~63 MB voice + ~15 MB engine |
| 🇯🇵 Japanese | Device TTS | Depends on installed voice |
| 🇬🇧 English | Device TTS | Depends on installed voice |

Download voices ahead of time or remove them later in **Offline & audio**. If a built-in voice cannot load, Habla falls back to your device's voice when available.

</details>

> [!NOTE]
> Your progress is always saved on this device. When you're offline, learning continues as usual; cloud sync resumes after you reconnect.

---

## 🌐 Translation & Privacy

The translator works between English and the selected course language, can read the result at normal or half speed, and can save it to your phrasebook. Translation requires an internet connection and sends submitted text to [MyMemory](https://mymemory.translated.net/).

> [!CAUTION]
> The anonymous service has daily limits and accepts up to 500 bytes per request. **Do not submit private or sensitive text.**

---

## ☁️ Optional Accounts & Cloud Sync

Without setup, progress stays in this browser. To add accounts and sync progress across devices:

<details>
<summary><strong>📋 Setup Instructions</strong></summary>

1. Create a [Supabase](https://supabase.com/) project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor — it creates the progress and content-report tables with row-level security policies.
3. Copy the env template and add your credentials:

   ```bash
   cp .env.example .env.local
   ```

   Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **Project Settings → API**. For deployment, configure the same variables in your hosting provider's build settings.

4. Restart the Vite development server.
5. In Supabase Authentication settings:
   - Enable email/password sign-in
   - Add your local and deployed app URLs to the allowed redirect URLs
   - *(Optional)* For Google sign-in, configure the Google OAuth provider in Supabase and add your app origins and Supabase callback URL in Google Cloud.
6. Choose **Sign in** in Habla to create an account or sign in.

</details>

<details>
<summary><strong>🔄 How Sync Works</strong></summary>

- When an account has no cloud save yet, Habla uploads this browser's progress
- If a cloud save already exists, local progress made while signed out is merged into it
- Progress from a different account replaces the previous save — different people's progress is never mixed

Sync runs after changes, on reconnect, and when you reopen the app. It merges across devices:

| Data | Merge Strategy |
|:-----|:---------------|
| XP & attempts | Added together |
| Scores | Best score kept |
| Review schedules | Latest review used |
| Saved phrases | Retained from all devices (including removals) |
| Settings | Latest change wins |
| Streaks | Continues across days on different devices |
| Reset progress | Takes precedence over older saves |

The browser always retains a local copy.

</details>

> [!WARNING]
> Use only the Supabase **anon key** in the browser app. **Never put a service-role key in client-side code.** Row-level security in the SQL script restricts each signed-in user to their own progress.

---

## 🤝 Help Improve the Courses

Course translations, phrasing, regional usage, and difficulty benefit from review by fluent speakers and learners.

Signed-in learners can use **Report a problem with this content** in a lesson preview or at the end of a mission. Reports are stored in the `content_reports` table for review in the Supabase dashboard; learners cannot read other reports.

---

## 🛠️ Development

```bash
npm run dev       # 🚀 Start the local development server
npm test          # 🧪 Run the test suite
npm run build     # 📦 Type-check and create a production build
npm run preview   # 👀 Preview the production build (with offline support)
```

**Tech Stack:**

| | Technology | Purpose |
|:-:|:-----------|:--------|
| ⚛️ | React 18 | UI framework |
| 🔷 | TypeScript 5 | Type safety |
| ⚡ | Vite 6 | Build tool & dev server |
| 🧪 | Vitest | Test runner |
| 🟢 | Supabase | Auth & cloud sync |
| 🧠 | ONNX Runtime | On-device voice synthesis |
| 🗣️ | Piper TTS | Downloadable voices |

---

## 📜 Voice Credits & Licences

The downloadable voices are distributed by their respective projects. Review the source and licence terms, especially before commercial use.

<details>
<summary><strong>Show voice sources and attribution</strong></summary>

| Voice | Model | Dataset | Licence |
|:------|:------|:--------|:--------|
| 🇫🇷 **French** — `fr_FR-siwis-medium` | [Model](https://huggingface.co/Trelis/piper-fr-fr-siwis-medium) | [SIWIS French Speech Synthesis Database](https://datashare.is.ed.ac.uk/handle/10283/2353) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| 🇪🇸 **Spanish** — `es_ES-davefx-medium` | [Model](https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_ES/davefx/medium) | [CC0 dataset](https://github.com/OHF-Voice/voice-datasets) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| 🇩🇪 **German** — `de_DE-thorsten-medium` | [Model](https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE/thorsten/medium) | [Thorsten-Voice](https://www.thorsten-voice.de/) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| 🇮🇳 **Hindi** — `hi_IN-rohan-medium` | [Model](https://huggingface.co/rhasspy/piper-voices/tree/main/hi/hi_IN/rohan/medium) | [Indic TTS](https://www.iitm.ac.in/donlab/indictts) Hindi Mono Male | [Review licence](https://www.iitm.ac.in/donlab/indictts/downloads/license.pdf) |

French uses the `@piper-plus/g2p` French phonemizer. Spanish, Hindi, and German use small rule-based phonemizers in [`src/lib/g2p/`](./src/lib/g2p/) to produce eSpeak NG-style phonemes without shipping eSpeak NG. Spanish and Hindi tests compare course text against eSpeak NG; German expectations are hand-written and should be checked against `espeak-ng -v de --ipa`.

</details>

---

<div align="center">

**Made with ❤️ for language learners everywhere**

[⬆ Back to top](#habla)

</div>
