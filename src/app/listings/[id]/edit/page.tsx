import type { Metadata } from "next";
import { ListingEditor } from "@/components/listing-editor";

export const metadata: Metadata = {
  title: "Edit listing · Grass Roots",
  robots: { index: false },
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListingEditor id={id} />;
}
