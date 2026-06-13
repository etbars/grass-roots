import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Sprout,
  HandCoins,
  GraduationCap,
  Globe,
  Home,
  Handshake,
  Tent,
  MapPin,
  ArrowRight,
  Check,
  ExternalLink,
} from "lucide-react";
import { hosts, getCoursesByHost } from "@/lib/data";
import { HostIntakeForm } from "@/components/host-intake-form";

export const metadata: Metadata = {
  title: "Host a residency · Grass Roots",
  description:
    "Open your farm, homestead, or eco-project to teacher residencies. The projects your land needs get done by people learning the craft, and you earn a share.",
};

const BENEFITS = [
  {
    icon: Sprout,
    title: "The projects your land needs, done",
    body: "Every residency leaves real work behind: a cob wall raised, a food forest planted, a hedgerow restored. The land gains because students learn by doing on it.",
  },
  {
    icon: HandCoins,
    title: "Earn from your space",
    body: "You decide what you offer, beds, meals, and the run of the land, and earn a share of every residency hosted on your site.",
  },
  {
    icon: GraduationCap,
    title: "No teaching required",
    body: "You bring the place. Certified teachers bring the craft and the curriculum. You never have to run a single class yourself.",
  },
  {
    icon: Globe,
    title: "Join a regenerative network",
    body: "Become part of a community of farms, homesteads, and eco-projects regenerating land through hands-on learning, worldwide.",
  },
];

const STEPS = [
  {
    icon: Home,
    step: "01",
    title: "List your land",
    body: "Tell us what your site is like and the projects it needs. It takes a few minutes, and there's no commitment.",
  },
  {
    icon: Handshake,
    step: "02",
    title: "Get matched",
    body: "We match your land with certified teachers whose residencies fit what you need. You approve every teacher and project before they arrive.",
  },
  {
    icon: Tent,
    step: "03",
    title: "Host the residency",
    body: "Welcome a teacher and their students for a few days or a few weeks. They learn, your land gains, and you earn a share. Then do it again.",
  },
];

const PROVIDE = [
  "A place to stay: beds, a bunkhouse, or space to camp",
  "Access to the land and the projects that need doing",
  "A welcome, local knowledge, and a sense of place",
  "Basic facilities: clean water, a kitchen, a workspace",
];

const RECEIVE = [
  "A share of every residency's fee",
  "Real projects completed by motivated learners",
  "A network of teachers and students who return",
  "Your site on the living map, seen by learners worldwide",
];

export default function HostPage() {
  const showcase = hosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              Open your land
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-bark sm:text-6xl">
              Host a residency on your land.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-soft">
              If you steward a farm, a homestead, or a regenerative project, open
              it to a teaching residency. The work your land needs gets done by
              people who care about learning to do it well, and you earn a share.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#list-your-land"
                className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
              >
                List your land
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hosts"
                className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-6 py-3 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
              >
                See host sites
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/farmstead-goldenhour.jpg"
              alt="A regenerative farmstead at golden hour"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Why host */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
            Why open your land
          </h2>
          <p className="mt-3 text-lg text-bark-soft">
            Hosting turns the projects you can&apos;t get to into a place where
            people learn, and your land into a living classroom.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fern/12 text-moss">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-bark">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How hosting works */}
      <section className="bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              How hosting works
            </h2>
            <p className="mt-3 text-lg text-bark-soft">
              From your first listing to a residency on the ground, in three
              steps.
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
                <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* You provide / you receive */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-stone-soft bg-paper p-8 shadow-soft">
            <h3 className="font-display text-xl font-semibold text-bark">
              What you provide
            </h3>
            <ul className="mt-4 space-y-3">
              {PROVIDE.map((item) => (
                <li key={item} className="flex gap-2.5 text-bark-soft">
                  <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-fern/30 bg-fern/5 p-8 shadow-soft">
            <h3 className="font-display text-xl font-semibold text-bark">
              What you receive
            </h3>
            <ul className="mt-4 space-y-3">
              {RECEIVE.map((item) => (
                <li key={item} className="flex gap-2.5 text-bark">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              You&apos;d be in good company
            </h2>
            <p className="mt-2 max-w-xl text-bark-soft">
              Real places already opening their land to teachers and students.
            </p>
          </div>
          <Link
            href="/hosts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-moss hover:text-moss-deep"
          >
            See all host sites
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((host) => {
            const count = getCoursesByHost(host.id).length;
            return (
              <Link
                key={host.id}
                href={`/hosts/${host.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={host.image}
                    alt={host.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-moss-deep backdrop-blur">
                    {host.landType}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-bark group-hover:text-moss">
                    {host.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-bark-soft">
                    <MapPin className="h-3.5 w-3.5 text-fern" />
                    {host.location.place}, {host.location.country}
                  </p>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-bark-soft">
                    {host.tagline}
                  </p>
                  <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-moss">
                    {count} {count === 1 ? "course" : "courses"} here
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* List your land */}
      <section
        id="list-your-land"
        className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-bark sm:text-4xl">
              List your land
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-bark-soft">
              Tell us about your site and what it needs. We&apos;ll be in touch
              to learn more and help you welcome your first residency. No
              commitment, and you approve every teacher and project before
              anything happens on your land.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-bark-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fern/12 text-moss">
                <Handshake className="h-4.5 w-4.5" />
              </span>
              In partnership with{" "}
              <a
                href="https://www.gohabitat.earth"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-moss hover:text-moss-deep"
              >
                GoHabitat
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
          <HostIntakeForm />
        </div>
      </section>
    </>
  );
}
