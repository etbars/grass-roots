"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, ImagePlus, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { getProfile, saveProfile, uploadAvatar } from "@/lib/db";

const inputCls =
  "w-full rounded-xl border border-stone-soft bg-cream/40 px-3.5 py-2.5 text-sm text-bark outline-none transition-colors focus:border-fern focus:bg-paper";

export function ProfileEditor() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const fallbackName = profile?.displayName || user.displayName || "";
    const fallbackPhoto = profile?.photoURL || user.photoURL || "";
    void getProfile(user.uid)
      .then((p) => {
        setDisplayName(p?.displayName || fallbackName);
        setHeadline(p?.headline || "");
        setBio(p?.bio || "");
        setPhotoURL(p?.photoURL || fallbackPhoto);
      })
      .catch(() => {
        setDisplayName(fallbackName);
        setPhotoURL(fallbackPhoto);
      })
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError("");
    try {
      setPhotoURL(await uploadAvatar(user.uid, file));
    } catch {
      setError("Photo upload failed. Try a smaller image.");
    }
    setUploading(false);
  }

  async function save() {
    if (!user || saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await saveProfile(user.uid, {
        displayName: displayName.trim() || "Grass Roots member",
        headline: headline.trim(),
        bio: bio.trim(),
        photoURL: photoURL || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Couldn't save. Please try again.");
    }
    setSaving(false);
  }

  return (
    <section className="rounded-2xl border border-stone-soft bg-paper p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-bark">
        Your profile
      </h2>
      <p className="mt-1 text-sm text-bark-soft">
        A photo and a few words so students and hosts know who you are. This is
        public.
      </p>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-stone-soft bg-cream">
            {photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoURL}
                alt="Your profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone">
                <User className="h-9 w-9" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bark/40">
                <Loader2 className="h-5 w-5 animate-spin text-paper" />
              </div>
            )}
          </div>
          <label className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-stone-soft px-3 py-1.5 text-xs font-semibold text-bark-soft transition-colors hover:border-fern hover:text-moss">
            <ImagePlus className="h-3.5 w-3.5" />
            {photoURL ? "Change" : "Add photo"}
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <Field label="Name">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </Field>
          <Field label="Headline" hint="e.g. Cob builder & natural plasterer">
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="What you do, in one line"
              className={inputCls}
            />
          </Field>
          <Field label="Bio">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="A few sentences about you, your craft, and your experience."
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-clay-deep">{error}</p>}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || uploading || !loaded}
          className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-moss-deep disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : null}
          {saved ? "Saved" : "Save profile"}
        </button>
      </div>
    </section>
  );
}

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
      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-bark">
        {label}
        {hint && <span className="text-xs font-normal text-stone">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
