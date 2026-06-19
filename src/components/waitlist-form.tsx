"use client";

import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { firebaseEnabled } from "@/lib/firebase";
import { joinWaitlist } from "@/lib/db";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  { id: "student", label: "Learn a craft" },
  { id: "teacher", label: "Teach" },
  { id: "host", label: "Host on my land" },
];

export function WaitlistForm({ source = "waitlist" }: { source?: string }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  function toggleRole(id: string) {
    setRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  async function join() {
    const mail = (email || user?.email || "").trim();
    if (!mail || busy) return;
    setBusy(true);
    const payload = {
      email: mail,
      uid: user?.uid ?? null,
      source,
      roles,
      name: name.trim(),
      comment: comment.trim(),
    };
    try {
      if (firebaseEnabled) {
        await joinWaitlist(payload);
      }
      // Notify the team inbox (best-effort; never blocks the signup).
      void fetch("/api/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "waitlist", ...payload }),
      }).catch(() => {});
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
      className="mx-auto max-w-md"
    >
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-bark-soft">
        I&apos;m here to (pick any)
      </p>
      <div className="mb-3 flex flex-wrap justify-center gap-1.5">
        {ROLE_OPTIONS.map((r) => {
          const on = roles.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggleRole(r.id)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                on
                  ? "border-moss bg-moss text-paper"
                  : "border-stone-soft bg-paper text-bark-soft hover:border-fern hover:text-moss",
              )}
            >
              {on && <Check className="h-3.5 w-3.5" />}
              {r.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className={inputCls}
        />
        <input
          type="email"
          required
          value={email || user?.email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={inputCls}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="What would you like to offer or learn? (optional)"
          className="w-full resize-y rounded-2xl border border-stone-soft bg-paper px-4 py-3 text-sm leading-relaxed text-bark outline-none transition-colors focus:border-fern"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
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
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-full border border-stone-soft bg-paper px-4 py-3 text-sm text-bark outline-none transition-colors focus:border-fern";
