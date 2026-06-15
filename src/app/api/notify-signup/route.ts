import { aiGuard } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Where lead notifications go, and who they come from. Defaults work with a
// Resend account whose own email is team@grassroots.earth (no domain
// verification needed). Once grassroots.earth is verified in Resend, set
// NOTIFY_FROM to e.g. "Grass Roots <notifications@grassroots.earth>".
const TO = process.env.NOTIFY_TO || "team@grassroots.earth";
const FROM = process.env.NOTIFY_FROM || "Grass Roots <onboarding@resend.dev>";

const LABELS: Record<string, string> = {
  waitlist: "waitlist signup",
  founding: "founding-member interest",
  courseRequest: "course request",
};

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  );
}

export async function POST(request: Request) {
  // Public endpoint: rate-limit and size-cap it. It only ever emails the fixed
  // team address, so it can't be used to spam others, just to flood team@.
  const guard = await aiGuard(request, {
    name: "notify",
    limit: 12,
    windowMs: 60_000,
    maxBytes: 2_000,
  });
  if ("error" in guard) return guard.error;
  const body = guard.body as {
    type?: string;
    email?: string;
    source?: string;
    name?: string;
    detail?: string;
  };

  // Not configured yet: accept quietly so the sign-up flow is never affected.
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ ok: false, reason: "not-configured" });
  }

  const email = (body.email || "").trim().slice(0, 200);
  if (!email) return Response.json({ ok: false }, { status: 400 });
  const source = (body.source || body.type || "waitlist").trim().slice(0, 40);
  const name = (body.name || "").trim().slice(0, 120);
  const detail = (body.detail || "").trim().slice(0, 200);
  const label = LABELS[source] ?? "signup";

  const subject = `New ${label}: ${email}`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height:1.6; color:#2a2620;">
      <h2 style="margin:0 0 10px; font-size:18px;">New ${escapeHtml(label)} 🌱</h2>
      ${name ? `<p style="margin:0;"><strong>Name:</strong> ${escapeHtml(name)}</p>` : ""}
      <p style="margin:0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${detail ? `<p style="margin:0;"><strong>Course:</strong> ${escapeHtml(detail)}</p>` : ""}
      <p style="margin:0;"><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p style="margin:14px 0 0; font-size:13px; color:#6b6457;">Sent automatically by grassroots.earth.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend send failed", res.status, detail.slice(0, 300));
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend error", err);
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
