# habla-language-app

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