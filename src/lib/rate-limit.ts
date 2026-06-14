// Best-effort guard for the public AI routes: a per-IP rate limit plus a
// request-body size cap. The model endpoints are unauthenticated, so without
// this anyone could script calls and run up the Anthropic bill (cost-DoS) or
// send oversized inputs.
//
// NOTE: the rate-limit state lives in memory. Netlify functions are ephemeral
// and may run several instances, so this is a friction layer, not a hard
// guarantee. For real protection pair it with a spend cap on the Anthropic
// account and Firebase App Check.

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic prune so the map can't grow without bound.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("x-nf-client-connection-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}

type GuardResult = { error: Response } | { body: unknown };

/**
 * Rate-limit by client IP and cap the request body size, then parse JSON.
 * Returns either an `error` Response to return immediately, or the parsed
 * `body`.
 */
export async function aiGuard(
  request: Request,
  opts: { name: string; limit: number; windowMs: number; maxBytes: number },
): Promise<GuardResult> {
  const rl = rateLimit(`${opts.name}:${clientIp(request)}`, opts.limit, opts.windowMs);
  if (!rl.ok) {
    return {
      error: Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      ),
    };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { error: Response.json({ error: "Invalid request." }, { status: 400 }) };
  }
  if (raw.length > opts.maxBytes) {
    return { error: Response.json({ error: "Request too large." }, { status: 413 }) };
  }

  try {
    return { body: JSON.parse(raw) };
  } catch {
    return { error: Response.json({ error: "Invalid request body." }, { status: 400 }) };
  }
}
