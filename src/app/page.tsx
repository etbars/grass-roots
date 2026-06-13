import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Users,
  Sprout,
  ArrowDown,
} from "lucide-react";
import { getAllCourses, categories } from "@/lib/data";
import { CourseCard } from "@/components/course-card";
import { CategoryIcon } from "@/components/category-icon";

const TESTIMONIALS = [
  {
    quote:
      "I arrived knowing nothing about natural building and left having helped raise an entire cob guest cabin. I still think about that summer every day.",
    name: "Mara L.",
    detail: "Cob Building Residency · Scotland",
  },
  {
    quote:
      "Three weeks on the farm changed what I want from life. I came to learn permaculture and left with a plan to start my own smallholding.",
    name: "Daniel R.",
    detail: "Permaculture Design Certificate · Spain",
  },
  {
    quote:
      "Mornings in the apiary, evenings around the fire with people who became friends. Best trip I've ever taken — and I can keep bees now.",
    name: "Priya N.",
    detail: "Beekeeping Basics · Portugal",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Home() {
  const courses = getAllCourses();
  const popular = courses.slice(0, 6);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-bark">
        {/* Background video — a cob house, built start to finish */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <iframe
            title="A cob house, built start to finish"
            src="https://www.youtube-nocookie.com/embed/QwyHIoqgTrc?autoplay=1&mute=1&loop=1&playlist=QwyHIoqgTrc&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          />
          {/* readability overlay */}
          <div className="absolute inset-0 bg-bark/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/35 to-bark/55" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:py-40">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-wheat">
              Learn by doing · Teach by living
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-paper sm:text-6xl">
              Launch a teaching residency anywhere in the world.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85">
              Bring your craft to a regenerative farm, homestead, or building
              project — and teach students who learn by doing alongside you.
              We&apos;ll help you design the whole thing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/teach"
                className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
              >
                <Sparkles className="h-4 w-4" />
                Host a residency
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-paper/40 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                Explore courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Explore by craft ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-bark">
              Explore by craft
            </h2>
            <p className="mt-1 text-bark-soft">
              Natural building, permaculture, beekeeping, herbalism, and more.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-sm font-semibold text-moss hover:text-moss-deep"
          >
            All courses →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/courses?category=${c.id}`}
              className="group flex items-center gap-3 rounded-xl border border-stone-soft bg-paper p-4 transition-colors hover:border-fern"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fern/12 text-moss transition-colors group-hover:bg-fern/20">
                <CategoryIcon id={c.id} className="h-5 w-5" />
              </span>
              <span className="font-medium text-bark">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Popular residencies ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-bark">
              Popular residencies
            </h2>
            <p className="mt-1 text-bark-soft">
              Pack a bag. These are filling up.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-sm font-semibold text-moss hover:text-moss-deep"
          >
            See all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ---------- How it works (three roots) ---------- */}
      <section id="how-it-works" className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              A regenerative loop
            </h2>
            <p className="mt-3 text-lg text-bark-soft">
              Three sides, each giving something, each growing.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sprout,
                role: "Teachers",
                verb: "share their craft",
                text: "Bring a practical skill, earn income, and often stay on-site. We'll even help you design the residency.",
              },
              {
                icon: GraduationCap,
                role: "Students",
                verb: "learn by doing",
                text: "Travel to a real place and gain hands-on skills, a portfolio, and a community — by helping a living landscape thrive.",
              },
              {
                icon: Users,
                role: "Hosts",
                verb: "open their land",
                text: "Regenerative farms and projects host courses — gaining momentum, community, exposure, and revenue.",
              },
            ].map((item) => (
              <div
                key={item.role}
                className="rounded-2xl border border-stone-soft bg-paper p-7 text-center shadow-soft"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-bark">
                  {item.role}
                </h3>
                <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-clay">
                  <ArrowDown className="h-3.5 w-3.5" />
                  {item.verb}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm italic text-moss-deep">
            The work students do is real and the land genuinely benefits — but
            the learning, mentorship, and community always come first.
          </p>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
          Stories from the land
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-7 shadow-soft"
            >
              <span className="font-display text-5xl leading-none text-fern/50">
                &ldquo;
              </span>
              <blockquote className="-mt-3 flex-1 text-bark-soft">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss font-display text-sm font-semibold text-paper">
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-bark">
                    {t.name}
                  </span>
                  <span className="block text-xs text-bark-soft">
                    {t.detail}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- Student to teacher ---------- */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link
          href="/become-a-teacher"
          className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-stone-soft bg-paper p-7 shadow-soft sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fern/12 text-moss">
              <Sprout className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-bark">
                New here? Grow into teaching.
              </h2>
              <p className="mt-0.5 text-sm text-bark-soft">
                Start as a student, earn a certification in your craft, and
                become a teacher.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper transition-colors group-hover:bg-moss-deep">
            Become a teacher
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>

      {/* ---------- AI designer teaser ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="overflow-hidden rounded-3xl bg-moss-deep text-paper">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="flex items-center gap-2 text-wheat">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  AI Residency Designer
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Bring a skill. We&apos;ll design the residency.
              </h2>
              <p className="mt-4 max-w-xl text-paper/80">
                Tell us what you teach and pick a host site. Our designer pairs
                your craft with the land&apos;s real projects and writes a
                complete course — schedule, outcomes, and lasting impact — in
                seconds.
              </p>
              <Link
                href="/teach"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-paper"
              >
                <Sparkles className="h-4 w-4" />
                Try the designer
              </Link>
            </div>
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
              <Image
                src="/images/gathering-goldenhour.jpg"
                alt="A golden-hour gathering after a day's work"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
