"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { DesignedResidency } from "@/lib/residency-schema";
import type { CategoryId } from "@/lib/types";

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

/** A "request to join" from a visitor (signed-in users reserve directly instead). */
export async function submitCourseRequest(data: {
  name: string;
  email: string;
  courseId: string;
  courseTitle: string;
  uid: string | null;
}) {
  await addDoc(collection(requireDb(), "courseRequests"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Founding-member intent: a pre-launch reservation of credit at a bonus tier.
 * No payment is taken; this records willingness so we can invite them to claim
 * when credit goes live. If signed in, the chosen tier is also stamped on the
 * user's own profile so /account can show their founding status.
 */
export async function reserveFoundingCredit(data: {
  email: string;
  tier: string;
  pay: number;
  credit: number;
  uid: string | null;
}) {
  await addDoc(collection(requireDb(), "foundingReservations"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  if (data.uid) {
    await setDoc(
      doc(requireDb(), "users", data.uid),
      { foundingTier: data.tier, foundingCredit: data.credit },
      { merge: true },
    );
  }
}

export async function joinWaitlist(data: {
  email: string;
  uid: string | null;
  source: string;
  /** Which sides they're interested in: "student" | "teacher" | "host". */
  roles?: string[];
  name?: string;
  /** Free text: what they'd like to offer or learn. */
  comment?: string;
}) {
  await addDoc(collection(requireDb(), "waitlist"), {
    ...data,
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
  /** Where /account should link to (a course or a published listing). */
  coursePath?: string;
}

/** Deterministic id keeps reservations idempotent (one per course per user). */
const enrollmentId = (uid: string, courseId: string) => `${uid}_${courseId}`;

export async function reserveCourse(
  uid: string,
  course: { id: string; title: string; slug: string; path?: string },
) {
  await setDoc(
    doc(requireDb(), "enrollments", enrollmentId(uid, course.id)),
    {
      uid,
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      coursePath: course.path ?? `/courses/${course.slug}`,
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

/**
 * A teacher-published residency: a live, discoverable listing. Self-contained
 * (host + teacher + category denormalised) so it renders without joins.
 */
export interface PublishedListing {
  id: string;
  uid: string;
  teacherName: string;
  hostId: string;
  hostName: string;
  hostPlace: string;
  hostCountry: string;
  image: string;
  categoryId: CategoryId;
  title: string;
  hook: string;
  durationDays: number;
  durationLabel: string;
  // ISO date (YYYY-MM-DD) for a scheduled run, or null while the teacher is
  // still gauging interest ("forming").
  startDate: string | null;
  // Seeded illustrative listings are flagged demo (not bookable). Listings
  // published by real teachers leave this unset and are real/bookable.
  demo?: boolean;
  // "online" = a live online cohort (no physical host site). Absent = in-person.
  mode?: "online" | "in-person";
  skillLevel: string;
  groupSize: number;
  price: number;
  listingDescription: string;
  schedule: DesignedResidency["schedule"];
  studentOutcomes: string[];
  materials: string[];
  whatToBring: string[];
}

export async function publishListing(
  data: Omit<PublishedListing, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "listings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPublishedListings(): Promise<PublishedListing[]> {
  const snap = await getDocs(collection(requireDb(), "listings"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PublishedListing, "id">),
  }));
}

export async function getMyListings(uid: string): Promise<PublishedListing[]> {
  const snap = await getDocs(
    query(collection(requireDb(), "listings"), where("uid", "==", uid)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PublishedListing, "id">),
  }));
}

export async function getListing(
  id: string,
): Promise<PublishedListing | null> {
  const snap = await getDoc(doc(requireDb(), "listings", id));
  return snap.exists()
    ? { id: snap.id, ...(snap.data() as Omit<PublishedListing, "id">) }
    : null;
}

export async function getListingsByHost(
  hostId: string,
): Promise<PublishedListing[]> {
  const snap = await getDocs(
    query(collection(requireDb(), "listings"), where("hostId", "==", hostId)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PublishedListing, "id">),
  }));
}

export async function updateListing(
  id: string,
  patch: Partial<Omit<PublishedListing, "id" | "uid">>,
) {
  await updateDoc(doc(requireDb(), "listings", id), patch);
}

export async function deleteListing(id: string) {
  await deleteDoc(doc(requireDb(), "listings", id));
}

/**
 * Interest registrations on a listing ("gauge demand"). A signed-in student
 * writes their own signup (doc id = their uid, so it's idempotent); the listing
 * owner can read them all to see demand. Lives at listings/{id}/signups/{uid}.
 */
export interface Interest {
  uid: string;
  name: string;
  email: string;
}

const signupRef = (listingId: string, uid: string) =>
  doc(requireDb(), "listings", listingId, "signups", uid);

export async function registerInterest(
  listingId: string,
  signer: Interest,
) {
  await setDoc(signupRef(listingId, signer.uid), {
    ...signer,
    createdAt: serverTimestamp(),
  });
}

export async function hasRegisteredInterest(listingId: string, uid: string) {
  const snap = await getDoc(signupRef(listingId, uid));
  return snap.exists();
}

/** Count of students who registered interest. Readable by the listing owner. */
export async function getInterestCount(listingId: string): Promise<number> {
  const snap = await getDocs(
    collection(requireDb(), "listings", listingId, "signups"),
  );
  return snap.size;
}

/** Upload a listing photo to the owner's Storage folder, return its URL. */
export async function uploadListingPhoto(
  uid: string,
  file: File,
): Promise<string> {
  if (!storage) throw new Error("Storage is not configured.");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `listings/${uid}/${Date.now()}-${safe}`;
  const snap = await uploadBytes(ref(storage, path), file, {
    contentType: file.type,
  });
  return getDownloadURL(snap.ref);
}

/** A project a host has posted for one of their sites. */
export interface HostNeed {
  id: string;
  hostId: string;
  uid: string;
  text: string;
}

export async function getHostNeeds(hostId: string): Promise<HostNeed[]> {
  const snap = await getDocs(
    query(collection(requireDb(), "hostNeeds"), where("hostId", "==", hostId)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<HostNeed, "id">),
  }));
}

export async function addHostNeed(
  uid: string,
  hostId: string,
  text: string,
): Promise<string> {
  const refDoc = await addDoc(collection(requireDb(), "hostNeeds"), {
    uid,
    hostId,
    text,
    createdAt: serverTimestamp(),
  });
  return refDoc.id;
}

export async function deleteHostNeed(id: string) {
  await deleteDoc(doc(requireDb(), "hostNeeds", id));
}

// ---- Two-way messaging: conversations between a student and a teacher ----

export interface Conversation {
  id: string;
  participants: string[];
  studentUid: string;
  teacherUid: string;
  studentName: string;
  teacherName: string;
  listingId: string;
  listingTitle: string;
  lastMessage?: string;
  lastMessageAt?: Timestamp | null;
  lastSenderUid?: string;
  reads?: Record<string, Timestamp>;
}

export interface Message {
  id: string;
  senderUid: string;
  senderName: string;
  text: string;
  createdAt?: Timestamp | null;
}

/** One conversation per student per listing, so re-messaging reuses the thread. */
export const conversationId = (listingId: string, studentUid: string) =>
  `${listingId}__${studentUid}`;

export async function startConversation(c: {
  listingId: string;
  listingTitle: string;
  studentUid: string;
  studentName: string;
  teacherUid: string;
  teacherName: string;
}): Promise<string> {
  const id = conversationId(c.listingId, c.studentUid);
  await setDoc(
    doc(requireDb(), "conversations", id),
    {
      participants: [c.studentUid, c.teacherUid],
      studentUid: c.studentUid,
      studentName: c.studentName,
      teacherUid: c.teacherUid,
      teacherName: c.teacherName,
      listingId: c.listingId,
      listingTitle: c.listingTitle,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
  return id;
}

export async function sendMessage(
  convId: string,
  sender: { uid: string; name: string },
  text: string,
) {
  const body = text.trim().slice(0, 4000);
  if (!body) return;
  await addDoc(collection(requireDb(), "conversations", convId, "messages"), {
    senderUid: sender.uid,
    senderName: sender.name,
    text: body,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(requireDb(), "conversations", convId), {
    lastMessage: body.slice(0, 200),
    lastMessageAt: serverTimestamp(),
    lastSenderUid: sender.uid,
  });
}

/** Live list of the user's conversations (newest activity first). */
export function watchConversations(
  uid: string,
  cb: (convos: Conversation[]) => void,
): () => void {
  const q = query(
    collection(requireDb(), "conversations"),
    where("participants", "array-contains", uid),
  );
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as Omit<Conversation, "id">) }),
    );
    list.sort(
      (a, b) =>
        (b.lastMessageAt?.toMillis?.() ?? 0) -
        (a.lastMessageAt?.toMillis?.() ?? 0),
    );
    cb(list);
  });
}

