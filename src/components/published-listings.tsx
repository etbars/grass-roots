"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Clock, CalendarDays, Globe } from "lucide-react";
import { categories, formatPrice, formatDate } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";
import { firebaseEnabled } from "@/lib/firebase";
import { getPublishedListings, type PublishedListing } from "@/lib/db";

export function PublishedListings({ category }: { category?: string | null }) {
  const [listings, setListings] = useState<PublishedListing[] | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    void getPublishedListings()
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  if (!listings || listings.length === 0) return null;
  const filtered = category
    ? listings.filter((l) => l.categoryId === category)
    : listings;
  if (filtered.length === 0) return null;

  return (
    <section className="mt-8 rounded-3xl border border-fern/30 bg-fern/5 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-clay">
        <Globe className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Fresh from the Studio
        </span>
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-bark sm:text-3xl">
        Residencies teachers just published
      </h2>
      <p className="mt-1.5 text-bark-soft">
        Designed in the Residency Studio and opened up for students. Be among
        the first to join.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}

function ListingCard({ listing }: { listing: PublishedListing }) {
  const categoryName =
    categories.find((c) => c.id === listing.categoryId)?.name ??
    listing.categoryId;
  const forming = !listing.startDate;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-moss-deep backdrop-blur">
          <CategoryIcon id={listing.categoryId} className="h-3.5 w-3.5" />
          {categoryName}
        </div>
        <div
          className={
            forming
              ? "absolute right-3 top-3 rounded-full bg-fern/90 px-2.5 py-1 text-xs font-semibold text-paper"
              : "absolute right-3 top-3 rounded-full bg-clay/95 px-2.5 py-1 text-xs font-semibold text-paper"
          }
        >
          {forming ? "Gathering interest" : "Just published"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-bark transition-colors group-hover:text-moss">
          {listing.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-bark-soft">
          <MapPin className="h-3.5 w-3.5 text-fern" />
          {listing.hostPlace || listing.hostName}
          {listing.hostCountry ? `, ${listing.hostCountry}` : ""}
        </p>
        <p className="mt-1 text-sm text-bark-soft">
          with{" "}
          <span className="font-medium text-bark">{listing.teacherName}</span>
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-stone-soft/70 pt-4">
          <div className="text-sm text-bark-soft">
            <p className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-fern" />
              {forming ? "Dates forming" : `Starts ${formatDate(listing.startDate!)}`}
            </p>
            <p className="mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-fern" />
              {listing.durationLabel}
            </p>
          </div>
          <p className="font-display text-xl font-semibold text-bark">
            {formatPrice(listing.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
