import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { hosts, getCoursesByHost } from "@/lib/data";

export const metadata: Metadata = {
  title: "Host sites · Grass Roots",
  description:
    "Regenerative farms, homesteads, eco-villages and rewilding projects opening their land to courses and teacher residencies.",
};

export default function HostsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-bark sm:text-5xl">
          Living landscapes
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-bark-soft">
          Real places with real projects, opening their land to teachers and
          students who want to learn by helping them grow.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hosts.map((host) => {
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
                <p className="mt-2 line-clamp-2 text-sm text-bark-soft">
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
    </div>
  );
}
