import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Sprout, Home, Check, Sparkles } from "lucide-react";
import { hosts, getHostBySlug, getCoursesByHost } from "@/lib/data";
import { CourseCard } from "@/components/course-card";

export function generateStaticParams() {
  return hosts.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const host = getHostBySlug(slug);
  if (!host) return { title: "Host not found — Grass Roots" };
  return { title: `${host.name} — Grass Roots`, description: host.tagline };
}

export default async function HostProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const host = getHostBySlug(slug);
  if (!host) notFound();
  const courses = getCoursesByHost(host.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
        <Image
          src={host.image}
          alt={host.name}
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1.5 text-sm font-semibold text-moss-deep backdrop-blur">
          {host.landType}
          {host.sizeHa ? ` · ${host.sizeHa} ha` : ""}
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-bark">
            {host.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-bark-soft">
            <MapPin className="h-4 w-4 text-fern" />
            {host.location.place}
            {host.location.region ? `, ${host.location.region}` : ""},{" "}
            {host.location.country}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-bark-soft">
            {host.story}
          </p>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-bark">
              <Sprout className="h-6 w-6 text-fern" /> Projects this land needs
            </h2>
            <p className="mt-1 text-sm text-bark-soft">
              Open opportunities for a teacher residency to take on.
            </p>
            <ul className="mt-4 space-y-2">
              {host.needs.map((need) => (
                <li
                  key={need}
                  className="flex gap-2.5 rounded-xl border border-stone-soft bg-paper p-3.5 text-bark"
                >
                  <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                  {need}
                </li>
              ))}
            </ul>
          </section>

          {courses.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-bark">
                Courses hosted here
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {courses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bark">
              <Home className="h-5 w-5 text-fern" /> What teachers receive
            </h2>
            <ul className="mt-3 space-y-2">
              {host.offers.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-bark-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                  {o}
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-stone-soft pt-5">
              <h3 className="text-sm font-semibold text-bark">On-site</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {host.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-cream px-2.5 py-1 text-xs text-bark-soft"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/teach"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep"
            >
              <Sparkles className="h-4 w-4" />
              Design a residency here
            </Link>
          </div>

          {host.inspiredBy && (
            <p className="mt-3 px-2 text-xs leading-relaxed text-stone">
              Site inspired by {host.inspiredBy}.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
