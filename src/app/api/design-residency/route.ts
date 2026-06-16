import Anthropic from "@anthropic-ai/sdk";
import { getHost } from "@/lib/data";
import { aiGuard } from "@/lib/rate-limit";

export const runtime = "nodejs";
// This route streams a model response — never cache it.
export const dynamic = "force-dynamic";
// Allow the streamed generation a bit longer before the platform cuts it.
export const maxDuration = 26;

interface DesignRequest {
  hostId?: string;
  skill: string;
  format?: string;
  level?: string;
  audience?: string;
  details?: string;
  /** Live online cohort: no physical host site. */
  online?: boolean;
}

const SYSTEM_PROMPT = `You are the residency designer for Grass Roots, a marketplace for hands-on, land-based learning at regenerative farms, homesteads, eco-building sites and permaculture projects.

A teacher brings a practical skill. A host site has real, on-the-ground projects that need doing. Your job is to design an immersive teacher-led residency that pairs the two: students learn the skill by doing meaningful work on a real living landscape.

Design principles — follow all of them:
- STUDENT VALUE COMES FIRST. The residency is education: mentorship, real skills, portfolio-building, and community. Frame everything from what the student gains.
- The benefit to the land/host is a genuine and beautiful by-product of the learning — never describe students as free labour, workers, or a workforce, and never imply they are there primarily to get the host's work done.
- Be concrete and specific to THIS place, THIS skill, and THESE projects. Use the site's real context. No generic filler.
- Make the schedule build progressively: orientation and fundamentals first, hands-on practice in the middle, a real finished outcome by the end. Keep it to AT MOST 7 entries. For formats up to about a week, one entry per day is fine; for longer formats, do NOT itemise every day, group days into phases or milestone days instead.
- Warm, grounded, practical voice. Real-world craft, not corporate training.
- Never use em dashes (the "—" character) anywhere in your writing. Use commas, colons, or periods instead.
- Suggest a realistic price a student would happily pay for this format, skill, and region, plus a sober estimate of materials cost per student.
- Write the listing copy to make a curious traveler want to book, and the host message to make a landowner happy to say yes.
- BE CONCISE. A few short, strong bullets beat long lists. Keep every bullet to one short line and keep all copy tight, so the plan is quick to read.

OUTPUT CONTRACT — this is strict:
Respond with a SINGLE valid JSON object and NOTHING else. No markdown, no code fences, no commentary before or after. Use exactly these keys:
{
  "title": string — an evocative residency title,
  "hook": string — one vivid sentence that sells the experience,
  "durationDays": number — total days, appropriate to the format,
  "skillLevel": string — e.g. "All levels", "Beginner", "Intermediate",
  "groupSize": number — a sensible maximum cohort size,
  "schedule": array of { "day": number, "title": string, "activities": string[] } — a progressive itinerary of AT MOST 7 entries, each with 2 to 3 short activity bullets. Up to about a week, use one entry per day. For longer formats, cover key milestone days or phases instead of every day: set "day" to that block's starting day number and name the span in the title (e.g. "Days 4 to 7: Building the walls"). Never exceed 7 entries,
  "studentOutcomes": string[], exactly 3 short concrete takeaways the student leaves with,
  "landImpact": string[], 2 to 3 short real improvements to the land (a by-product of the learning),
  "materials": string[], 4 short items, materials or tools used,
  "whatToBring": string[], 4 short items the student should bring,
  "whyThisMatch": string, 1 to 2 sentences on why this skill and this site fit together,
  "suggestedPrice": number, the fair price in euros that ONE student pays for the whole residency (realistic for this format, skill, and region),
  "materialsCostPerStudent": number, estimated euros of materials and consumables per student (0 if minimal),
  "pricingRationale": string, one short sentence explaining the price,
  "listingDescription": string, two short warm paragraphs (about 25 words each) of student-facing marketing copy, with a blank line written as \\n\\n between them,
  "idealStudent": string, one sentence describing who this residency is perfect for,
  "socialBlurb": string, a punchy one or two sentence blurb the teacher could post on social media,
  "hostPitch": string, a warm, ready-to-send first-person message from the teacher to the host (2 short sentences, covering what you would bring and what the land would gain)
}`;

function buildUserPrompt(opts: {
  hostName: string;
  location: string;
  landType: string;
  story: string;
  needs: string[];
  skill: string;
  format: string;
  level: string;
  audience: string;
  notes: string;
}) {
  return `Design a teacher residency.

SKILL THE TEACHER OFFERS: ${opts.skill}

HOST SITE: ${opts.hostName} — ${opts.landType} in ${opts.location}
About the site: ${opts.story}
Real projects this land needs help with:
${opts.needs.map((n) => `- ${n}`).join("\n")}

DESIRED FORMAT: ${opts.format}
STUDENT LEVEL: ${opts.level}
WHO IT'S FOR: ${opts.audience}${
    opts.notes
      ? `\n\nWHAT THE TEACHER WANTS, IN THEIR OWN WORDS (honour this closely, weaving in their requested activities, emphasis, and style):\n${opts.notes}`
      : ""
  }

Design a residency that teaches "${opts.skill}" here. The hands-on work should genuinely advance one or more of the site's real projects, while always centring what students learn and take away. Choose an appropriate number of days for the format. Keep the schedule to at most 7 entries: one per day for short formats, or grouped phases / milestone days for longer ones, so it stays quick to read.`;
}

