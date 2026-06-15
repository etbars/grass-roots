"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  ImagePlus,
  Trash2,
  Check,
  LogIn,
} from "lucide-react";
import { categories } from "@/lib/data";
import { useAuth } from "@/components/auth-provider";
import {
  getListing,
  updateListing,
  deleteListing,
  uploadListingPhoto,
  type PublishedListing,
} from "@/lib/db";
import type { CategoryId } from "@/lib/types";

const SKILL_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

export function ListingEditor({ id }: { id: string }) {
  const router = useRouter();
  const { enabled, loading, user, openAuth } = useAuth();
  const [listing, setListing] = useState<PublishedListing | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  // editable fields
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [hook, setHook] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id);
  const [price, setPrice] = useState(0);
  const [skillLevel, setSkillLevel] = useState(SKILL_LEVELS[0]);
  const [groupSize, setGroupSize] = useState(8);
  const [durationDays, setDurationDays] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [outcomes, setOutcomes] = useState("");
  const [materials, setMaterials] = useState("");
  const [bring, setBring] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getListing(id).then((l) => {
      if (!l) {
        setState("missing");
        return;
      }
      setListing(l);
      setImage(l.image);
      setTitle(l.title);
      setHook(l.hook);
      setCategoryId(l.categoryId);
      setPrice(l.price);
      setSkillLevel(l.skillLevel);
      setGroupSize(l.groupSize);
      setDurationDays(l.durationDays);
      setStartDate(l.startDate ?? "");
      setDescription(l.listingDescription);
      setOutcomes((l.studentOutcomes ?? []).join("\n"));
      setMaterials((l.materials ?? []).join("\n"));
      setBring((l.whatToBring ?? []).join("\n"));
      setState("ready");
    });
  }, [id]);

  if (!enabled) return <Center>Accounts aren&apos;t configured here.</Center>;
  if (loading || state === "loading")
    return (
      <Center>
        <Loader2 className="h-6 w-6 animate-spin text-moss" />
      </Center>
    );
  if (state === "missing") return <Center>This listing doesn&apos;t exist.</Center>;
  if (!user)
    return (
      <Center>
        <p className="text-bark-soft">Sign in to edit your listing.</p>
        <button
          type="button"
          onClick={() => openAuth()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
        >
          <LogIn className="h-4 w-4" /> Sign in
        </button>
      </Center>
    );
  if (listing && listing.uid !== user.uid)
    return (
      <Center>
        <p className="text-bark-soft">You can only edit your own listings.</p>
        <Link
          href={`/listings/${id}`}
          className="mt-4 text-sm font-semibold text-moss hover:text-moss-deep"
        >
          Back to the listing
        </Link>
      </Center>
    );

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadListingPhoto(user.uid, file);
      setImage(url);
    } catch (err) {
      console.error(err);
      setError("Photo upload failed. Try a smaller image.");
    }
    setUploading(false);
  }

  const lines = (s: string) =>
    s
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await updateListing(id, {
        image,
        title,
        hook,
        categoryId,
        price: Number(price) || 0,
        skillLevel,
        groupSize: Number(groupSize) || 1,
        durationDays: Number(durationDays) || 1,
        durationLabel: `${durationDays} ${Number(durationDays) === 1 ? "day" : "days"}`,
        startDate: startDate || null,
        listingDescription: description,
        studentOutcomes: lines(outcomes),
        materials: lines(materials),
        whatToBring: lines(bring),
      });
      router.push(`/listings/${id}`);
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Please try again.");
      setSaving(false);
    }
  }

  async function remove() {
    if (deleting) return;
    if (
      !window.confirm("Unpublish and delete this listing? This can't be undone.")
    )
      return;
    setDeleting(true);
    try {
      await deleteListing(id);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Couldn't delete. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link
        href={`/listings/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-bark-soft hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listing
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-bark">
        Edit your listing
      </h1>

      {/* Photo */}
      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-bark">Photo</span>
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-stone-soft bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Listing"
            className="h-full w-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bark/40">
              <Loader2 className="h-6 w-6 animate-spin text-paper" />
            </div>
          )}
          <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-xs font-semibold text-bark shadow-lift hover:bg-cream">
            <ImagePlus className="h-4 w-4 text-moss" />
            {uploading ? "Uploading…" : "Change photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        <p className="mt-1.5 text-xs text-stone">
          Upload your own photo (JPG or PNG, up to 5MB).
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Hook" hint="One line that draws students in">
          <textarea
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            rows={2}
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Craft">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price per student (EUR)">
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Skill level">
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className={inputCls}
            >
              {SKILL_LEVELS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Group size">
            <input
              type="number"
              min={1}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Duration (days)">
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Start date" hint="Empty = gather interest">
            <div className="flex items-center gap-2">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
              />
              {startDate && (
                <button
                  type="button"
                  onClick={() => setStartDate("")}
                  className="shrink-0 text-xs font-semibold text-bark-soft hover:text-clay"
                >
                  Clear
                </button>
              )}
            </div>
          </Field>
        </div>

        <Field label="Description" hint="Two short paragraphs work well">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Outcomes" hint="One per line">
            <textarea
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </Field>
          <Field label="Materials" hint="One per line">
            <textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </Field>
          <Field label="What to bring" hint="One per line">
            <textarea
              value={bring}
              onChange={(e) => setBring(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-clay-deep">{error}</p>}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-soft pt-6">
        <button
          type="button"
          onClick={() => void remove()}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-full border border-clay/40 px-5 py-2.5 text-sm font-semibold text-clay-deep transition-colors hover:bg-clay/10 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "Deleting…" : "Unpublish"}
        </button>
        <div className="flex items-center gap-3">
          <Link
            href={`/listings/${id}`}
            className="text-sm font-semibold text-bark-soft hover:text-bark"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-bark">
        {label}
        {hint && <span className="text-xs font-normal text-stone">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      {children}
    </div>
  );
}
