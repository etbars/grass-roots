"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowRight, Globe } from "lucide-react";
import { categories, formatPrice } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";
import { firebaseEnabled } from "@/lib/firebase";
import { getListingsByHost, type PublishedListing } from "@/lib/db";

/** Teacher-published residencies live at this host site. */
export function HostListings({ hostId }: { hostId: string }) {
  const [listings, setListings] = useState<PublishedListing[] | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    void getListingsByHost(hostId)
      .then(setListings)
      .catch(() => setListings([]));
  }, [hostId]);

  if (!listings || listings.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-bark">
        <Globe className="h-6 w-6 text-fern" /> Residencies open here
      </h2>
      <p className="mt-1 text-sm text-bark-soft">
        Teacher-designed residencies published at this site.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {listings.map((l) => {
          const cat =
            categories.find((c) => c.id === l.categoryId)?.name ?? l.categoryId;
          return (
            <Link
              key={l.id}
              href={`/listings/${l.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={l.image}
                  alt={l.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-moss-deep backdrop-blur">
                  <CategoryIcon id={l.categoryId} className="h-3.5 w-3.5" />
                  {cat}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-bark group-hover:text-moss">
                  {l.title}
                </h3>
                <p className="mt-1 text-sm text-bark-soft">
                  with {l.teacherName}
                </p>
                <div className="mt-4 flex items-end justify-between border-t border-stone-soft/70 pt-3">
                  <p className="flex items-center gap-1 text-sm text-bark-soft">
                    <Clock className="h-3.5 w-3.5 text-fern" />
                    {l.durationLabel}
                  </p>
                  <p className="font-display text-lg font-semibold text-bark">
                    {formatPrice(l.price)}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-moss">
                  View residency
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
