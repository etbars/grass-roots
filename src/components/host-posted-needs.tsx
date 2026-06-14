"use client";

import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { firebaseEnabled } from "@/lib/firebase";
import { getHostNeeds, type HostNeed } from "@/lib/db";

/** Project needs the host has posted themselves, shown alongside the listed ones. */
export function HostPostedNeeds({ hostId }: { hostId: string }) {
  const [needs, setNeeds] = useState<HostNeed[]>([]);

  useEffect(() => {
    if (!firebaseEnabled) return;
    void getHostNeeds(hostId)
      .then(setNeeds)
      .catch(() => setNeeds([]));
  }, [hostId]);

  if (needs.length === 0) return null;

  return (
    <>
      {needs.map((n) => (
        <li
          key={n.id}
          className="flex items-start gap-2.5 rounded-xl border border-fern/30 bg-fern/5 p-3.5 text-bark"
        >
          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
          <span className="flex-1">{n.text}</span>
          <span className="shrink-0 rounded-full bg-fern/15 px-2 py-0.5 text-[11px] font-medium text-moss">
            posted by host
          </span>
        </li>
      ))}
    </>
  );
}
