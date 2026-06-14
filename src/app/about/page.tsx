import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Sprout,
  GraduationCap,
  PencilRuler,
  ShieldCheck,
  Recycle,
  Landmark,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About · Grass Roots",
  description:
    "Grass Roots is a three-sided marketplace for hands-on, land-based learning, built to be steward-owned: held in trust for its purpose, with profits flowing back to teachers, hosts, and the land.",
};

const SIDES = [
  {
    icon: GraduationCap,
    title: "Students",
    body: "People who want to learn a craft by doing it, on real land, alongside the people who live it.",
  },
  {
    icon: PencilRuler,
    title: "Teachers",
    body: "Skilled practitioners who design residencies and earn a living teaching the work they love.",
  },
  {
    icon: Sprout,
    title: "Hosts",
    body: "Farms, homesteads, and regenerative projects that open their land, and get the work it needs done.",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "It can't be sold off",
    body: "Control stays with the people closest to the mission. The voting rights that steer Grass Roots can't be bought, flipped, or inherited as private wealth, so the company can't be taken over or stripped for parts. It is held in trust for its purpose, the way good land is held for the next generation.",
  },
  {
    icon: Recycle,
    title: "Profit serves the purpose",
    body: "Profit is a means, not the goal. After fair, capped returns to anyone who backs the work, the surplus flows back into the mission: better pay for teachers, support for host sites, and healthier land. Value is shared with the people who create it, not extracted by outside owners.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              About Grass Roots
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
              Rooted in land, craft, and trust.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
              Grass Roots teaches land-based crafts the way they are best
              learned: by doing them, on real ground, beside the people who live
              the work. Permaculture, natural building, beekeeping, herbalism,
              and more.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-bark-soft">
              And we are building the company itself to be stewarded, not owned
              for sale. Held in trust, governed by people close to the mission,
              with profit flowing back to teachers, hosts, and the soil.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/about-hero.jpg"
              alt="A residency group celebrating on a natural building they raised together"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Three sides */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
            A marketplace with three sides
          </h2>
          <p className="mt-3 text-lg text-bark-soft">
            Each side gives something the others need, and the whole loop grows
            stronger with use.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SIDES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-7 shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fern/12 text-moss">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-bark">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-bark-soft">
          Today&apos;s students become tomorrow&apos;s teachers. The projects a
          teacher leads become the regeneration a host site needs. Learn by
          doing, teach by living, grow from the ground up.
        </p>
      </section>

      {/* Held in stewardship */}
      <section className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              How we&apos;re built
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-bark sm:text-4xl">
              Held in stewardship
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-bark-soft">
              We are building Grass Roots to be steward-owned, a model from
              Europe that locks a company&apos;s purpose into its legal
              foundations. Two ideas sit at its heart.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-8 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-bark">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-bark-soft">{p.body}</p>
              </div>
            ))}
          </div>

          {/* The structure */}
          <div className="mt-6 grid gap-8 rounded-3xl border border-stone-soft bg-paper p-8 shadow-soft sm:p-10 lg:grid-cols-[auto_1fr] lg:items-start">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fern/12 text-moss">
              <Landmark className="h-7 w-7" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-bark">
                A foundation holds the company
              </h3>
              <p className="mt-3 leading-relaxed text-bark-soft">
                The structure we are working toward is the Dutch{" "}
                <span className="font-medium text-bark">
                  Stichting Administratiekantoor
                </span>{" "}
                (STAK), a foundation that holds the company&apos;s shares and
                separates control from financial gain. The foundation keeps the
                voting rights, and its statutes are written around the mission,
                so stewards connected to the work guide it. Anyone who helps
                fund Grass Roots holds economic rights through certificates, a
                fair return, but not the power to sell the company out from under
                its purpose.
              </p>
              <p className="mt-4 leading-relaxed text-bark-soft">
                It is the same structure behind companies like Patagonia, Bosch,
                Novo Nordisk, and the Dutch care organisation Buurtzorg. The land
                we work with is meant to outlast any one owner. We think the
                company tending it should be built the same way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GoHabitat connection */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="rounded-3xl border border-fern/30 bg-fern/5 p-8 text-center sm:p-12">
          <Sprout className="mx-auto h-8 w-8 text-fern" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-bark sm:text-3xl">
            Part of a wider regenerative web
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-bark-soft">
            Grass Roots grew out of the same thinking as{" "}
            <a
              href="https://www.gohabitat.earth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-moss hover:text-moss-deep"
            >
              GoHabitat
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            , which connects people to regenerative places to live and work.
            Many of the host sites you see here are drawn from that world. Where
            GoHabitat helps people find a place, Grass Roots helps them learn the
            skills to care for it.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold text-bark">
            Grow with us, from the ground up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
            >
              Explore courses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/become-a-teacher"
              className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
            >
              <PencilRuler className="h-4 w-4" />
              Become a teacher
            </Link>
            <Link
              href="/host"
              className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
            >
              <Sprout className="h-4 w-4" />
              Host a residency
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
