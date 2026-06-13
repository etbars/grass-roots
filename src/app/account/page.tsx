"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bookmark,
  CalendarCheck,
  Globe,
  Loader2,
  LogIn,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  useAuth,
  type UserRole,
} from "@/components/auth-provider";
import {
  getMyEnrollments,
  getMyListings,
  getMyResidencies,
  type Enrollment,
  type PublishedListing,
  type SavedResidency,
} from "@/lib/db";
import { PublishResidencyButton } from "@/components/publish-residency-button";
import { formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";

const ALL_ROLES: UserRole[] = ["student", "teacher", "host"];

export default function AccountPage() {
  const { enabled, loading, user, profile, signIn, setRoles } = useAuth();
  const [residencies, setResidencies] = useState<SavedResidency[] | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [listings, setListings] = useState<PublishedListing[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void getMyResidencies(user.uid).then(setResidencies);
    void getMyEnrollments(user.uid).then(setEnrollments);
    void getMyListings(user.uid).then(setListings);
  }, [user]);

  if (!enabled) {
    return (
      <Shell>
        <p className="text-bark-soft">
          Accounts aren&apos;t configured in this environment.
        </p>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <Loader2 className="h-6 w-6 animate-spin text-moss" />
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold text-bark">
          Your space at Grass Roots
        </h1>
        <p className="mt-3 max-w-md text-bark-soft">
          Sign in to save the residencies you design and keep track of the
          courses you&apos;ve reserved.
        </p>
        <button
          type="button"
          onClick={() => void signIn()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </button>
      </Shell>
    );
  }

  const firstName = (profile?.displayName || user.displayName || "").split(
    " ",
  )[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <header>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Your space
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-bark">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>
      </header>

      {/* Roles */}
      <section className="mt-8 rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-bark">
          You&apos;re here to
        </h2>
        <p className="mt-1 text-sm text-bark-soft">
          Tap to update. You can be more than one.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_ROLES.map((role) => {
            const on = profile?.roles.includes(role) ?? false;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  const current = new Set(profile?.roles ?? []);
                  if (current.has(role)) current.delete(role);
                  else current.add(role);
                  void setRoles([...current]);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                  on
                    ? "border-moss bg-moss text-paper"
                    : "border-stone-soft bg-cream/40 text-bark-soft hover:border-fern",
                )}
              >
                {on && <Check className="h-3.5 w-3.5" />}
                {role}
              </button>
            );
          })}
        </div>
      </section>

      {/* Live listings */}
      {listings && listings.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-bark">
            <Globe className="h-5 w-5 text-fern" />
            Your live listings
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="group rounded-2xl border border-stone-soft bg-paper p-5 shadow-soft transition-colors hover:border-fern"
              >
                <span className="inline-flex items-center gap-1 rounded-full bg-fern/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-moss">
                  Live
                </span>
                <p className="mt-2 font-display text-lg font-semibold leading-snug text-bark group-hover:text-moss">
                  {l.title}
                </p>
                <p className="mt-1 text-sm text-bark-soft">
                  {l.hostName} · {formatPrice(l.price)}
                </p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-moss">
                  View listing
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Saved residencies */}
        <section>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-bark">
            <Bookmark className="h-5 w-5 text-fern" />
            Saved residencies
          </h2>
          <div className="mt-4 space-y-3">
            {residencies === null ? (
              <Loader2 className="h-5 w-5 animate-spin text-moss" />
            ) : residencies.length === 0 ? (
              <EmptyCard
                body="Design one in the Residency Studio and save it here."
                href="/teach"
                cta="Open the Studio"
              />
            ) : (
              residencies.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-stone-soft bg-paper p-5 shadow-soft"
                >
                  <p className="font-display text-lg font-semibold leading-snug text-bark">
                    {r.residency.title}
                  </p>
                  <p className="mt-1 text-sm text-bark-soft">
                    {r.hostName} · {r.residency.durationDays}{" "}
                    {r.residency.durationDays === 1 ? "day" : "days"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-bark-soft">
                    {r.residency.hook}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <PublishResidencyButton
                      residency={r.residency}
                      hostId={r.hostId}
                      hostName={r.hostName}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Reservations */}
        <section>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-bark">
            <CalendarCheck className="h-5 w-5 text-fern" />
            Your reservations
          </h2>
          <div className="mt-4 space-y-3">
            {enrollments === null ? (
              <Loader2 className="h-5 w-5 animate-spin text-moss" />
            ) : enrollments.length === 0 ? (
              <EmptyCard
                body="Reserve a spot on a course and it'll show up here."
                href="/courses"
                cta="Browse courses"
              />
            ) : (
              enrollments.map((e) => (
                <Link
                  key={e.id}
                  href={`/courses/${e.courseSlug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-soft bg-paper p-5 shadow-soft transition-colors hover:border-fern"
                >
                  <span className="font-medium text-bark group-hover:text-moss">
                    {e.courseTitle}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-fern transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col items-start justify-center px-5 py-12 sm:px-8">
      {children}
    </div>
  );
}

function EmptyCard({
  body,
  href,
  cta,
}: {
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-6 text-center">
      <p className="text-sm text-bark-soft">{body}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-moss hover:text-moss-deep"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
