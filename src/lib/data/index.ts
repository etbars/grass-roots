import type {
  Category,
  CategoryId,
  Course,
  Host,
  Teacher,
} from "@/lib/types";
import { categories } from "./categories";
import { teachers } from "./teachers";
import { hosts } from "./hosts";
import { courses } from "./courses";

export { categories, teachers, hosts, courses };

/** A course joined with its teacher, host, and category. */
export interface CourseWithRelations extends Course {
  teacher: Teacher;
  host: Host;
  category: Category;
}

export const getCategory = (id: CategoryId) =>
  categories.find((c) => c.id === id);
export const getTeacher = (id: string) => teachers.find((t) => t.id === id);
export const getTeacherBySlug = (slug: string) =>
  teachers.find((t) => t.slug === slug);
export const getHost = (id: string) => hosts.find((h) => h.id === id);
export const getHostBySlug = (slug: string) =>
  hosts.find((h) => h.slug === slug);
export const getCourseBySlug = (slug: string) =>
  courses.find((c) => c.slug === slug);

/** Join a course with its related entities. Returns null if any relation is missing. */
export function enrichCourse(course: Course): CourseWithRelations | null {
  const teacher = getTeacher(course.teacherId);
  const host = getHost(course.hostId);
  const category = getCategory(course.categoryId);
  if (!teacher || !host || !category) return null;
  return { ...course, teacher, host, category };
}

export function getAllCourses(): CourseWithRelations[] {
  return courses
    .map(enrichCourse)
    .filter((c): c is CourseWithRelations => c !== null);
}

export const getCoursesByCategory = (id: CategoryId) =>
  getAllCourses().filter((c) => c.categoryId === id);
export const getCoursesByHost = (hostId: string) =>
  getAllCourses().filter((c) => c.hostId === hostId);
export const getCoursesByTeacher = (teacherId: string) =>
  getAllCourses().filter((c) => c.teacherId === teacherId);

export function formatPrice(price: number, currency: "EUR" = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatLocation(loc: { place: string; region?: string; country: string }) {
  return [loc.place, loc.country].join(", ");
}
