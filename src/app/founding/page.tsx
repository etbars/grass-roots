import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bookmark, Rocket, Gift, ShieldCheck, Infinity, RefreshCw } from "lucide-react";
import { FoundingOffer } from "@/components/founding-offer";
import { FOUNDING_LIVE } from "@/lib/founding";

export const metadata: Metadata = {
  title: "Founding members · Grass Roots",
  description:
    "Reserve founding credit toward future Grass Roots classes and lock in a bonus. No payment today; we'll email you to claim when credit goes live.",
};

const STEPS = [
  {
    icon: Bookmark,
    title: "Reserve your credit",
    body: "Pick a tier and leave your email. It takes a few seconds, and you pay nothing today.",
  },
  {
    icon: Rocket,
    title: "We open credit",
    body: "When founding credit goes live, we email you a private link to claim the spot you reserved.",
  },
  {
    icon: Gift,
    title: "Claim your bonus",
    body: "Pay your tier and your full credit balance, bonus included, lands in your account to spend on any class.",
  },
];

const PROMISES = [
  { icon: Infinity, text: "Your credit never expires." },
  { icon: ShieldCheck, text: "Spend it on any course or residency." },
  { icon: RefreshCw, text: "Fully refundable until you use it." },
];

export default function FoundingPage() {
  if (!FOUNDING_LIVE) redirect("/waitlist");
  return (
    <>
      {/* Hero */}
      <section className="bg-grain">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            Founding members
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
            Plant your credit early. Grow it with a bonus.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
            Grass Roots is just getting rooted. Reserve credit toward future
            classes now, as a founding member, and we&apos;ll add a bonus on top
            when it goes live. No payment today, just your spot held.
          </p>
        </div>
      </section>

      {/* The offer */}
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <FoundingOffer />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {PROMISES.map((p) => (
            <span
              key={p.text}
              className="inline-flex items-center gap-2 text-sm font-medium text-bark-soft"
            >
              <p.icon className="h-4 w-4 text-fern" />
              {p.text}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              How founding credit works
            </h2>
            <p className="mt-3 text-lg text-bark-soft">
              Three steps, and nothing leaves your wallet until you decide it
              should.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-7 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-stone-soft">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-bark">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-bark sm:text-3xl">
          Why we&apos;re doing this
        </h2>
        <p className="mt-4 leading-relaxed text-bark-soft">
          Founding members help us get the first residencies off the ground:
          paying teachers fairly, supporting host sites, and getting real
          projects done on the land. Your bonus is our way of saying thank you
          for backing the work before it was the obvious thing to do.
        </p>
        <p className="mt-4 leading-relaxed text-bark-soft">
          Grass Roots is being built to be steward-owned, held in trust for its
          purpose rather than sold. The credit you reserve is held with the same
          care.
        </p>
      </section>
    </>
  );
}
