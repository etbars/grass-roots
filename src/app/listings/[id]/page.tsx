import type { Metadata } from "next";
import { ListingDetail } from "@/components/listing-detail";

async function fetchListing(id: string) {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!key || !project) return null;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/listings/${id}?key=${key}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields ?? {};
    return {
      title: f.title?.stringValue as string | undefined,
      hook: f.hook?.stringValue as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const l = await fetchListing(id);
  if (!l?.title) return { title: "Residency · Grass Roots" };
  return {
    title: `${l.title} · Grass Roots`,
    description: l.hook,
    openGraph: { title: l.title, description: l.hook },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
