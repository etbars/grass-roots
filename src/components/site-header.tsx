"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/hosts", label: "Host sites" },
  { href: "/map", label: "Map" },
  { href: "/become-a-teacher", label: "Become a teacher" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-soft/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/grass-roots-logo.svg"
            alt="Grass Roots"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bark-soft transition-colors hover:text-moss"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/teach"
            className="rounded-full px-4 py-2 text-sm font-semibold text-moss-deep transition-colors hover:bg-fern/15"
          >
            Teach a course
          </Link>
          <Link
            href="/host"
            className="rounded-full bg-moss px-4.5 py-2 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
          >
            Host a residency
          </Link>
          <AccountMenu />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-bark md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-stone-soft/70 bg-cream md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-bark-soft hover:bg-fern/10 hover:text-moss"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-stone-soft/70 pt-3">
            <Link
              href="/teach"
              className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-moss-deep ring-1 ring-moss/30"
              onClick={() => setOpen(false)}
            >
              Teach a course
            </Link>
            <Link
              href="/host"
              className="rounded-full bg-moss px-4 py-2.5 text-center text-sm font-semibold text-paper"
              onClick={() => setOpen(false)}
            >
              Host a residency
            </Link>
            <AccountMenu variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </div>
    </header>
  );
}
