import Link from "next/link";
import type { Metadata } from "next";
import { getAllCourses, categories } from "@/lib/data";
import type { CategoryId } from "@/lib/types";
import { CourseCard } from "@/components/course-card";
import { CategoryIcon } from "@/components/category-icon";
import { PublishedListings } from "@/components/published-listings";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Courses & residencies · Grass Roots",
  description:
    "Browse immersive, hands-on courses and teacher residencies at regenerative farms, homesteads and eco-building projects.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = getAllCourses();
  const activeCategory = categories.find((c) => c.id === category)?.id;
  const courses = activeCategory
    ? all.filter((c) => c.categoryId === activeCategory)
    : all;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-bark sm:text-5xl">
          Courses & residencies
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-bark-soft">
          Learn by doing alongside skilled teachers, on living land that needs
          exactly what you&apos;ll be learning.
        </p>
      </header>

      {/* filter bar */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip href="/courses" active={!activeCategory} label="All" />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            href={`/courses?category=${c.id}`}
            active={activeCategory === c.id}
            label={c.name}
            categoryId={c.id}
          />
        ))}
      </div>

      <PublishedListings category={activeCategory ?? null} />

      <p className="mt-8 text-sm text-bark-soft">
        {courses.length} {courses.length === 1 ? "experience" : "experiences"}
        {activeCategory ? ` in ${categories.find((c) => c.id === activeCategory)?.name}` : ""}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
  categoryId,
}: {
  href: string;
  active: boolean;
  label: string;
  categoryId?: CategoryId;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-moss bg-moss text-paper"
          : "border-stone-soft bg-paper text-bark-soft hover:border-fern hover:text-moss",
      )}
    >
      {categoryId && <CategoryIcon id={categoryId} className="h-4 w-4" />}
      {label}
    </Link>
  );
}
