"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Sprout,
  Globe,
  Users,
  ArrowRight,
  X,
  Home,
  Plus,
  Loader2,
} from "lucide-react";
import {
  hosts,
  teachers,
  getHost,
  getCoursesByHost,
} from "@/lib/data";
import { useAuth } from "@/components/auth-provider";
import {
  getPublishedListings,
  getHostNeeds,
  addHostNeed,
  deleteHostNeed,
  type PublishedListing,
  type HostNeed,
} from "@/lib/db";
import type { CategoryId, Teacher } from "@/lib/types";

export function HostDashboard() {
  const { profile, setHostSites } = useAuth();
  const claimed = profile?.hostSites ?? [];
  const [listings, setListings] = useState<PublishedListing[] | null>(null);

  useEffect(() => {
    void getPublishedListings()
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  const unclaimed = hosts.filter((h) => !claimed.includes(h.id));

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 text-clay">
        <Sprout className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Hosting
        </span>
      </div>

      {/* Site manager */}
      <div className="mt-4 rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-bark">
          Sites you steward
        </h2>
        <p className="mt-1 text-sm text-bark-soft">
          Choose the land you host on to see what&apos;s happening there.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {claimed.map((id) => {
            const h = getHost(id);
            if (!h) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-moss px-3 py-1.5 text-sm font-medium text-paper"
              >
                {h.name}
                <button
                  type="button"
                  aria-label={`Remove ${h.name}`}
                  onClick={() =>
                    void setHostSites(claimed.filter((x) => x !== id))
                  }
                  className="rounded-full hover:bg-paper/20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
          {unclaimed.length > 0 && (
            <select
              value=""
              onChange={(e) =>
                e.target.value &&
                void setHostSites([...claimed, e.target.value])
              }
              className="rounded-full border border-dashed border-stone bg-cream/40 px-3 py-1.5 text-sm text-bark-soft outline-none focus:border-fern"
            >
              <option value="">+ Add a site…</option>
              {unclaimed.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {claimed.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-8 text-center text-bark-soft">
          Add a site above to see its projects, live residencies, and teachers
          who fit your land.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {claimed.map((id) => {
            const host = getHost(id);
            if (!host) return null;
            return (
              <SitePanel
                key={id}
                hostId={id}
                listings={listings}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function SitePanel({
  hostId,
  listings,
}: {
  hostId: string;
  listings: PublishedListing[] | null;
}) {
  const host = getHost(hostId)!;
  const courses = getCoursesByHost(hostId);
  const liveListings = (listings ?? []).filter((l) => l.hostId === hostId);

  const matchingTeachers = useMemo<Teacher[]>(() => {
    const cats = new Set<CategoryId>(courses.map((c) => c.categoryId));
    const fit =
      cats.size > 0
        ? teachers.filter((t) => t.skills.some((s) => cats.has(s)))
        : [];
    const ranked = (fit.length > 0 ? fit : teachers)
      .slice()
      .sort((a, b) => b.rating - a.rating);
    return ranked.slice(0, 3);
  }, [courses]);

  return (
    <div className="rounded-3xl border border-stone-soft bg-paper p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold text-bark">
            {host.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-bark-soft">
            <MapPin className="h-4 w-4 text-fern" />
            {host.location.place}, {host.location.country} · {host.landType}
          </p>
        </div>
        <Link
          href={`/hosts/${host.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-moss hover:text-moss-deep"
        >
          View site
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Projects (editable) */}
        <SiteNeedsEditor hostId={hostId} staticNeeds={host.needs} />

        {/* Live residencies */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-clay">
            <Globe className="h-4 w-4" /> Live at your site
          </h4>
          <div className="mt-3 space-y-2">
            {liveListings.length === 0 && (
              <p className="text-sm text-bark-soft">
                No teacher-published residencies here yet.
              </p>
            )}
            {liveListings.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="block rounded-xl border border-stone-soft px-3 py-2 text-sm transition-colors hover:border-fern"
              >
                <span className="font-medium text-bark">{l.title}</span>
                <span className="block text-xs text-bark-soft">
                  with {l.teacherName}
                </span>
              </Link>
            ))}
            <p className="flex items-center gap-1.5 pt-1 text-sm text-bark-soft">
              <Home className="h-3.5 w-3.5 text-fern" />
              {courses.length} course{courses.length === 1 ? "" : "s"} in the
              catalogue
            </p>
          </div>
        </div>

        {/* Matching teachers */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-clay">
            <Users className="h-4 w-4" /> Teachers who fit
          </h4>
          <div className="mt-3 space-y-3">
            {matchingTeachers.map((t) => (
              <Link
                key={t.id}
                href={`/teachers/${t.slug}`}
                className="group flex items-center gap-3"
              >
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-bark group-hover:text-moss">
                    {t.name}
                  </span>
                  <span className="block truncate text-xs text-bark-soft">
                    {t.headline}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteNeedsEditor({
  hostId,
  staticNeeds,
}: {
  hostId: string;
  staticNeeds: string[];
}) {
  const { user } = useAuth();
  const [posted, setPosted] = useState<HostNeed[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getHostNeeds(hostId)
      .then(setPosted)
      .catch(() => setPosted([]));
  }, [hostId]);

  async function add() {
    const t = text.trim();
    if (!t || !user || busy) return;
    setBusy(true);
    try {
      const id = await addHostNeed(user.uid, hostId, t);
      setPosted((p) => [...p, { id, hostId, uid: user.uid, text: t }]);
      setText("");
    } catch (e) {
      console.error("Failed to add need", e);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    try {
      await deleteHostNeed(id);
      setPosted((p) => p.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Failed to remove need", e);
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-clay">
        <Sprout className="h-4 w-4" /> Projects needed
      </h4>
      <ul className="mt-3 space-y-2">
        {staticNeeds.slice(0, 3).map((n) => (
          <li key={n} className="flex gap-2 text-sm text-bark-soft">
            <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fern" />
            {n}
          </li>
        ))}
        {posted.map((n) => (
          <li
            key={n.id}
            className="flex items-start gap-2 rounded-lg bg-fern/5 px-2 py-1.5 text-sm text-bark"
          >
            <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fern" />
            <span className="flex-1">{n.text}</span>
            {user && n.uid === user.uid && (
              <button
                type="button"
                onClick={() => void remove(n.id)}
                aria-label="Remove project"
                className="shrink-0 text-stone hover:text-clay-deep"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void add();
            }
          }}
          placeholder="Post a project your land needs…"
          className="min-w-0 flex-1 rounded-lg border border-stone-soft bg-cream/40 px-2.5 py-1.5 text-sm text-bark outline-none focus:border-fern focus:bg-paper"
        />
        <button
          type="button"
          onClick={() => void add()}
          disabled={busy || !text.trim()}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-moss px-2.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-moss-deep disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Add
        </button>
      </div>
    </div>
  );
}
