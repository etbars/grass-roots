import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { FOUNDING_TIERS, foundingBonusPct } from "@/lib/founding";

/** Homepage band promoting the founding-credit pre-sale. */
export function FoundingBand() {
  const top = foundingBonusPct(FOUNDING_TIERS[FOUNDING_TIERS.length - 1]);
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="overflow-hidden rounded-3xl bg-moss-deep px-6 py-10 text-paper shadow-lift sm:px-12 sm:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-wheat">
              <Sprout className="h-3.5 w-3.5" /> Founding members
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Back us early, learn for less.
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-paper/80">
              Reserve credit toward future classes now and lock in a founding
              bonus of up to {top}%. No payment today: we hold your spot and
              email you to claim it when credit goes live.
            </p>
            <Link
              href="/founding"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-paper"
            >
              Reserve founding credit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FOUNDING_TIERS.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-paper/15 bg-paper/5 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-wheat">
                  {t.name}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold">
                  €{t.credit}
                </p>
                <p className="text-xs text-paper/70">
                  for €{t.pay} · +{foundingBonusPct(t)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
