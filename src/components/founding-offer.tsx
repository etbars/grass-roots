"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ArrowRight, Sprout, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { reserveFoundingCredit, joinWaitlist } from "@/lib/db";
import {
  FOUNDING_TIERS,
  foundingBonusPct,
  getFoundingTier,
  type FoundingTier,
} from "@/lib/founding";
import { cn } from "@/lib/utils";

export function FoundingOffer() {
  const { enabled, user, profile } = useAuth();
  const [selected, setSelected] = useState<FoundingTier>(FOUNDING_TIERS[1]);
  const [email, setEmail] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState<FoundingTier | null>(null);

  // Already reserved (shown from their profile)?
  const existing = getFoundingTier(profile?.foundingTier);
  const done = reserved ?? existing;

  async function reserve() {
    const mail = (email || user?.email || "").trim();
    if (!mail || reserving) return;
    setReserving(true);
    try {
      await reserveFoundingCredit({
        email: mail,
        tier: selected.id,
        pay: selected.pay,
        credit: selected.credit,
        uid: user?.uid ?? null,
      });
      setReserved(selected);
    } catch (err) {
      console.error("Founding reservation failed", err);
    }
    setReserving(false);
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-fern/40 bg-fern/5 p-8 text-center shadow-soft sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-paper">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-bark">
          You&apos;re a founding member.
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-soft">
          Your <span className="font-semibold text-bark">{done.name}</span> spot
          is reserved: €{done.credit} of credit locked in for €{done.pay} when it
          goes live, a {foundingBonusPct(done)}% founding bonus. We&apos;ll email
          you the moment you can claim it. No payment today.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
        >
          Browse what you&apos;ll spend it on
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-stone-soft bg-paper p-6 shadow-lift sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FOUNDING_TIERS.map((t) => {
          const on = selected.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className={cn(
                "flex flex-col items-start rounded-2xl border p-4 text-left transition-colors",
                on
                  ? "border-moss bg-fern/10 ring-1 ring-moss"
                  : "border-stone-soft bg-cream/40 hover:border-fern",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-sm font-semibold uppercase tracking-wide text-clay">
                  {t.name}
                </span>
                <span className="rounded-full bg-moss px-2 py-0.5 text-[11px] font-semibold text-paper">
                  +{foundingBonusPct(t)}%
                </span>
              </div>
              <span className="mt-3 font-display text-3xl font-semibold text-bark">
                €{t.credit}
              </span>
              <span className="text-sm text-bark-soft">
                credit for €{t.pay}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="email"
          value={email || user?.email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 rounded-full border border-stone-soft bg-cream/40 px-4 py-3 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
        />
        <button
          type="button"
          onClick={() => void reserve()}
          disabled={reserving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
        >
          {reserving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sprout className="h-4 w-4" />
          )}
          Reserve {selected.name} (€{selected.credit})
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-stone sm:text-left">
        No payment today. We email you to claim when founding credit goes live.
        Credit never expires, works on any class, and is fully refundable until
        you use it.
      </p>

      {enabled && <WaitlistMini defaultEmail={user?.email ?? ""} uid={user?.uid ?? null} />}
    </div>
  );
}

function WaitlistMini({
  defaultEmail,
  uid,
}: {
  defaultEmail: string;
  uid: string | null;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  async function join() {
    const mail = (email || defaultEmail).trim();
    if (!mail || busy) return;
    setBusy(true);
    try {
      await joinWaitlist({ email: mail, uid, source: "founding" });
      setJoined(true);
    } catch (err) {
      console.error("Waitlist join failed", err);
    }
    setBusy(false);
  }

  return (
    <div className="mt-6 border-t border-stone-soft pt-5">
      {joined ? (
        <p className="text-sm text-bark-soft">
          <Check className="mr-1.5 inline h-4 w-4 text-moss" />
          You&apos;re on the list. We&apos;ll be in touch as Grass Roots opens
          up.
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm text-bark-soft">
            Not ready to commit? Just keep me posted:
          </span>
          <div className="flex flex-1 gap-2">
            <input
              type="email"
              value={email || defaultEmail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-full border border-stone-soft bg-cream/40 px-3.5 py-2 text-sm text-bark outline-none focus:border-fern focus:bg-paper"
            />
            <button
              type="button"
              onClick={() => void join()}
              disabled={busy}
              className="shrink-0 rounded-full border border-moss/30 px-4 py-2 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10 disabled:opacity-60"
            >
              {busy ? "…" : "Notify me"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