/** Live messages in a conversation, oldest first. */
export function watchMessages(
  convId: string,
  cb: (messages: Message[]) => void,
): () => void {
  const q = query(
    collection(requireDb(), "conversations", convId, "messages"),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })));
  });
}

export async function markConversationRead(convId: string, uid: string) {
  await updateDoc(doc(requireDb(), "conversations", convId), {
    [`reads.${uid}`]: serverTimestamp(),
  });
}

/** A conversation is unread for me if the last message is theirs and newer than my last read. */
export function isUnread(c: Conversation, uid: string): boolean {
  if (!c.lastMessageAt || c.lastSenderUid === uid) return false;
  const read = c.reads?.[uid];
  return !read || (read.toMillis?.() ?? 0) < (c.lastMessageAt.toMillis?.() ?? 0);
}

// ---- Public profiles (bio + photo): readable by anyone, written by the owner ----

export interface PublicProfile {
  uid: string;
  displayName: string;
  headline?: string;
  bio?: string;
  photoURL?: string;
}

export async function getProfile(uid: string): Promise<PublicProfile | null> {
  const snap = await getDoc(doc(requireDb(), "profiles", uid));
  return snap.exists()
    ? { uid, ...(snap.data() as Omit<PublicProfile, "uid">) }
    : null;
}

export async function saveProfile(
  uid: string,
  data: { displayName: string; headline: string; bio: string; photoURL?: string },
) {
  await setDoc(
    doc(requireDb(), "profiles", uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
  // Mirror the name (and photo) to the private user doc so the rest of the app
  // shows a consistent identity.
  await setDoc(
    doc(requireDb(), "users", uid),
    {
      displayName: data.displayName,
      ...(data.photoURL ? { photoURL: data.photoURL } : {}),
    },
    { merge: true },
  );
}

export async function uploadAvatar(uid: string, file: File): Promise<string> {
  if (!storage) throw new Error("Storage is not configured.");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `avatars/${uid}/${Date.now()}-${safe}`;
  const snap = await uploadBytes(ref(storage, path), file, {
    contentType: file.type,
  });
  return getDownloadURL(snap.ref);
}
