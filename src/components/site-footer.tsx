import Link from "next/link";
import { Logo } from "@/components/logo";

const footerNav = [
  {
    heading: "Learn",
    links: [
      { href: "/courses", label: "Browse courses" },
      { href: "/courses?type=residency", label: "Teacher residencies" },
      { href: "/hosts", label: "Host sites" },
    ],
  },
  {
    heading: "Contribute",
    links: [
      { href: "/become-a-teacher", label: "Become a teacher" },
      { href: "/teach", label: "Teach a course" },
      { href: "/teach", label: "Host a residency" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-stone-soft/70 bg-moss-deep text-paper/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-wheat" />
            <span className="font-display text-xl font-semibold text-paper">
              Grass Roots
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            Real-world education rooted in land, craft, and community. Learn by
            doing, teach by living, and grow regenerative projects around the
            world.
          </p>
        </div>

        {footerNav.map((col) => (
          <div key={col.heading}>
            <h3 className="font-display text-base font-semibold text-wheat">
              {col.heading}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/75 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-3xl px-5 py-3 text-center text-xs leading-relaxed text-paper/45 sm:px-8">
          Demonstration project. Teachers, courses, and host sites shown are
          illustrative and fictional; photographs are from Unsplash and the
          people pictured are not affiliated with Grass Roots. Host sites are
          adapted from GoHabitat listings.
        </p>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-paper/55 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Grass Roots. Grown from the ground up.</p>
          <p className="font-display italic">
            Learn by doing. Teach by living. Grow from the ground up.
          </p>
        </div>
      </div>
    </footer>
  );
}
