import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FOUNDING_LIVE } from "@/lib/founding";

/**
 * A clear, always-on notice that this is a demonstration, with a waitlist
 * call to action. Shown whenever the founding campaign is not live.
 */
export function DemoBanner() {
  if (FOUNDING_LIVE) return null;
  return (
    <div className="bg-clay text-paper">
      <Link
        href="/waitlist"
        className="group flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-2 text-center text-sm transition-colors hover:bg-clay-deep"
      >
        <span>
          <span className="font-semibold">Demonstration site.</span> Courses,
          hosts, and listings are illustrative, nothing is bookable yet.
        </span>
        <span className="inline-flex items-center gap-1 font-semibold underline-offset-2 group-hover:underline">
          Join the waitlist
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
