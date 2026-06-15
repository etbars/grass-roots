"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  CalendarDays,
  GraduationCap,
  Users,
  Sprout,
  Backpack,
  Hammer,
  Loader2,
  ArrowLeft,
  Globe,
  Sparkles,
  Pencil,
} from "lucide-react";
import { categories, formatPrice, formatDate } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";
import { ApplyButton } from "@/components/apply-button";
import { useAuth } from "@/components/auth-provider";
import { getListing, type PublishedListing } from "@/lib/db";

export function ListingDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const [listing, setListing] = useState<PublishedListing | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    void getListing(id).then((l) => {
      setListing(l);
      setState(l ? "ready" : "missing");
    });
  }, [id]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-moss" />
      </div>
    );
  }

  if (state === "missing" || !listing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-3xl font-semibold text-bark">
          This listing isn&apos;t available.
        </h1>
        <p className="mt-3 text-bark-soft">
          It may have been unpublished. Browse what&apos;s live instead.
        </p>
        <Link
          href="/courses"
          className="mt-6 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper hover:bg-moss-deep"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  const categoryName =
    categories.find((c) => c.id === listing.categoryId)?.name ??
    listing.categoryId;
  const paragraphs = listing.listingDescription.split("\n\n").filter(Boolean);
  const demo = listing.demo === true;
  const forming = !demo && !listing.startDate;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-bark-soft hover:text-moss"
        >
          <ArrowLeft className="h-4 w-4" /> Courses
        </Link>
        {user?.uid === listing.uid && (
          <Link
            href={`/listings/${listing.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-moss/30 px-4 py-1.5 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit listing
          </Link>
        )}
      </div>

      <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-3xl">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-sm font-semibold text-moss-deep backdrop-blur">
          <CategoryIcon id={listing.categoryId} className="h-4 w-4" />
          {categoryName}
        </div>
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          {demo ? (
            <div className="rounded-full bg-bark/85 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur">
              Demonstration
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-clay/95 px-3 py-1.5 text-xs font-semibold text-paper">
              <Globe className="h-3.5 w-3.5" /> Teacher published
            </div>
          )}
          {forming && (
            <div className="flex items-center gap-1.5 rounded-full bg-fern/90 px-3 py-1.5 text-xs font-semibold text-paper">
              <Sparkles className="h-3.5 w-3.5" /> Gathering interest
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-bark">
            {listing.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-bark-soft">
            <MapPin className="h-4 w-4 text-fern" />
            {listing.hostName}
            {listing.hostPlace ? ` · ${listing.hostPlace}` : ""}
            {listing.hostCountry ? `, ${listing.hostCountry}` : ""}
          </p>
          <p className="mt-1 text-sm text-bark-soft">
            with <span className="font-medium text-bark">{listing.teacherName}</span>
          </p>

          <p className="mt-5 text-lg leading-relaxed text-bark-soft">
            {listing.hook}
          </p>

          {paragraphs.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-bark-soft">
              {p}
            </p>
          ))}

          {(listing.schedule?.length ?? 0) > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-bark">
                What you&apos;ll do
              </h2>
              <ol className="mt-4 space-y-3">
                {listing.schedule.map((day) => (
                  <li
                    key={day.day}
                    className="rounded-2xl border border-stone-soft bg-paper p-5"
                  >
                    <p className="font-display text-lg font-semibold text-bark">
                      Day {day.day}: {day.title}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {day.activities.map((a, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm text-bark-soft"
                        >
                          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <ListBlock
              icon={<GraduationCap className="h-5 w-5 text-fern" />}
              title="What you'll leave with"
              items={listing.studentOutcomes}
            />
            <ListBlock
              icon={<Hammer className="h-5 w-5 text-fern" />}
              title="Materials provided"
              items={listing.materials}
            />
            <ListBlock
              icon={<Backpack className="h-5 w-5 text-fern" />}
              title="What to bring"
              items={listing.whatToBring}
            />
          </div>
        </div>

        {/* sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
            <p className="font-display text-3xl font-semibold text-bark">
              {formatPrice(listing.price)}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-bark">
              <li className="flex items-center gap-2.5">
                <CalendarDays className="h-4 w-4 text-fern" />
                {forming ? (
                  <span className="text-bark-soft">
                    Dates forming
                  </span>
                ) : (
                  <>Starts {formatDate(listing.startDate!)}</>
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-fern" />
                {listing.durationLabel}
              </li>
              <li className="flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-fern" />
                {listing.skillLevel}
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-fern" />
                Up to {listing.groupSize} students
              </li>
            </ul>
            <div className="mt-6">
              <ApplyButton
                courseTitle={listing.title}
                courseId={listing.id}
                courseSlug={listing.id}
                coursePath={`/listings/${listing.id}`}
                listingId={listing.id}
                interest={forming}
                demo={demo}
              />
            </div>
            <p className="mt-3 text-center text-xs text-bark-soft">
              {demo
                ? "An illustrative sample listing, shown to demonstrate the platform."
                : forming
                  ? "Registering records your interest and helps the teacher gauge demand. Nothing is booked or charged."
                  : "Reserving registers your interest with the teacher. Nothing is booked or charged."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ListBlock({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-bark">
        {icon} {title}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-bark-soft">
            <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
