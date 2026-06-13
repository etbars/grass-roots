import { cn } from "@/lib/utils";

/** A small sprout/seedling mark for Grass Roots. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      {/* stem */}
      <path
        d="M16 29V14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* left leaf */}
      <path
        d="M16 18C16 18 13.5 18.2 11 16.5C8.5 14.8 8 11 8 11C8 11 12 11.2 14.2 13C16 14.5 16 18 16 18Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* right leaf */}
      <path
        d="M16 16C16 16 18.5 16.2 21 14.5C23.5 12.8 24 9 24 9C24 9 20 9.2 17.8 11C16 12.5 16 16 16 16Z"
        fill="currentColor"
      />
      {/* soil line */}
      <path
        d="M9 29H23"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
