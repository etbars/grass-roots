"use client";

import { useEffect, useState } from "react";
import { X, Check, Send, CalendarCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { isReserved, reserveCourse } from "@/lib/db";

export function ApplyButton({
  courseTitle,
  courseId,
  courseSlug,
  coursePath,
  className,
  label = "Request to join",
}: {
  courseTitle: string;
  courseId?: string;
  courseSlug?: string;
  coursePath?: string;
  className?: string;
  label?: string;
}) {
  const { enabled, user } = useAuth();
  const baseClass =
    className ??
    "w-full rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-clay-deep";

  // ---- Signed-in: reserve straight to the account ----
  const canReserve = enabled && user && courseId && courseSlug;
  const [reserved, setReserved] = useState(false);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (canReserve) {
      void isReserved(user!.uid, courseId!).then(setReserved);
    }
  }, [canReserve, user, courseId]);

  if (canReserve) {
    async function reserve() {
      if (reserving || reserved) return;
      setReserving(true);
      try {
        await reserveCourse(user!.uid, {
          id: courseId!,
          title: courseTitle,
          slug: courseSlug!,
          path: coursePath,
        });
        setReserved(true);
      } catch (err) {
        console.error("Failed to reserve", err);
      }
      setReserving(false);
    }
    return (
      <button
        type="button"
        onClick={() => void reserve()}
        disabled={reserving || reserved}
        className={
          reserved
            ? "flex w-full items-center justify-center gap-2 rounded-full bg-fern/15 px-5 py-3 text-sm font-semibold text-moss-deep"
            : `${baseClass} flex items-center justify-center gap-2 disabled:opacity-70`
        }
      >
        {reserved ? (
          <>
            <Check className="h-4 w-4" />
            Spot reserved
          </>
        ) : reserving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reserving…
          </>
        ) : (
          <>
            <CalendarCheck className="h-4 w-4" />
            Reserve a spot
          </>
        )}
      </button>
    );
  }

  // ---- Signed-out (or Firebase off): existing request-by-email flow ----
  return <RequestModal courseTitle={courseTitle} label={label} baseClass={baseClass} />;
}

function RequestModal({
  courseTitle,
  label,
  baseClass,
}: {
  courseTitle: string;
  label: string;
  baseClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function close() {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
    }, 200);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={baseClass}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bark/40 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-xl font-semibold text-bark">
                {sent ? "Request sent" : "Request to join"}
              </h3>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded-full p-1 text-bark-soft hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {sent ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fern/15">
                  <Check className="h-7 w-7 text-moss" />
                </div>
                <p className="mt-4 text-bark">
                  Thanks{name ? `, ${name.split(" ")[0]}` : ""}! Your request to
                  join <span className="font-semibold">{courseTitle}</span> is on
                  its way to the teacher.
                </p>
                <p className="mt-2 text-sm text-bark-soft">
                  They&apos;ll be in touch to confirm your place.
                </p>
                <button
                  onClick={close}
                  className="mt-6 rounded-full bg-moss px-6 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-4 space-y-4"
              >
                <p className="text-sm leading-relaxed text-bark-soft">
                  Tell the teacher a little about you and we&apos;ll pass along
                  your interest in{" "}
                  <span className="font-medium text-bark">{courseTitle}</span>.
                  Tip: sign in to reserve your spot in one click.
                </p>
                <div>
                  <label className="text-sm font-semibold text-bark">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-bark">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
                >
                  <Send className="h-4 w-4" />
                  Send request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
