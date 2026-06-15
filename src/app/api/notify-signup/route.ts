import { aiGuard } from "@/lib/rate-limit";
import {
  getListingTeacherContact,
  getUserContact,
} from "@/lib/admin-firestore";

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
  interest: "course interest",
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
    listingId?: string;
    recipientUid?: string;
  };

  // Not configured yet: accept quietly so the sign-up flow is never affected.
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ ok: false, reason: "not-configured" });
  }

  // In-app message: nudge the recipient by email to come back and reply.
  if (body.type === "message") {
    const recipientUid = (body.recipientUid || "").trim().slice(0, 80);
    if (!recipientUid) return Response.json({ ok: false }, { status: 400 });
    const recipient = await getUserContact(recipientUid);
    if (!recipient?.email) {
      return Response.json({ ok: false, reason: "no-recipient" });
    }
    const sender = (body.name || "Someone").trim().slice(0, 120);
    const about = (body.detail || "").trim().slice(0, 200);
    const subject = `New message from ${sender}${about ? ` about ${about}` : ""}`;
    const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height:1.6; color:#2a2620;">
      <h2 style="margin:0 0 10px; font-size:18px;">You have a new message 🌱</h2>
      <p style="margin:0;"><strong>${escapeHtml(sender)}</strong> messaged you${about ? ` about <strong>${escapeHtml(about)}</strong>` : ""} on Grass Roots.</p>
      <p style="margin:14px 0 0;"><a href="https://grassroots.earth/messages" style="color:#3f6212; font-weight:600;">Open your messages</a> to read and reply.</p>
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
          to: [recipient.email],
          subject,
          html,
        }),
      });
      if (!res.ok) return Response.json({ ok: false }, { status: 502 });
    } catch {
      return Response.json({ ok: false }, { status: 502 });
    }
    return Response.json({ ok: true });
  }

  const email = (body.email || "").trim().slice(0, 200);
  if (!email) return Response.json({ ok: false }, { status: 400 });
  const source = (body.source || body.type || "waitlist").trim().slice(0, 40);
  const name = (body.name || "").trim().slice(0, 120);
  let detail = (body.detail || "").trim().slice(0, 200);
  const listingId = (body.listingId || "").trim().slice(0, 80);

  // Interest in a real teacher listing: notify that teacher directly (with a
  // copy to the team). Falls back to the team inbox if admin isn't configured
  // or the teacher can't be resolved.
  let to = TO;
  let bcc: string | undefined;
  let toTeacher = false;
  if (listingId) {
    const teacher = await getListingTeacherContact(listingId);
    if (teacher?.email) {
      to = teacher.email;
      bcc = TO;
      toTeacher = true;
      if (teacher.title) detail = teacher.title;
    }
  }

  const label = LABELS[source] ?? "signup";
  const studentName = name || email;

  const subject = toTeacher
    ? `New interest in your course${detail ? `: ${detail}` : ""}`
    : `New ${label}: ${email}`;

  const html = toTeacher
    ? `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height:1.6; color:#2a2620;">
      <h2 style="margin:0 0 10px; font-size:18px;">Someone wants to join your course 🌱</h2>
      ${detail ? `<p style="margin:0;"><strong>Course:</strong> ${escapeHtml(detail)}</p>` : ""}
      <p style="margin:0;"><strong>From:</strong> ${escapeHtml(studentName)}</p>
      <p style="margin:0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:14px 0 0; font-size:13px; color:#6b6457;">Just reply to this email to reach them. Sent by grassroots.earth.</p>
    </div>`
    : `
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
        to: [to],
        ...(bcc ? { bcc: [bcc] } : {}),
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Resend send failed", res.status, errText.slice(0, 300));
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend error", err);
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
