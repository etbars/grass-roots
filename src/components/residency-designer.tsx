"use client";

import { useState } from "react";
import {
  PencilRuler,
  Loader2,
  Clock,
  Users,
  GraduationCap,
  Leaf,
  Hammer,
  Backpack,
  MapPin,
  CalendarDays,
  Check,
  Compass,
  Wallet,
  TrendingUp,
  Copy,
  Megaphone,
  Send,
} from "lucide-react";
import { hosts, formatPrice } from "@/lib/data";
import type { DesignedResidency } from "@/lib/residency-schema";
import { cn } from "@/lib/utils";

type Status = "idle" | "designing" | "done" | "error";

const FORMATS = [
  { value: "day", label: "Day course" },
  { value: "weekend", label: "Weekend workshop" },
  { value: "multi-week", label: "Multi-day intensive" },
  { value: "residency", label: "Multi-week residency" },
];

const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

const SKILL_SUGGESTIONS = [
  "Cob & natural building",
  "Beekeeping",
  "Permaculture design",
  "Herbal medicine",
  "Mushroom cultivation",
  "Food forest design",
  "Woodworking & tiny homes",
  "Wild foraging",
];

/** Pull a top-level JSON string field out of partially-streamed text. */
function extractString(raw: string, key: string): string | null {
  const m = raw.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!m) return null;
  try {
    return JSON.parse(`"${m[1]}"`);
  } catch {
    return m[1];
  }
}

/** Parse the full residency once the JSON object has finished streaming. */
function tryParse(raw: string): DesignedResidency | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as DesignedResidency;
  } catch {
    return null;
  }
}

