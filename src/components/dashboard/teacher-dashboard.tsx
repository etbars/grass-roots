"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  ArrowRight,
  Loader2,
  Compass,
  PencilRuler,
  Globe,
  Bookmark,
} from "lucide-react";
import { categories, getHost, formatPrice } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";
import { PublishResidencyButton } from "@/components/publish-residency-button";
import {
  getMyListings,
  getMyResidencies,
  type PublishedListing,
  type SavedResidency,
} from "@/lib/db";
import type { CategoryId } from "@/lib/types";

interface HostMatch {
  hostId: string;
  fitScore: number;
  reason: string;
}

export function TeacherDashboard({
  uid,
}: {
  uid: string;
  teacherName: string;
}) {
  const [craft, setCraft] = useState<CategoryId>(categories[0].id);
  const [matches, setMatches] = useState<HostMatch[] | null>(null);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [listings, setListings] = useState<PublishedListing[] | null>(null);
  const [drafts, setDrafts] = useState<SavedResidency[] | null>(null);

  useEffect(() => {
    void getMyListings(uid).then(setListings);
    void getMyResidencies(uid).then(setDrafts);
  }, [uid]);

  async function findMatches(skillId: CategoryId) {
    setMatching(true);
    setError(null);
    const skill = categories.find((c) => c.id === skillId)?.name ?? skillId;
    try {
      const res = await fetch("/api/match-hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't find matches.");
      setMatches(data.matches ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't find matches.");
      setMatches([]);
    }
    setMatching(false);
  }

  useEffect(() => {
    void findMatches(categories[0].id);
    // run once on mount with the default craft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 text-clay">
        <PencilRuler className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Teaching
        </span>
      </div>

      {/* Matching */}
      <div className="mt-4 rounded-3xl border border-fern/30 bg-fern/5 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-bark">
          <Compass className="h-6 w-6 text-fern" />
          Where your craft is needed
        </h2>
        <p className="mt-1.5 text-bark-soft">
          Pick a craft and we&apos;ll match you to host sites whose real
          projects fit it best.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={craft}
            onChange={(e) => setCraft(e.target.value as CategoryId)}
            className="rounded-full border border-stone-soft bg-paper px-4 py-2 text-sm font-medium text-bark outline-none focus:border-fern"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void findMatches(craft)}
            disabled={matching}
            className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep disabled:opacity-60"
          >
            {matching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Compass className="h-4 w-4" />
            )}
            Find host sites
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-clay-deep">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {matching && matches === null
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl bg-paper/70"
                />
              ))
            : (matches ?? []).map((m) => {
                const host = getHost(m.hostId);
                if (!host) return null;
                return (
                  <div
                    key={m.hostId}
                    className="flex flex-col rounded-2xl border border-stone-soft bg-paper p-5 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold leading-snug text-bark">
                        {host.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-moss px-2 py-0.5 text-xs font-semibold text-paper">
                        {m.fitScore}% fit
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-bark-soft">
                      <MapPin className="h-3.5 w-3.5 text-fern" />
                      {host.location.place}, {host.location.country}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-soft">
                      {m.reason}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={`/teach?host=${host.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-clay px-3.5 py-1.5 text-xs font-semibold text-paper hover:bg-clay-deep"
                      >
                        <PencilRuler className="h-3.5 w-3.5" />
                        Design here
                      </Link>
                      <Link
                        href={`/hosts/${host.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-moss hover:text-moss-deep"
                      >
                        View site
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Your residencies */}
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-bark">
            <Globe className="h-5 w-5 text-fern" />
            Live listings
          </h3>
          <div className="mt-3 space-y-3">
            {listings === null ? (
              <Loader2 className="h-5 w-5 animate-spin text-moss" />
            ) : listings.length === 0 ? (
              <Empty body="Publish a residency to open it to students." />
            ) : (
              listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/listings/${l.id}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-soft bg-paper p-4 shadow-soft transition-colors hover:border-fern"
                >
                  <span>
                    <CategoryIcon
                      id={l.categoryId}
                      className="mb-1 h-4 w-4 text-fern"
                    />
                    <span className="block font-medium text-bark group-hover:text-moss">
                      {l.title}
                    </span>
                    <span className="block text-sm text-bark-soft">
                      {l.hostName} · {formatPrice(l.price)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-fern" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-bark">
            <Bookmark className="h-5 w-5 text-fern" />
            Drafts
          </h3>
          <div className="mt-3 space-y-3">
            {drafts === null ? (
              <Loader2 className="h-5 w-5 animate-spin text-moss" />
            ) : drafts.length === 0 ? (
              <Empty body="Saved residencies you haven't published yet show here." />
            ) : (
              drafts.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-stone-soft bg-paper p-4 shadow-soft"
                >
                  <p className="font-medium text-bark">{d.residency.title}</p>
                  <p className="text-sm text-bark-soft">{d.hostName}</p>
                  <div className="mt-2 flex justify-end">
                    <PublishResidencyButton
                      residency={d.residency}
                      hostId={d.hostId}
                      hostName={d.hostName}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Empty({ body }: { body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-5 text-center text-sm text-bark-soft">
      {body}
    </div>
  );
}
