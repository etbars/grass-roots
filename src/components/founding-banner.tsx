"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { FOUNDING_LIVE } from "@/lib/founding";

/** A slim, dismissible top bar driving traffic to the founding offer. */
export function FoundingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!FOUNDING_LIVE) return;
    setShow(localStorage.getItem("gr-founding-dismissed") !== "1");
  }, []);

  if (!FOUNDING_LIVE || !show) return null;

  return (
    <div className="relative bg-moss text-paper">
      <Link
        href="/founding"
        className="group flex items-center justify-center gap-2 px-10 py-2 text-center text-sm transition-colors hover:bg-moss-deep"
      >
        <span>
          <span className="font-semibold">Founding members:</span> reserve
          credit now and lock in up to a +35% bonus.
        </span>
        <span className="inline-flex items-center gap-1 font-semibold underline-offset-2 group-hover:underline">
          Reserve
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("gr-founding-dismissed", "1");
          setShow(false);
        }}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper/80 transition-colors hover:bg-paper/15 hover:text-paper"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
