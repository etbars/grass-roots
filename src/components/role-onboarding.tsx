"use client";

import { useState } from "react";
import { GraduationCap, PencilRuler, Sprout, Check } from "lucide-react";
import { useAuth, type UserRole } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: {
  role: UserRole;
  icon: typeof GraduationCap;
  title: string;
  body: string;
}[] = [
  {
    role: "student",
    icon: GraduationCap,
    title: "Learn",
    body: "Take courses and residencies, and learn a craft by doing it on real land.",
  },
  {
    role: "teacher",
    icon: PencilRuler,
    title: "Teach",
    body: "Design and lead residencies in a craft you know.",
  },
  {
    role: "host",
    icon: Sprout,
    title: "Host",
    body: "Open your farm or project to teaching residencies.",
  },
];

export function RoleOnboarding() {
  const { enabled, user, profile, setRoles } = useAuth();
  const [selected, setSelected] = useState<Set<UserRole>>(new Set(["student"]));
  const [saving, setSaving] = useState(false);

  const needsOnboarding =
    enabled && user && profile && profile.roles.length === 0;
  if (!needsOnboarding) return null;

  const toggle = (role: UserRole) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });

  async function save() {
    if (selected.size === 0 || saving) return;
    setSaving(true);
    await setRoles([...selected]);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bark/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-[fadeIn_0.3s_ease] rounded-3xl border border-stone-soft bg-cream p-7 shadow-lift sm:p-9">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Welcome to Grass Roots
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-bark">
          How will you grow with us?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-bark-soft">
          Pick what fits, you can be more than one, and change it anytime.
        </p>

        <div className="mt-6 space-y-3">
          {ROLE_OPTIONS.map((o) => {
            const on = selected.has(o.role);
            return (
              <button
                key={o.role}
                type="button"
                onClick={() => toggle(o.role)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                  on
                    ? "border-moss bg-fern/10"
                    : "border-stone-soft bg-paper hover:border-fern",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    on ? "bg-moss text-paper" : "bg-fern/12 text-moss",
                  )}
                >
                  <o.icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-semibold text-bark">
                    {o.title}
                  </span>
                  <span className="block text-sm leading-snug text-bark-soft">
                    {o.body}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    on ? "border-moss bg-moss text-paper" : "border-stone",
                  )}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={selected.size === 0 || saving}
          className="mt-6 w-full rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-50"
        >
          {saving ? "Setting up your space…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