export function ResidencyDesigner({
  defaultHostId,
}: {
  defaultHostId?: string;
}) {
  const [hostId, setHostId] = useState(defaultHostId ?? hosts[0].id);
  const [skill, setSkill] = useState("");
  const [format, setFormat] = useState("weekend");
  const [level, setLevel] = useState("All levels");
  const [audience, setAudience] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [raw, setRaw] = useState("");
  const [residency, setResidency] = useState<DesignedResidency | null>(null);
  const [error, setError] = useState("");

  const [matchStatus, setMatchStatus] = useState<
    "idle" | "matching" | "done" | "error"
  >("idle");
  const [matches, setMatches] = useState<
    { hostId: string; fitScore: number; reason: string }[]
  >([]);

  const host = hosts.find((h) => h.id === hostId)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!skill.trim() || status === "designing") return;

    setStatus("designing");
    setRaw("");
    setResidency(null);
    setError("");

    try {
      const res = await fetch("/api/design-residency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId, skill, format, level, audience }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong designing the residency.");
        setStatus("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        const errIdx = acc.indexOf("__ERROR__");
        if (errIdx !== -1) {
          setError(acc.slice(errIdx + "__ERROR__".length).trim());
          setStatus("error");
          return;
        }
        setRaw(acc);
      }

      const parsed = tryParse(acc);
      if (parsed) {
        setResidency(parsed);
        setStatus("done");
      } else {
        setError("The designer's response couldn't be read. Try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error reaching the designer.");
      setStatus("error");
    }
  }

  async function findMatches() {
    if (!skill.trim() || matchStatus === "matching") return;
    setMatchStatus("matching");
    setMatches([]);
    try {
      const res = await fetch("/api/match-hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill }),
      });
      const data = await res.json();
      if (!res.ok || !data.matches?.length) {
        setMatchStatus("error");
        return;
      }
      setMatches(data.matches);
      setMatchStatus("done");
    } catch {
      setMatchStatus("error");
    }
  }

  const livePreview = status === "designing" && !residency;
  const titlePreview = extractString(raw, "title");
  const hookPreview = extractString(raw, "hook");
  const daysPlanned = (raw.match(/"day"\s*:/g) ?? []).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      {/* ---- Form ---- */}
      <form
        onSubmit={handleSubmit}
        className="h-fit rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft lg:sticky lg:top-24"
      >
        <div className="flex items-center gap-2 text-clay">
          <PencilRuler className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Residency Studio
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold text-bark">
          Design a residency
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-bark-soft">
          Tell us your skill and pick a host site. We&apos;ll design a complete
          teacher residency, matched to the land&apos;s real projects.
        </p>

        <div className="mt-6 space-y-5">
          {/* Skill */}
          <div>
            <label className="text-sm font-semibold text-bark">
              What do you teach?
            </label>
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g. cob building, beekeeping, herbalism…"
              className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none placeholder:text-stone focus:border-moss focus:ring-2 focus:ring-fern/30"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkill(s)}
                  className="rounded-full border border-stone-soft bg-cream/60 px-2.5 py-1 text-xs text-bark-soft transition-colors hover:border-fern hover:text-moss"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Smart matching */}
          <div>
            <button
              type="button"
              onClick={findMatches}
              disabled={!skill.trim() || matchStatus === "matching"}
              className="flex items-center gap-1.5 text-sm font-semibold text-moss transition-colors hover:text-moss-deep disabled:opacity-50"
            >
              {matchStatus === "matching" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding your best-matched sites…
                </>
              ) : (
                <>
                  <Compass className="h-4 w-4" />
                  Not sure where? Find your best-matched sites
                </>
              )}
            </button>

            {matchStatus === "error" && (
              <p className="mt-2 text-xs text-clay">
                Couldn&apos;t find matches just now. Pick a site below.
              </p>
            )}

            {matchStatus === "done" && matches.length > 0 && (
              <ul className="mt-3 space-y-2">
                {matches.map((m, i) => {
                  const mh = hosts.find((h) => h.id === m.hostId);
                  if (!mh) return null;
                  const active = hostId === m.hostId;
                  return (
                    <li key={m.hostId}>
                      <button
                        type="button"
                        onClick={() => setHostId(m.hostId)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition-colors",
                          active
                            ? "border-moss bg-fern/10"
                            : "border-stone-soft bg-cream/40 hover:border-fern",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-bark">
                            {mh.name}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-moss">
                            {i === 0 && <TrendingUp className="h-3 w-3" />}
                            {m.fitScore}% fit
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-bark-soft">
                          {mh.location.place}, {mh.location.country}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-bark-soft">
                          {m.reason}
                        </p>
                        {active && (
                          <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-moss">
                            <Check className="h-3 w-3" /> Selected
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Host */}
          <div>
            <label className="text-sm font-semibold text-bark">Host site</label>
            <select
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
            >
              {hosts.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} · {h.location.place}, {h.location.country}
                </option>
              ))}
            </select>
            <p className="mt-2 rounded-lg bg-fern/10 px-3 py-2 text-xs leading-relaxed text-moss-deep">
              <span className="font-semibold">This land needs:</span>{" "}
              {host.needs[0].toLowerCase()}
              {host.needs.length > 1 ? `, and more.` : "."}
            </p>
          </div>

          {/* Format + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-bark">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-bark">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="text-sm font-semibold text-bark">
              Who is it for?{" "}
              <span className="font-normal text-stone">(optional)</span>
            </label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. beginners, families, aspiring smallholders"
              className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none placeholder:text-stone focus:border-moss focus:ring-2 focus:ring-fern/30"
            />
          </div>

          <button
            type="submit"
            disabled={!skill.trim() || status === "designing"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "designing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Designing…
              </>
            ) : (
              <>
                <PencilRuler className="h-4 w-4" />
                Build my residency
              </>
            )}
          </button>
        </div>
      </form>

      {/* ---- Result ---- */}
      <div className="min-h-[400px]">
        {status === "idle" && <DesignerEmptyState />}

        {status === "error" && (
          <div className="rounded-2xl border border-clay/30 bg-clay/5 p-8 text-center">
            <p className="font-display text-lg font-semibold text-clay-deep">
              The designer stumbled
            </p>
            <p className="mt-2 text-sm text-bark-soft">{error}</p>
          </div>
        )}

        {livePreview && (
          <DesignerLiveState
            hostName={host.name}
            title={titlePreview}
            hook={hookPreview}
            daysPlanned={daysPlanned}
          />
        )}

        {residency && status === "done" && (
          <ResidencyResult residency={residency} hostName={host.name} />
        )}
      </div>
    </div>
  );
}

function DesignerEmptyState() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-10 text-center">
      <div className="rounded-full bg-fern/10 p-4">
        <PencilRuler className="h-7 w-7 text-fern" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold text-bark">
        Your residency appears here
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-bark-soft">
        Pick a skill and a host site, then watch a complete residency take shape,
        with a schedule, outcomes, and real impact on the land.
      </p>
    </div>
  );
}

function DesignerLiveState({
  hostName,
  title,
  hook,
  daysPlanned,
}: {
  hostName: string;
  title: string | null;
  hook: string | null;
  daysPlanned: number;
}) {
  return (
    <div className="rounded-2xl border border-fern/40 bg-paper p-8 shadow-soft">
      <div className="flex items-center gap-2 text-fern">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-semibold">
          Reading the land at {hostName}…
        </span>
      </div>

      {title ? (
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-bark">
          {title}
          <span className="ml-0.5 inline-block h-7 w-[3px] animate-pulse bg-clay align-middle" />
        </h2>
      ) : (
        <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-stone-soft" />
      )}

      {hook ? (
        <p className="mt-3 text-lg leading-relaxed text-bark-soft">{hook}</p>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-stone-soft/70" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-stone-soft/70" />
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-sm text-moss">
        <CalendarDays className="h-4 w-4" />
        {daysPlanned > 0
          ? `Mapping the day-by-day · ${daysPlanned} ${
              daysPlanned === 1 ? "day" : "days"
            } so far…`
          : "Composing the day-by-day plan…"}
      </div>

      <div className="mt-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-stone-soft/40"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ResidencyResult({
  residency,
  hostName,
}: {
  residency: DesignedResidency;
  hostName: string;
}) {
  return (
    <article className="animate-[fadeIn_0.4s_ease] rounded-2xl border border-stone-soft bg-paper p-8 shadow-lift">
      <div className="flex items-center gap-2 text-clay">
        <PencilRuler className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Designed residency · {hostName}
        </span>
      </div>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-bark">
        {residency.title}
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-bark-soft">
        {residency.hook}
      </p>

      {/* meta */}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-moss-deep">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-fern" />
          {residency.durationDays}{" "}
          {residency.durationDays === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-fern" />
          {residency.skillLevel}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-fern" />
          Up to {residency.groupSize} students
        </span>
      </div>

      {/* why this match */}
      <div className="mt-6 rounded-xl border border-fern/30 bg-fern/10 p-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-moss-deep">
          <MapPin className="h-4 w-4" /> Why this match works
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-bark-soft">
          {residency.whyThisMatch}
        </p>
      </div>

      <EarningsPanel residency={residency} />

      {/* schedule */}
      <Section title="Day by day" icon={<CalendarDays className="h-4 w-4" />}>
        <ol className="mt-2 space-y-4">
          {residency.schedule.map((d) => (
            <li key={d.day} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-paper">
                {d.day}
              </div>
              <div className="border-b border-stone-soft/60 pb-4">
                <p className="font-semibold text-bark">{d.title}</p>
                <ul className="mt-1 space-y-1">
                  {d.activities.map((a, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-bark-soft"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-fern" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <ListBlock
          title="What you'll learn"
          icon={<GraduationCap className="h-4 w-4" />}
          items={residency.studentOutcomes}
          tone="moss"
        />
        <ListBlock
          title="What the land gains"
          icon={<Leaf className="h-4 w-4" />}
          items={residency.landImpact}
          tone="clay"
        />
        <ListBlock
          title="Materials & tools"
          icon={<Hammer className="h-4 w-4" />}
          items={residency.materials}
          tone="moss"
        />
        <ListBlock
          title="What to bring"
          icon={<Backpack className="h-4 w-4" />}
          items={residency.whatToBring}
          tone="moss"
        />
      </div>

      {/* Listing copy */}
      <Section title="Your listing" icon={<Megaphone className="h-4 w-4" />}>
        <div className="mt-2 rounded-xl border border-stone-soft bg-cream/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-bark">
              How students will see it
            </p>
            <CopyButton
              label="Copy listing"
              text={`${residency.title}\n\n${residency.listingDescription}\n\nWho it's for: ${residency.idealStudent}`}
            />
          </div>
          {residency.listingDescription.split("\n\n").map((p, i) => (
            <p key={i} className="mt-2 text-sm leading-relaxed text-bark-soft">
              {p}
            </p>
          ))}
          <p className="mt-3 text-sm text-bark">
            <span className="font-semibold">Who it&apos;s for:</span>{" "}
            {residency.idealStudent}
          </p>
          <div className="mt-3 rounded-lg bg-fern/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-moss-deep">
              Share it
            </p>
            <p className="mt-1 text-sm italic text-bark-soft">
              {residency.socialBlurb}
            </p>
          </div>
        </div>
      </Section>

      {/* Host pitch */}
      <Section
        title={`Message to ${hostName}`}
        icon={<Send className="h-4 w-4" />}
      >
        <div className="mt-2 rounded-xl border border-stone-soft bg-cream/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-bark">Ready to send</p>
            <CopyButton label="Copy message" text={residency.hostPitch} />
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-bark-soft">
            {residency.hostPitch}
          </p>
        </div>
      </Section>

      <button className="mt-8 w-full rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-clay-deep">
        Publish this residency
      </button>
    </article>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7">
      <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold text-bark">
        <span className="text-fern">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ListBlock({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "moss" | "clay";
}) {
  return (
    <div>
      <h4
        className={cn(
          "flex items-center gap-1.5 text-sm font-semibold",
          tone === "moss" ? "text-moss-deep" : "text-clay-deep",
        )}
      >
        {icon}
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm leading-relaxed text-bark-soft"
          >
            <Check
              className={cn(
                "mt-0.5 h-3.5 w-3.5 shrink-0",
                tone === "moss" ? "text-fern" : "text-clay",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Grass Roots takes a small platform fee; the host site takes a share for venue,
// accommodation, and food. The rest, minus materials, is the teacher's.
const PLATFORM_FEE = 0.1;
const HOST_SHARE = 0.15;

function EarningsPanel({ residency }: { residency: DesignedResidency }) {
  const [students, setStudents] = useState(residency.groupSize);
  const gross = students * residency.suggestedPrice;
  const platform = gross * PLATFORM_FEE;
  const hostShare = gross * HOST_SHARE;
  const materials = students * residency.materialsCostPerStudent;
  const takeHome = Math.max(0, gross - platform - hostShare - materials);

  return (
    <div className="mt-7 rounded-2xl border border-ochre/40 bg-ochre/10 p-5">
      <div className="flex items-center gap-1.5 font-display text-lg font-semibold text-bark">
        <Wallet className="h-5 w-5 text-clay" /> What you could earn
      </div>
      <p className="mt-1 text-sm leading-relaxed text-bark-soft">
        {residency.pricingRationale}
      </p>

      <div className="mt-4 flex items-baseline justify-between text-sm">
        <span className="text-bark-soft">Suggested price per student</span>
        <span className="font-semibold text-bark">
          {formatPrice(residency.suggestedPrice)}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-1.5 text-bark-soft">
            <Users className="h-4 w-4 text-fern" /> Students enrolled
          </label>
          <span className="font-semibold text-bark">
            {students} of {residency.groupSize}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={residency.groupSize}
          value={students}
          onChange={(e) => setStudents(Number(e.target.value))}
          className="mt-2 w-full accent-moss"
          aria-label="Students enrolled"
        />
      </div>

      <dl className="mt-4 space-y-1.5 text-sm">
        <EarningsRow label="Gross fees" value={formatPrice(gross)} />
        <EarningsRow label="Grass Roots (10%)" value={`- ${formatPrice(platform)}`} muted />
        <EarningsRow label="Host site (15%)" value={`- ${formatPrice(hostShare)}`} muted />
        {materials > 0 && (
          <EarningsRow label="Materials" value={`- ${formatPrice(materials)}`} muted />
        )}
      </dl>

      <div className="mt-3 flex items-baseline justify-between border-t border-ochre/40 pt-3">
        <span className="flex items-center gap-1.5 font-semibold text-bark">
          <TrendingUp className="h-4 w-4 text-clay" /> You take home
        </span>
        <span className="font-display text-2xl font-semibold text-moss-deep">
          {formatPrice(takeHome)}
        </span>
      </div>
      <p className="mt-1 text-right text-xs text-bark-soft">
        about {formatPrice(students > 0 ? takeHome / students : 0)} per student
      </p>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // clipboard unavailable; ignore
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-soft px-3 py-1.5 text-xs font-semibold text-bark-soft transition-colors hover:border-fern hover:text-moss"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-fern" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> {label}
        </>
      )}
    </button>
  );
}

function EarningsRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-bark-soft">{label}</dt>
      <dd className={muted ? "text-bark-soft" : "font-medium text-bark"}>
        {value}
      </dd>
    </div>
  );
}
