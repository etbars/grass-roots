import type { Metadata } from "next";
import { ResidencyDesigner } from "@/components/residency-designer";

export const metadata: Metadata = {
  title: "Teach a course · Grass Roots",
  description:
    "Design a teacher residency. Bring your skill, pick a host site, and get a complete course matched to the land's real projects.",
};

export default function TeachPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Teach by living
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-bark sm:text-5xl">
          Turn your skill into a residency
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-bark-soft">
          You bring the craft. A living landscape brings the project. Our
          Residency Studio pairs the two into a complete, ready-to-publish
          teacher residency, with a schedule, outcomes, and real impact on the
          land.
        </p>
      </header>

      <div className="mt-12">
        <ResidencyDesigner />
      </div>
    </div>
  );
}
