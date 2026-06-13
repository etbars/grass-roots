import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  Clock,
  CalendarDays,
  Users,
  GraduationCap,
  Leaf,
  Check,
  ArrowLeft,
  Star,
} from "lucide-react";
import {
  courses,
  getCourseBySlug,
  enrichCourse,
  formatPrice,
  formatDate,
} from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";
import { ApplyButton } from "@/components/apply-button";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course not found · Grass Roots" };
  return { title: `${course.title} · Grass Roots`, description: course.summary };
}

const FORMAT_LABEL: Record<string, string> = {
  day: "Day course",
  weekend: "Weekend workshop",
  "multi-week": "Multi-day intensive",
  residency: "Residency",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getCourseBySlug(slug);
  if (!base) notFound();
  const course = enrichCourse(base);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-bark-soft hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      {/* hero */}
      <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-3xl">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-sm font-semibold text-moss-deep backdrop-blur">
            <CategoryIcon id={course.categoryId} className="h-4 w-4" />
            {course.category.name}
          </span>
          <span className="rounded-full bg-clay/95 px-3 py-1.5 text-sm font-semibold text-paper">
            {FORMAT_LABEL[course.format]}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* main */}
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-bark">
            {course.title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-bark-soft">
            <MapPin className="h-4 w-4 text-fern" />
            {course.host.name} · {course.host.location.place},{" "}
            {course.host.location.country}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-bark-soft">
            {course.summary}
          </p>

          {/* highlights */}
          <div className="mt-6 flex flex-wrap gap-2">
            {course.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-fern/10 px-3 py-1.5 text-sm text-moss-deep"
              >
                {h}
              </span>
            ))}
          </div>

          <TwoColLists
            left={{
              title: "What you'll learn",
              icon: <GraduationCap className="h-5 w-5" />,
              items: course.studentOutcomes,
              tone: "moss",
            }}
            right={{
              title: "What the land gains",
              icon: <Leaf className="h-5 w-5" />,
              items: course.landImpact,
              tone: "clay",
            }}
          />

          {/* host */}
          <section className="mt-10 border-t border-stone-soft pt-8">
            <h2 className="font-display text-2xl font-semibold text-bark">
              The host site
            </h2>
            <Link
              href={`/hosts/${course.host.slug}`}
              className="group mt-4 flex gap-4 rounded-2xl border border-stone-soft bg-paper p-4 transition-colors hover:border-fern"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={course.host.image}
                  alt={course.host.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-bark group-hover:text-moss">
                  {course.host.name}
                </p>
                <p className="text-sm text-bark-soft">{course.host.tagline}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-bark-soft">
                  {course.host.story}
                </p>
              </div>
            </Link>
          </section>

          {/* teacher */}
          <section className="mt-8">
            <h2 className="font-display text-2xl font-semibold text-bark">
              Your teacher
            </h2>
            <Link
              href={`/teachers/${course.teacher.slug}`}
              className="group mt-4 flex gap-4 rounded-2xl border border-stone-soft bg-paper p-4 transition-colors hover:border-fern"
            >
              <Image
                src={course.teacher.image}
                alt={course.teacher.name}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <div>
                <p className="font-display text-lg font-semibold text-bark group-hover:text-moss">
                  {course.teacher.name}
                </p>
                <p className="text-sm text-bark-soft">
                  {course.teacher.headline}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-bark-soft">
                  <Star className="h-3.5 w-3.5 fill-ochre text-ochre" />
                  {course.teacher.rating} · {course.teacher.reviews} reviews ·{" "}
                  {course.teacher.yearsTeaching} yrs teaching
                </p>
              </div>
            </Link>
          </section>
        </div>

        {/* sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
            <div className="flex items-end justify-between">
              <p className="font-display text-3xl font-semibold text-bark">
                {formatPrice(course.price)}
              </p>
              {course.spotsLeft <= 3 && (
                <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
                  {course.spotsLeft} spots left
                </span>
              )}
            </div>

            <ul className="mt-5 space-y-3 text-sm text-bark">
              <Meta icon={<CalendarDays className="h-4 w-4 text-fern" />}>
                Starts {formatDate(course.startDate)}
              </Meta>
              <Meta icon={<Clock className="h-4 w-4 text-fern" />}>
                {course.durationLabel}
              </Meta>
              <Meta icon={<GraduationCap className="h-4 w-4 text-fern" />}>
                {course.level}
              </Meta>
              <Meta icon={<Users className="h-4 w-4 text-fern" />}>
                {course.spotsLeft} of {course.capacity} places open
              </Meta>
            </ul>

            <div className="mt-6">
              <ApplyButton courseTitle={course.title} />
            </div>
            <p className="mt-3 text-center text-xs text-bark-soft">
              No payment today. The teacher confirms your place first.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5">
      {icon}
      {children}
    </li>
  );
}

interface ListSpec {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "moss" | "clay";
}

function TwoColLists({ left, right }: { left: ListSpec; right: ListSpec }) {
  return (
    <div className="mt-8 grid gap-8 sm:grid-cols-2">
      {[left, right].map((spec) => (
        <div key={spec.title}>
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-bark">
            <span className={spec.tone === "moss" ? "text-fern" : "text-clay"}>
              {spec.icon}
            </span>
            {spec.title}
          </h3>
          <ul className="mt-3 space-y-2">
            {spec.items.map((item) => (
              <li key={item} className="flex gap-2 text-bark-soft">
                <Check
                  className={`mt-1 h-4 w-4 shrink-0 ${
                    spec.tone === "moss" ? "text-fern" : "text-clay"
                  }`}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
