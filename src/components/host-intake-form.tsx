"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, MapPin, Sprout } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { submitHostApplication } from "@/lib/db";

const LAND_TYPES = [
  "Regenerative farm",
  "Off-grid homestead",
  "Permaculture project",
  "Eco-building site",
  "Smallholding",
  "Rewilding project",
  "Something else",
];

export function HostIntakeForm() {
  const { enabled, user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [landType, setLandType] = useState(LAND_TYPES[0]);
  const [location, setLocation] = useState("");
  const [needs, setNeeds] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit() {
    if (saving) return;
    setSaving(true);
    try {
      if (enabled) {
        await submitHostApplication(
          { siteName: name, landType, location, needs, email },
          user?.uid ?? null,
        );
      }
    } catch (err) {
      // Don't block the confirmation on a write error in the demo.
      console.error("Host application failed to save", err);
    }
    setSaving(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="animate-[fadeIn_0.4s_ease] rounded-2xl border border-fern/40 bg-fern/5 p-8 text-center shadow-soft sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-paper">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-bark">
          Thank you{name.trim() ? `, ${name.trim()}` : ""}.
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-soft">
          Your land is on our radar. A member of the Grass Roots team will be in
          touch to learn more about your site and the projects it needs, then
          help you welcome your first residency.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/hosts"
            className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep"
          >
            See host sites already growing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-5 py-2.5 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
          >
            List another site
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      className="rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-center gap-2 text-clay">
        <Sprout className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          List your land
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-bark-soft">
        A few minutes is all it takes. Tell us about your site and we&apos;ll
        take it from there.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Site name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fairytale Cob Holding"
            className="w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Land type">
            <select
              value={landType}
              onChange={(e) => setLandType(e.target.value)}
              className="w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
            >
              {LAND_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fern" />
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Place, Country"
                className="w-full rounded-xl border border-stone-soft bg-cream/40 py-2.5 pl-9 pr-3.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
              />
            </div>
          </Field>
        </div>

        <Field label="What does your land need?">
          <textarea
            value={needs}
            onChange={(e) => setNeeds(e.target.value)}
            rows={3}
            placeholder="A cob wall raised, a food forest planted, hedgerows restored, a barn re-roofed in natural materials..."
            className="w-full resize-none rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm leading-relaxed text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
          />
        </Field>

        <Field label="Email" hint="So we can reach you">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourfarm.earth"
            className="w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
      >
        {saving ? "Sending…" : "List my land"}
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-stone">
        No commitment. You approve every residency before it happens.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-bark">
        {label}
        {hint && <span className="text-xs font-normal text-stone">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
