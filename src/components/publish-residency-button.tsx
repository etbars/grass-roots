"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, X, Check, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { hosts, categories } from "@/lib/data";
import { publishListing } from "@/lib/db";
import type { DesignedResidency } from "@/lib/residency-schema";
import type { CategoryId } from "@/lib/types";

export function PublishResidencyButton({
  residency,
  hostId,
  hostName,
  generic = false,
  variant = "outline",
}: {
  residency: DesignedResidency;
  hostId: string;
  hostName: string;
  generic?: boolean;
  variant?: "outline" | "solid";
}) {
  const { enabled, user, profile, signIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id);
  const [price, setPrice] = useState<number>(residency.suggestedPrice || 0);

  if (!enabled) return null;

  const trigger =
    variant === "solid"
      ? "inline-flex items-center gap-1.5 rounded-full bg-clay px-3.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-clay-deep"
      : "inline-flex items-center gap-1.5 rounded-full border border-clay/40 px-3.5 py-1.5 text-xs font-semibold text-clay-deep transition-colors hover:bg-clay/10";

  function onTrigger() {
    if (!user) {
      void signIn();
      return;
    }
    setOpen(true);
  }

  async function publish() {
    if (!user || publishing) return;
    setPublishing(true);
    const host = hosts.find((h) => h.id === hostId);
    const n = residency.durationDays;
    try {
      const id = await publishListing({
        uid: user.uid,
        teacherName:
          profile?.displayName || user.displayName || "A Grass Roots teacher",
        hostId,
        hostName,
        hostPlace: host?.location.place ?? "",
        hostCountry: host?.location.country ?? "",
        image: host?.image ?? "/images/farm-work.jpg",
        categoryId,
        title: residency.title,
        hook: residency.hook,
        durationDays: n,
        durationLabel: `${n} ${n === 1 ? "day" : "days"}`,
        skillLevel: residency.skillLevel,
        groupSize: residency.groupSize,
        price: Number(price) || 0,
        listingDescription: residency.listingDescription,
        schedule: residency.schedule,
        studentOutcomes: residency.studentOutcomes,
        materials: residency.materials,
        whatToBring: residency.whatToBring,
      });
      setPublishedId(id);
    } catch (err) {
      console.error("Failed to publish listing", err);
    }
    setPublishing(false);
  }

  return (
    <>
      <button type="button" onClick={onTrigger} className={trigger}>
        <Globe className="h-3.5 w-3.5" />
        {user ? "Publish" : "Sign in to publish"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bark/40 p-4 backdrop-blur-sm"
          onClick={() => !publishing && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-paper p-7 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            {publishedId ? (
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-paper">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-bark">
                  You&apos;re live.
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-bark-soft">
                  <span className="font-medium text-bark">
                    {residency.title}
                  </span>{" "}
                  is now published in Courses for students to find and reserve.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/listings/${publishedId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
                  >
                    View your live listing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full px-5 py-2 text-sm font-semibold text-bark-soft hover:text-bark"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl font-semibold text-bark">
                    Publish to Courses
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="rounded-full p-1 text-bark-soft hover:bg-cream"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-bark-soft">
                  {generic ? (
                    <>
                      Make this residency a live listing open to any willing
                      host. Students will be able to find and reserve it.
                    </>
                  ) : (
                    <>
                      Make this residency a live listing at{" "}
                      <span className="font-medium text-bark">{hostName}</span>.
                      Students will be able to find and reserve it.
                    </>
                  )}
                </p>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-bark">
                      Craft
                    </span>
                    <select
                      value={categoryId}
                      onChange={(e) =>
                        setCategoryId(e.target.value as CategoryId)
                      }
                      className="w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-fern focus:bg-paper"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-bark">
                      Price per student (EUR)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-fern focus:bg-paper"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => void publish()}
                  disabled={publishing}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep disabled:opacity-60"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      Publish my residency
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
