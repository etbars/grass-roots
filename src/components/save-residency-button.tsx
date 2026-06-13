"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { saveResidency } from "@/lib/db";
import type { DesignedResidency } from "@/lib/residency-schema";

export function SaveResidencyButton({
  residency,
  hostId,
  hostName,
}: {
  residency: DesignedResidency;
  hostId: string;
  hostName: string;
}) {
  const { enabled, user, signIn } = useAuth();
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  if (!enabled) return null;

  async function onClick() {
    if (!user) {
      await signIn();
      return;
    }
    setState("saving");
    try {
      await saveResidency(user.uid, hostId, hostName, residency);
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      console.error("Failed to save residency", err);
      setState("idle");
    }
  }

  const label = !user
    ? "Sign in to save"
    : state === "saving"
      ? "Saving…"
      : state === "saved"
        ? "Saved to your account"
        : "Save residency";

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={state === "saving"}
      className="inline-flex items-center gap-1.5 rounded-full border border-moss/30 px-3.5 py-1.5 text-xs font-semibold text-moss-deep transition-colors hover:bg-fern/10 disabled:opacity-60"
    >
      {!user ? (
        <LogIn className="h-3.5 w-3.5" />
      ) : state === "saving" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : state === "saved" ? (
        <Check className="h-3.5 w-3.5 text-moss" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {label}
    </button>
  );
}
