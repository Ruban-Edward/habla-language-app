import { useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { errorMessage, supabase, supabaseConfigError } from '../lib/supabase';
import { Modal } from './ui';

type Props = {
  session: Session | null;
  syncError: string | null;
  onClose: () => void;
  onRetrySync: () => void;
};

export function AccountPanel({ session, syncError, onClose, onRetrySync }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (authError) throw authError;
        setMessage(
          data.session
            ? 'Account created. Your progress will sync to this account.'
            : 'Account created. Check your email to confirm it, then sign in.',
        );
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        setMessage('Signed in. Loading your cloud progress…');
      }
    } catch (authError) {
      setError(errorMessage(authError));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      onClose();
    } catch (authError) {
      setError(errorMessage(authError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <button type="button" className="account-close icon-btn" aria-label="Close account panel" onClick={onClose}>
        ×
      </button>
      <h2>Account & sync</h2>
      {supabaseConfigError ? (
        <p className="account-note" role="status">{supabaseConfigError} See the setup steps in README.md.</p>
      ) : session ? (
        <>
          <p>Signed in as <strong>{session.user.email}</strong></p>
          <p className={syncError ? 'account-error' : 'account-note'} role={syncError ? 'alert' : 'status'}>
            {syncError ?? 'Cloud progress sync is enabled.'}
          </p>
          {syncError && (
            <button type="button" className="btn ghost wide" onClick={onRetrySync} disabled={busy}>
              Retry sync
            </button>
          )}
          <button type="button" className="btn ghost wide" onClick={signOut} disabled={busy}>
            {busy ? 'Please wait…' : 'Sign out'}
          </button>
        </>
      ) : (
        <>
          <p>{isSignUp ? 'Create an account to sync progress across devices.' : 'Sign in to load your cloud progress.'}</p>
          <form className="account-form" onSubmit={submit}>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="account-error" role="alert">{error}</p>}
            {message && <p className="account-note" role="status">{message}</p>}
            <button type="submit" className="btn primary wide" disabled={busy}>
              {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </>
      )}
    </Modal>
  );
}
