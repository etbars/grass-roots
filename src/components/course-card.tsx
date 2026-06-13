import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import type { CourseWithRelations } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/data";
import { CategoryIcon } from "@/components/category-icon";

const FORMAT_LABEL: Record<string, string> = {
  day: "Day course",
  weekend: "Weekend",
  "multi-week": "Intensive",
  residency: "Residency",
};

export function CourseCard({ course }: { course: CourseWithRelations }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-soft bg-paper shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-moss-deep backdrop-blur">
          <CategoryIcon id={course.categoryId} className="h-3.5 w-3.5" />
          {course.category.name}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-clay/95 px-2.5 py-1 text-xs font-semibold text-paper">
          {FORMAT_LABEL[course.format]}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-bark transition-colors group-hover:text-moss">
          {course.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-bark-soft">
          <MapPin className="h-3.5 w-3.5 text-fern" />
          {course.host.location.place}, {course.host.location.country}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Image
            src={course.teacher.image}
            alt={course.teacher.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm text-bark-soft">
            with{" "}
            <span className="font-medium text-bark">{course.teacher.name}</span>
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-stone-soft/70 pt-4">
          <div className="text-sm text-bark-soft">
            <p className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-fern" />
              {formatDate(course.startDate)}
            </p>
            <p className="mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-fern" />
              {course.durationLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-semibold text-bark">
              {formatPrice(course.price)}
            </p>
            {course.spotsLeft <= 3 && (
              <p className="text-xs font-medium text-clay">
                {course.spotsLeft} spots left
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
