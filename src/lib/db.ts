"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DesignedResidency } from "@/lib/residency-schema";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured.");
  return db;
}

export interface HostApplication {
  siteName: string;
  landType: string;
  location: string;
  needs: string;
  email: string;
}

export async function submitHostApplication(
  data: HostApplication,
  uid: string | null,
) {
  await addDoc(collection(requireDb(), "hostApplications"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

export interface SavedResidency {
  id: string;
  uid: string;
  hostId: string;
  hostName: string;
  residency: DesignedResidency;
}

export async function saveResidency(
  uid: string,
  hostId: string,
  hostName: string,
  residency: DesignedResidency,
) {
  await addDoc(collection(requireDb(), "residencies"), {
    uid,
    hostId,
    hostName,
    residency,
    createdAt: serverTimestamp(),
  });
}

export async function getMyResidencies(uid: string): Promise<SavedResidency[]> {
  const snap = await getDocs(
    query(collection(requireDb(), "residencies"), where("uid", "==", uid)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SavedResidency, "id">),
  }));
}

export interface Enrollment {
  id: string;
  uid: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
}

/** Deterministic id keeps reservations idempotent (one per course per user). */
const enrollmentId = (uid: string, courseId: string) => `${uid}_${courseId}`;

export async function reserveCourse(
  uid: string,
  course: { id: string; title: string; slug: string },
) {
  await setDoc(
    doc(requireDb(), "enrollments", enrollmentId(uid, course.id)),
    {
      uid,
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      createdAt: serverTimestamp(),
    },
  );
}

export async function isReserved(uid: string, courseId: string) {
  const snap = await getDoc(
    doc(requireDb(), "enrollments", enrollmentId(uid, courseId)),
  );
  return snap.exists();
}

export async function getMyEnrollments(uid: string): Promise<Enrollment[]> {
  const snap = await getDocs(
    query(collection(requireDb(), "enrollments"), where("uid", "==", uid)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Enrollment, "id">),
  }));
}
