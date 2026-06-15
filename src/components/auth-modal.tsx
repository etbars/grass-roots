"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Check } from "lucide-react";

type Mode = "signin" | "signup";

/** Map Firebase auth error codes to friendly, no-jargon copy. */
function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "That email doesn't look right.";
    case "auth/missing-password":
      return "Please enter a password.";
    case "auth/weak-password":
      return "Use at least 6 characters for your password.";
    case "auth/email-already-in-use":
      return "An account already exists with that email. Try signing in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthModal({
  open,
  onClose,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
}: {
  open: boolean;
  onClose: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Clear the form whenever the modal closes (the provider closes it on sign-in).
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setError("");
      setBusy(false);
      setResetSent(false);
    }
  }, [open]);

  if (!open) return null;

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") await signUpWithEmail(name, email, password);
      else await signInWithEmail(email, password);
      // On success the provider closes this modal via the auth state listener.
    } catch (err) {
      setError(friendlyError(err) || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function google() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      const m = friendlyError(err);
      if (m) setError(m);
      setBusy(false);
    }
  }

  async function forgot() {
    if (!email.trim()) {
      setError("Enter your email above first, then tap reset.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err));
    }
    setBusy(false);
  }

  const input =
    "mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none placeholder:text-stone focus:border-moss focus:ring-2 focus:ring-fern/30";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-bark/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-semibold text-bark">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-bark-soft hover:bg-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => void google()}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-stone-soft bg-paper px-5 py-2.5 text-sm font-semibold text-bark transition-colors hover:bg-cream disabled:opacity-60"
        >
          <GoogleG />
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-stone">
          <span className="h-px flex-1 bg-stone-soft" />
          or
          <span className="h-px flex-1 bg-stone-soft" />
        </div>

        <form onSubmit={submitEmail} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-semibold text-bark">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={input}
              />
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-bark">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              className={input}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-bark">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className={input}
            />
          </div>

          {error && <p className="text-sm text-clay-deep">{error}</p>}
          {resetSent && (
            <p className="flex items-center gap-1.5 text-sm text-moss-deep">
              <Check className="h-4 w-4 text-fern" />
              Password reset email sent. Check your inbox.
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            onClick={() => void forgot()}
            disabled={busy}
            className="mt-3 text-xs font-medium text-bark-soft hover:text-moss disabled:opacity-60"
          >
            Forgot your password?
          </button>
        )}

        <p className="mt-4 border-t border-stone-soft pt-4 text-center text-sm text-bark-soft">
          {mode === "signup" ? "Already have an account?" : "New to Grass Roots?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
              setResetSent(false);
            }}
            className="font-semibold text-moss hover:text-moss-deep"
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}

/** Small multicolour Google "G". */
function GoogleG() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
