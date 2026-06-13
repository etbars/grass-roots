import type { Metadata } from "next";
import { HostMap } from "@/components/host-map";
import { hosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Map · Grass Roots",
  description:
    "A living map of Grass Roots host sites across Europe, from Scottish smallholdings to Greek olive terraces.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-bark sm:text-5xl">
          The living map
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-bark-soft">
          Every host site, from Scottish smallholdings to Greek olive terraces.
          Tap a pin to visit the land and the courses it hosts.
        </p>
      </header>

      <div className="mt-8 h-[68vh] min-h-[440px] overflow-hidden rounded-3xl border border-stone-soft shadow-soft">
        <HostMap />
      </div>

      <p className="mt-3 text-sm text-bark-soft">
        {hosts.length} host sites across 8 countries.
      </p>
    </div>
  );
}
