"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, ArrowLeft, MessageSquare, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import {
  watchConversations,
  watchMessages,
  sendMessage,
  markConversationRead,
  isUnread,
  type Conversation,
  type Message,
} from "@/lib/db";
import { cn } from "@/lib/utils";

function time(m: Message): string {
  const d = m.createdAt?.toDate?.();
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MessagesInbox() {
  const { enabled, loading, user, profile, openAuth } = useAuth();
  const [convos, setConvos] = useState<Conversation[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-open a conversation when arrived via ?c= (client-only, no Suspense).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c) setSelected(c);
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchConversations(user.uid, setConvos);
  }, [user]);

  useEffect(() => {
    if (!selected || !user) {
      setMessages([]);
      return;
    }
    const unsub = watchMessages(selected, setMessages);
    void markConversationRead(selected, user.uid).catch(() => {});
    return unsub;
  }, [selected, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (selected && user && messages.length) {
      void markConversationRead(selected, user.uid).catch(() => {});
    }
  }, [messages, selected, user]);

  if (!enabled)
    return <Center>Messaging isn&apos;t available here.</Center>;
  if (loading)
    return (
      <Center>
        <Loader2 className="h-6 w-6 animate-spin text-moss" />
      </Center>
    );
  if (!user)
    return (
      <Center>
        <MessageSquare className="h-8 w-8 text-fern" />
        <p className="mt-3 text-bark-soft">Sign in to see your messages.</p>
        <button
          type="button"
          onClick={() => openAuth()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
        >
          <LogIn className="h-4 w-4" /> Sign in
        </button>
      </Center>
    );

  const me = user.uid;
  const myName = profile?.displayName || user.displayName || "You";
  const current = convos?.find((c) => c.id === selected) ?? null;
  const otherName = (c: Conversation) =>
    c.studentUid === me ? c.teacherName : c.studentName;
  const otherUid = (c: Conversation) =>
    c.studentUid === me ? c.teacherUid : c.studentUid;

  async function send() {
    if (!current || !draft.trim() || sending) return;
    setSending(true);
    const text = draft.trim();
    setDraft("");
    try {
      await sendMessage(current.id, { uid: me, name: myName }, text);
      void fetch("/api/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          recipientUid: otherUid(current),
          name: myName,
          detail: current.listingTitle,
        }),
      }).catch(() => {});
    } catch (e) {
      console.error("Failed to send message", e);
    }
    setSending(false);
  }

  return (
    <div className="mx-auto grid min-h-[60vh] max-w-5xl gap-0 overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-soft md:grid-cols-[300px_1fr]">
      {/* conversation list */}
      <aside
        className={cn(
          "border-stone-soft md:border-r",
          selected ? "hidden md:block" : "block",
        )}
      >
        <div className="border-b border-stone-soft px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-bark">
            Messages
          </h2>
        </div>
        {convos === null ? (
          <div className="p-6">
            <Loader2 className="h-5 w-5 animate-spin text-moss" />
          </div>
        ) : convos.length === 0 ? (
          <p className="p-6 text-sm text-bark-soft">
            No messages yet. When you message a teacher (or a student messages
            you), the conversation shows up here.
          </p>
        ) : (
          <ul className="max-h-[60vh] divide-y divide-stone-soft/70 overflow-y-auto">
            {convos.map((c) => {
              const unread = isUnread(c, me);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-cream/60",
                      selected === c.id && "bg-fern/10",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-bark">
                        {otherName(c)}
                      </span>
                      {unread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-clay" />
                      )}
                    </span>
                    <span className="truncate text-xs text-bark-soft">
                      {c.listingTitle}
                    </span>
                    {c.lastMessage && (
                      <span
                        className={cn(
                          "truncate text-xs",
                          unread ? "font-medium text-bark" : "text-bark-soft",
                        )}
                      >
                        {c.lastSenderUid === me ? "You: " : ""}
                        {c.lastMessage}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* thread */}
      <section
        className={cn(
          "flex flex-col",
          selected ? "flex" : "hidden md:flex",
        )}
      >
        {!current ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-bark-soft">
            Pick a conversation to read and reply.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-stone-soft px-4 py-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-bark-soft hover:text-moss md:hidden"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate font-display font-semibold text-bark">
                  {otherName(current)}
                </p>
                <p className="truncate text-xs text-bark-soft">
                  {current.listingTitle}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto bg-cream/30 px-4 py-4">
              {messages.map((m) => {
                const mine = m.senderUid === me;
                return (
                  <div
                    key={m.id}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        mine
                          ? "bg-moss text-paper"
                          : "border border-stone-soft bg-paper text-bark",
                      )}
                    >
                      <span className="whitespace-pre-wrap">{m.text}</span>
                      <span
                        className={cn(
                          "mt-1 block text-[10px]",
                          mine ? "text-paper/70" : "text-stone",
                        )}
                      >
                        {time(m)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-end gap-2 border-t border-stone-soft p-3"
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={1}
                placeholder="Write a message…"
                className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none focus:border-moss focus:ring-2 focus:ring-fern/30"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-full bg-moss px-4 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      {children}
    </div>
  );
}
