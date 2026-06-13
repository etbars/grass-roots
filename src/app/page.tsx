import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, GraduationCap, Users, Sprout } from "lucide-react";
import { getAllCourses, categories } from "@/lib/data";
import { CourseCard } from "@/components/course-card";
import { CategoryIcon } from "@/components/category-icon";

export default function Home() {
  const courses = getAllCourses();
  const featured = courses.slice(0, 6);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              Learn by doing · Teach by living
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
              Real skills, rooted in real places.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
              Grass Roots connects people who want to learn practical skills with
              teachers who can share them — at regenerative farms, homesteads, and
              eco-building projects around the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
              >
                Explore courses
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

          {/* image collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/images/cabin-redhill.jpg"
                alt="Off-grid cabin on a hillside"
                fill
                sizes="(max-width: 1024px) 50vw, 280px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-8 grid gap-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="/images/bee-flower.jpg"
                  alt="Bee on a flower"
                  fill
                  sizes="(max-width: 1024px) 50vw, 280px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/farm-work.jpg"
                  alt="People working a regenerative field"
                  fill
                  sizes="(max-width: 1024px) 50vw, 280px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold text-bark">
            Skills to grow into
          </h2>
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

      {/* ---------- Featured courses ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-bark">
              Upcoming residencies & courses
            </h2>
            <p className="mt-1 text-bark-soft">
              Immersive, hands-on, and hosted on living land.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              A marketplace with three roots
            </h2>
            <p className="mt-3 text-lg text-bark-soft">
              Everyone gives something, everyone grows.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                role: "Students",
                text: "Learn permaculture, natural building, beekeeping, herbalism and more by doing — building real skills, a portfolio, and community.",
              },
              {
                icon: Sprout,
                role: "Teachers",
                text: "Share your craft, earn income, and often receive accommodation on-site. Bring your skill; we'll help you design the residency.",
              },
              {
                icon: Users,
                role: "Hosts & landowners",
                text: "Open your land to courses and residencies. Gain community, momentum on real projects, exposure, and revenue.",
              },
            ].map((item) => (
              <div
                key={item.role}
                className="rounded-2xl border border-stone-soft bg-paper p-7 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-bark">
                  {item.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
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
                src="/images/foliage-green.jpg"
                alt="Lush regenerative planting"
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
