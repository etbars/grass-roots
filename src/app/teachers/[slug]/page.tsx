import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import {
  teachers,
  getTeacherBySlug,
  getCoursesByTeacher,
  getCategory,
} from "@/lib/data";
import { CourseCard } from "@/components/course-card";
import { CategoryIcon } from "@/components/category-icon";

export function generateStaticParams() {
  return teachers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);
  if (!teacher) return { title: "Teacher not found · Grass Roots" };
  return { title: `${teacher.name} · Grass Roots`, description: teacher.headline };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);
  if (!teacher) notFound();
  const courses = getCoursesByTeacher(teacher.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-bark-soft hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={teacher.image}
          alt={teacher.name}
          width={140}
          height={140}
          className="h-32 w-32 rounded-2xl object-cover shadow-soft sm:h-36 sm:w-36"
          priority
        />
        <div>
          <h1 className="font-display text-4xl font-semibold text-bark">
            {teacher.name}
          </h1>
          <p className="mt-1 text-lg text-bark-soft">{teacher.headline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-soft">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-ochre text-ochre" />
              {teacher.rating} ({teacher.reviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-fern" />
              {teacher.basedIn}
            </span>
            <span>{teacher.yearsTeaching} years teaching</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {teacher.skills.map((id) => {
              const cat = getCategory(id);
              if (!cat) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-fern/10 px-3 py-1 text-sm text-moss-deep"
                >
                  <CategoryIcon id={id} className="h-3.5 w-3.5" />
                  {cat.name}
                </span>
              );
            })}
          </div>
        </div>
      </header>

      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-bark-soft">
        {teacher.bio}
      </p>

      {courses.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-bark">
            Courses with {teacher.name.split(" ")[0]}
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
