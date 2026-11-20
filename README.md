# habla-language-app

The interface supports light and dark themes from the header (also available while choosing a course). Your selection is saved in this browser.

French pronunciation is generated locally in the browser with the Piper SIWIS voice; lesson text is not sent to a speech service. The first playback downloads about 63 MB of voice data from Hugging Face and loads the speech runtime, then stores the model in browser storage when available so later playback can work offline.

French voice attribution: [fr_FR-siwis-medium](https://huggingface.co/Trelis/piper-fr-fr-siwis-medium), trained on the [SIWIS French Speech Synthesis Database](https://datashare.is.ed.ac.uk/handle/10283/2353), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Spanish, French, and Hindi each offer a 24-lesson path organized into Beginner (A1), Intermediate (A2–B1), and Advanced (B2). Finish every lesson in a stage to unlock the next one. Hindi starts with Devanagari script lessons and shows romanization alongside vocabulary and example sentences.

Every vocabulary lesson starts with a preview of its words, meanings, pronunciations, and example sentences before the exercises begin. Learners can replay any word or example as they study.

## Optional account and cloud progress setup

Progress is stored in this browser by default. To enable accounts and sync progress across devices:

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) to create the per-user progress table and row-level security policies.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from **Project Settings → API**:

   ```sh
   cp .env.example .env.local
   ```

4. Restart the Vite development server. For deployed sites, set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the static host's build settings.
5. In Supabase Authentication settings, enable email/password sign-in and add the app's local and deployed URLs to the allowed redirect URLs. To enable Google sign-in, configure the Google OAuth provider in Supabase with a Google OAuth web client ID and secret. In Google Cloud, add your app origins and the Supabase callback URL shown in the provider settings.
6. Open **Sign in** in the app to create an account. If the account has no cloud save yet, the current browser's progress is uploaded. If a cloud save exists, it replaces the local progress for that account.

The anon key is intended for browser use. Do not put a service-role key in the app. Row-level security in the SQL script ensures each signed-in user can access only their own progress.

Cloud updates save the complete progress record, so use one device at a time for now; simultaneous changes from multiple devices can overwrite each other. The browser also keeps a local copy. Without the Supabase environment variables, the app continues to work with local-only progress.