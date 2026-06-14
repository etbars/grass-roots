"use client";

import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { firebaseEnabled } from "@/lib/firebase";
import { joinWaitlist } from "@/lib/db";

export function WaitlistForm({ source = "waitlist" }: { source?: string }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  async function join() {
    const mail = (email || user?.email || "").trim();
    if (!mail || busy) return;
    setBusy(true);
    try {
      if (firebaseEnabled) {
        await joinWaitlist({ email: mail, uid: user?.uid ?? null, source });
      }
    } catch (err) {
      console.error("Waitlist join failed", err);
    }
    setBusy(false);
    setJoined(true);
  }

  if (joined) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-fern/10 px-5 py-3 text-sm font-medium text-moss-deep">
        <Check className="h-4 w-4 text-moss" />
        You&apos;re on the list. We&apos;ll be in touch when Grass Roots opens up.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void join();
      }}
      className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email || user?.email || ""}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-w-0 flex-1 rounded-full border border-stone-soft bg-paper px-4 py-3 text-sm text-bark outline-none transition-colors focus:border-fern"
      />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Join the waitlist
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
