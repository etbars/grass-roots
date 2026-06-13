import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  GraduationCap,
  BadgeCheck,
  Sprout,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { categories } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";

export const metadata: Metadata = {
  title: "Become a teacher · Grass Roots",
  description:
    "Anyone can become a teacher on Grass Roots. Learn by doing, earn a certification in your craft, then teach residencies of your own.",
};

const STEPS = [
  {
    icon: GraduationCap,
    step: "01",
    title: "Learn by doing",
    body: "Start as a student. Take day courses, weekend workshops, and residencies in the craft you love, building real, hands-on skill and a portfolio of work you can point to.",
    cta: { href: "/courses", label: "Browse courses" },
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "Earn your certification",
    body: "Complete the core courses in your craft and a hands-on capstone residency. Experienced teachers sign off on your work, and you become a Grass Roots Certified practitioner, qualified to teach.",
    cta: null,
  },
  {
    icon: Sprout,
    step: "03",
    title: "Teach by living",
    body: "Once certified, design your own residency in our Residency Studio, get matched to a host site that needs your skill, and start teaching students of your own.",
    cta: { href: "/teach", label: "Design a residency" },
  },
];

export default function BecomeATeacherPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              Grow from the ground up
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
              Anyone can become a teacher.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
              You don&apos;t need a diploma or a title. You need the skill, and
              the willingness to share it. On Grass Roots, today&apos;s students
              become tomorrow&apos;s teachers. Here&apos;s the path.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
              >
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/teach"
                className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
              >
                <Sparkles className="h-4 w-4" />
                Already skilled? Design a residency
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/wheat-walk.jpg"
              alt="Walking through a field"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* The path */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
            From student to teacher in three steps
          </h2>
          <p className="mt-3 text-lg text-bark-soft">
            The same journey our tagline describes: learn by doing, teach by
            living.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-7 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-3xl font-semibold text-stone-soft">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-bark">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-soft">
                {s.body}
              </p>
              {s.cta && (
                <Link
                  href={s.cta.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-moss hover:text-moss-deep"
                >
                  {s.cta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certification tracks */}
      <section className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
                Certification tracks
              </h2>
              <p className="mt-2 max-w-xl text-bark-soft">
                Pick a craft and follow its path. Each track is a set of courses
                plus a capstone residency, reviewed by certified teachers.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/courses?category=${c.id}`}
                className="group flex flex-col rounded-2xl border border-stone-soft bg-paper p-5 transition-colors hover:border-fern"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fern/12 text-moss">
                  <CategoryIcon id={c.id} className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-base font-semibold leading-snug text-bark group-hover:text-moss">
                  Certified {c.name} Teacher
                </p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-bark-soft">
                  Complete the {c.name.toLowerCase()} courses and a capstone
                  residency.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-moss">
                  Start this track
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What certification means */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 rounded-3xl border border-stone-soft bg-paper p-8 shadow-soft sm:p-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-clay">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Grass Roots Certification
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold text-bark">
              Earned by doing, not by exam
            </h3>
            <p className="mt-3 leading-relaxed text-bark-soft">
              Certification on Grass Roots means you&apos;ve done the work: in
              the field, with your hands, on real projects. It&apos;s a mark of
              practical competence that students and host sites can trust.
            </p>
          </div>
          <ul className="space-y-3 self-center">
            {[
              "Complete the core courses in your chosen craft",
              "Finish a hands-on capstone residency on a host site",
              "Get your work reviewed by experienced certified teachers",
              "Earn a verifiable certification, and the right to teach",
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-bark">
                <Check className="mt-1 h-4 w-4 shrink-0 text-fern" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <p className="font-display text-2xl font-semibold text-bark">
            Ready to grow from the ground up?
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
            >
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/teach"
              className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
            >
              <Sparkles className="h-4 w-4" />
              Design a residency
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
