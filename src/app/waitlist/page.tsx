import type { Metadata } from "next";
import { Sprout, Hammer, Users } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist · Grass Roots",
  description:
    "Grass Roots is a demonstration of a marketplace for hands-on, land-based learning. Courses, hosts, and listings are illustrative. Join the waitlist to hear when it opens for real.",
};

const POINTS = [
  {
    icon: Sprout,
    text: "Learn land-based crafts by doing them, on real farms and projects.",
  },
  {
    icon: Hammer,
    text: "Teachers design residencies and earn a living teaching what they love.",
  },
  {
    icon: Users,
    text: "Hosts open their land and get the regenerative work it needs done.",
  },
];

export default function WaitlistPage() {
  return (
    <section className="bg-grain">
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Coming soon
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
          Be there when we open.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
          What you&apos;re looking at is a demonstration of Grass Roots. The
          courses, host sites, teachers, and listings are illustrative, and
          nothing is bookable yet. We&apos;re building toward the real thing.
        </p>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-bark-soft">
          Leave your email and we&apos;ll let you know the moment you can learn a
          craft, teach a residency, or open your land for real.
        </p>

        <div className="mt-8">
          <WaitlistForm source="waitlist" />
          <p className="mt-3 text-xs text-stone">
            No spam, just one note when Grass Roots opens.
          </p>
        </div>

        <ul className="mx-auto mt-12 max-w-md space-y-3 text-left">
          {POINTS.map((p) => (
            <li
              key={p.text}
              className="flex items-start gap-3 rounded-2xl border border-stone-soft bg-paper p-4 text-sm text-bark-soft shadow-soft"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fern/12 text-moss">
                <p.icon className="h-4.5 w-4.5" />
              </span>
              <span className="self-center">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
