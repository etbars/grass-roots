"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, X, Send, Loader2, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { conversationId, startConversation, sendMessage } from "@/lib/db";

export function MessageTeacherButton({
  listingId,
  listingTitle,
  teacherUid,
  teacherName,
}: {
  listingId: string;
  listingTitle: string;
  teacherUid: string;
  teacherName: string;
}) {
  const { enabled, user, profile, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  // Hide if messaging is off, no teacher to reach, or this is your own listing.
  if (!enabled || !teacherUid || (user && user.uid === teacherUid)) return null;

  function onTrigger() {
    if (!user) {
      openAuth();
      return;
    }
    setOpen(true);
  }

  async function submit() {
    if (!user || !text.trim() || sending) return;
    setSending(true);
    const name = profile?.displayName || user.displayName || "A student";
    const body = text.trim();
    try {
      const id = conversationId(listingId, user.uid);
      await startConversation({
        listingId,
        listingTitle,
        studentUid: user.uid,
        studentName: name,
        teacherUid,
        teacherName,
      });
      await sendMessage(id, { uid: user.uid, name }, body);
      void fetch("/api/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          recipientUid: teacherUid,
          name,
          detail: listingTitle,
        }),
      }).catch(() => {});
      setSentId(id);
    } catch (e) {
      console.error("Failed to start conversation", e);
    }
    setSending(false);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setText("");
      setSentId(null);
    }, 200);
  }

  return (
    <>
      <button
        type="button"
        onClick={onTrigger}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-moss/30 px-5 py-2.5 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/10"
      >
        <MessageSquare className="h-4 w-4" />
        {user ? "Message the teacher" : "Sign in to message the teacher"}
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
                {sentId ? "Message sent" : `Message ${teacherName}`}
              </h3>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded-full p-1 text-bark-soft hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {sentId ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fern/15">
                  <Check className="h-7 w-7 text-moss" />
                </div>
                <p className="mt-4 text-bark">
                  Sent to{" "}
                  <span className="font-semibold">{teacherName}</span>. They can
                  reply right here on Grass Roots.
                </p>
                <Link
                  href={`/messages?c=${sentId}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
                >
                  Go to the conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
                className="mt-4 space-y-3"
              >
                <p className="text-sm leading-relaxed text-bark-soft">
                  Ask {teacherName} about{" "}
                  <span className="font-medium text-bark">{listingTitle}</span>.
                  Your message starts a conversation you can both continue here.
                </p>
                <textarea
                  required
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Hi! I'd love to know more about…"
                  className="w-full resize-y rounded-lg border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm leading-relaxed text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
