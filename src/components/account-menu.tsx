"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LogOut,
  LayoutGrid,
  LayoutDashboard,
  LogIn,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { watchConversations, isUnread } from "@/lib/db";
import { cn } from "@/lib/utils";

function initials(name: string, email: string) {
  const src = name.trim() || email.trim();
  if (!src) return "?";
  const parts = src.split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export function AccountMenu({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const { enabled, loading, user, profile, openAuth, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    if (!user) {
      setUnread(false);
      return;
    }
    return watchConversations(user.uid, (cs) =>
      setUnread(cs.some((c) => isUnread(c, user.uid))),
    );
  }, [user]);

  if (!enabled || loading) return null;

  // ---- Signed out ----
  if (!user) {
    if (variant === "mobile") {
      return (
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            openAuth();
          }}
          className="flex items-center justify-center gap-2 rounded-full border border-moss/30 px-4 py-2.5 text-sm font-semibold text-moss-deep"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => openAuth()}
        className="rounded-full px-4 py-2 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/15"
      >
        Sign in
      </button>
    );
  }

  const label = initials(
    profile?.displayName ?? user.displayName ?? "",
    profile?.email ?? user.email ?? "",
  );
  const name = profile?.displayName || user.displayName || "Your account";
  const email = profile?.email || user.email || "";

  // ---- Signed in, mobile (inline) ----
  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-full border border-moss/30 px-4 py-2.5 text-sm font-semibold text-moss-deep"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/messages"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-full border border-moss/30 px-4 py-2.5 text-sm font-semibold text-moss-deep"
        >
          <MessageSquare className="h-4 w-4" />
          Messages
          {unread && <span className="h-2 w-2 rounded-full bg-clay" />}
        </Link>
        <Link
          href="/account"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-full border border-moss/30 px-4 py-2.5 text-sm font-semibold text-moss-deep"
        >
          <LayoutGrid className="h-4 w-4" />
          My account
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void signOutUser();
          }}
          className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-bark-soft"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  // ---- Signed in, desktop (avatar + dropdown) ----
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-moss text-sm font-semibold text-paper transition-transform hover:scale-105",
          open && "ring-2 ring-fern ring-offset-2 ring-offset-cream",
        )}
      >
        {label}
      </button>
      {unread && !open && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-clay ring-2 ring-cream" />
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-lift">
            <div className="border-b border-stone-soft px-4 py-3">
              <p className="truncate font-display text-sm font-semibold text-bark">
                {name}
              </p>
              {email && (
                <p className="truncate text-xs text-bark-soft">{email}</p>
              )}
              {profile && profile.roles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-fern/12 px-2 py-0.5 text-[11px] font-medium capitalize text-moss"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bark transition-colors hover:bg-fern/10"
            >
              <LayoutDashboard className="h-4 w-4 text-fern" />
              Dashboard
            </Link>
            <Link
              href="/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bark transition-colors hover:bg-fern/10"
            >
              <MessageSquare className="h-4 w-4 text-fern" />
              Messages
              {unread && (
                <span className="ml-auto h-2 w-2 rounded-full bg-clay" />
              )}
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bark transition-colors hover:bg-fern/10"
            >
              <LayoutGrid className="h-4 w-4 text-fern" />
              My account
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOutUser();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-bark transition-colors hover:bg-fern/10"
            >
              <LogOut className="h-4 w-4 text-fern" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