/** Prompt for a portable residency not tied to one named site. */
function buildGenericPrompt(opts: {
  skill: string;
  format: string;
  level: string;
  audience: string;
  notes: string;
}) {
  return `Design a teacher residency that is PORTABLE: not tied to one named site, suitable for any regenerative farm, homestead, eco-building project, or permaculture site willing to host it.

SKILL THE TEACHER OFFERS: ${opts.skill}

HOST SITE: not yet chosen. Write the residency so it works at a typical living, regenerative landscape. Where you would normally name the site, refer to it generally ("the host site", "the land", "your hosts"). The hands-on work should advance the kinds of real projects such places commonly need (building soil, planting, natural building, water, habitat), while always centring what students learn and take away.

DESIRED FORMAT: ${opts.format}
STUDENT LEVEL: ${opts.level}
WHO IT'S FOR: ${opts.audience}${
    opts.notes
      ? `\n\nWHAT THE TEACHER WANTS, IN THEIR OWN WORDS (honour this closely, weaving in their requested activities, emphasis, and style):\n${opts.notes}`
      : ""
  }

For "whyThisMatch", explain why this skill suits hands-on regenerative land in general. For "hostPitch", write a warm template message the teacher could send to ANY prospective host, describing what they would bring and what the land would gain. Choose an appropriate number of days for the format. Keep the schedule to at most 7 entries: one per day for short formats, or grouped phases / milestone days for longer ones, so it stays quick to read.`;
}

/** Prompt for a live online cohort course (no physical host site). */
function buildOnlinePrompt(opts: {
  skill: string;
  format: string;
  level: string;
  audience: string;
  notes: string;
}) {
  return `Design a LIVE ONLINE cohort course. There is NO physical host site and no on-the-ground land work. This is taught over scheduled live online sessions (think live video calls and workshops), with students applying what they learn in their own context between sessions.

SKILL THE TEACHER TEACHES: ${opts.skill}

DESIRED CADENCE: ${opts.format} (interpret this as the intensity / span of the live cohort)
STUDENT LEVEL: ${opts.level}
WHO IT'S FOR: ${opts.audience}${
    opts.notes
      ? `\n\nWHAT THE TEACHER WANTS, IN THEIR OWN WORDS (honour this closely):\n${opts.notes}`
      : ""
  }

Fill the fields for an ONLINE course:
- "durationDays": the number of live sessions.
- "schedule": one entry per live SESSION (at most 7). Set "day" to the session number; the title is the session theme; the activities are what happens in that live session.
- "landImpact": reframe as the real regenerative practices students will put into action in their own life or local place (not work on a host's land).
- "materials": tools, software, or resources students use.
- "whatToBring": what students should have ready (a notebook, a stable connection, a quiet space, any optional kit).
- "whyThisMatch": why learning this live, in a cohort, with this teacher, beats learning it alone.
- "hostPitch": instead of a message to a host, write a warm welcome note the teacher would send to students who join the cohort.
Keep all copy tight and never use em dashes.`;
}

const FORMAT_LABELS: Record<string, string> = {
  day: "a single immersive day course",
  weekend: "a weekend workshop (2–3 days)",
  "multi-week": "a multi-day intensive (about 7–12 days)",
  residency: "a multi-week residency (2–3 weeks)",
};

export async function POST(request: Request) {
  const guard = await aiGuard(request, {
    name: "design",
    limit: 10,
    windowMs: 60_000,
    maxBytes: 8_000,
  });
  if ("error" in guard) return guard.error;
  const body = guard.body as DesignRequest;

  // A specific host is optional: with one we design for that site; without one
  // we design a portable residency for "any landscape willing to host".
  const host = body.hostId ? getHost(body.hostId) : undefined;
  if (body.hostId && !host) {
    return Response.json({ error: "Unknown host site." }, { status: 404 });
  }
  if (!body.skill?.trim()) {
    return Response.json(
      { error: "Tell us what skill you'd teach." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "The Residency Studio isn't configured yet. Set ANTHROPIC_API_KEY in the site's environment variables.",
      },
      { status: 503 },
    );
  }

  const client = new Anthropic();

  const format = FORMAT_LABELS[body.format ?? "weekend"] ?? "a weekend workshop";
  const level = body.level?.trim() || "all levels welcome";
  const audience =
    body.audience?.trim() || "curious adults who want to learn by doing";
  const notes = body.details?.trim() || "";

  const userPrompt = body.online
    ? buildOnlinePrompt({ skill: body.skill.trim(), format, level, audience, notes })
    : host
      ? buildUserPrompt({
          hostName: host.name,
          location: [host.location.place, host.location.country].join(", "),
          landType: host.landType,
          story: host.story,
          needs: host.needs,
          skill: body.skill.trim(),
          format,
          level,
          audience,
          notes,
        })
      : buildGenericPrompt({ skill: body.skill.trim(), format, level, audience, notes });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const modelStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 8000,
          // Disable thinking so the JSON begins streaming immediately —
          // the demo's "watch it build" effect depends on a fast first token.
          thinking: { type: "disabled" },
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        });

        modelStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await modelStream.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "The designer hit an error.";
        // Surface the error inside the stream so the client can show it.
        controller.enqueue(encoder.encode(`\n__ERROR__${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
