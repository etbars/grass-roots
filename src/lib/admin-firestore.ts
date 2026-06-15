// Server-only: read private Firestore docs (e.g. a teacher's email) using a
// service account, without the firebase-admin dependency. Mints a short-lived
// Google OAuth token from the service-account key (FIREBASE_SERVICE_ACCOUNT_KEY,
// raw JSON or base64), caches it, and calls the Firestore REST API.

import crypto from "crypto";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "grass-roots-app";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

let cached: { token: string; exp: number } | null = null;

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const json = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const sa = JSON.parse(json) as ServiceAccount;
    return sa.client_email && sa.private_key ? sa : null;
  } catch {
    return null;
  }
}

async function getToken(): Promise<string | null> {
  const sa = serviceAccount();
  if (!sa) return null;
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;

  const b64 = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned =
    b64({ alg: "RS256", typ: "JWT" }) +
    "." +
    b64({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    });

  let jwt: string;
  try {
    const sig = crypto
      .createSign("RSA-SHA256")
      .update(unsigned)
      .sign(sa.private_key, "base64url");
    jwt = `${unsigned}.${sig}`;
  } catch {
    return null;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" +
        encodeURIComponent(jwt),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!data.access_token) return null;
    cached = { token: data.access_token, exp: now + (data.expires_in ?? 3600) };
    return cached.token;
  } catch {
    return null;
  }
}

type Fields = Record<string, { stringValue?: string }> | null;

async function getDoc(token: string, path: string): Promise<Fields> {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { fields?: Fields };
    return data.fields ?? null;
  } catch {
    return null;
  }
}

const str = (f: Fields, key: string) => f?.[key]?.stringValue ?? "";

/**
 * Resolve a published listing's owning teacher contact (email + name) and
 * title, for sending them a lead notification. Returns null if admin isn't
 * configured or the listing/teacher can't be resolved.
 */
export async function getListingTeacherContact(
  listingId: string,
): Promise<{ email: string; name: string; title: string } | null> {
  const token = await getToken();
  if (!token) return null;
  const listing = await getDoc(token, `listings/${listingId}`);
  const uid = str(listing, "uid");
  if (!uid) return null;
  const user = await getDoc(token, `users/${uid}`);
  const email = str(user, "email");
  if (!email) return null;
  return {
    email,
    name: str(listing, "teacherName"),
    title: str(listing, "title"),
  };
}

/** Resolve a user's email + name (e.g. a message recipient) via admin. */
export async function getUserContact(
  uid: string,
): Promise<{ email: string; name: string } | null> {
  const token = await getToken();
  if (!token) return null;
  const user = await getDoc(token, `users/${uid}`);
  const email = str(user, "email");
  if (!email) return null;
  return { email, name: str(user, "displayName") };
}
