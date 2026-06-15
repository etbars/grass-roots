import type { Metadata } from "next";
import { MessagesInbox } from "@/components/messages-inbox";

export const metadata: Metadata = {
  title: "Messages · Grass Roots",
};

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <MessagesInbox />
    </div>
  );
}
