import Anthropic from "@anthropic-ai/sdk";
import { getHost } from "@/lib/data";

export const runtime = "nodejs";
// This route streams a model response — never cache it.
export const dynamic = "force-dynamic";

interface DesignRequest {
  hostId: string;
  skill: string;
  format?: string;
  level?: string;
  audience?: string;
}

const SYSTEM_PROMPT = `You are the residency designer for Grass Roots, a marketplace for hands-on, land-based learning at regenerative farms, homesteads, eco-building sites and permaculture projects.

A teacher brings a practical skill. A host site has real, on-the-ground projects that need doing. Your job is to design an immersive teacher-led residency that pairs the two: students learn the skill by doing meaningful work on a real living landscape.

Design principles — follow all of them:
- STUDENT VALUE COMES FIRST. The residency is education: mentorship, real skills, portfolio-building, and community. Frame everything from what the student gains.
- The benefit to the land/host is a genuine and beautiful by-product of the learning — never describe students as free labour, workers, or a workforce, and never imply they are there primarily to get the host's work done.
- Be concrete and specific to THIS place, THIS skill, and THESE projects. Use the site's real context. No generic filler.
- Make the day-by-day schedule build progressively: orientation and fundamentals first, hands-on practice in the middle, a real finished outcome by the end.
- Warm, grounded, practical voice. Real-world craft, not corporate training.
- Never use em dashes (the "—" character) anywhere in your writing. Use commas, colons, or periods instead.
- Suggest a realistic price a student would happily pay for this format, skill, and region, plus a sober estimate of materials cost per student.

OUTPUT CONTRACT — this is strict:
Respond with a SINGLE valid JSON object and NOTHING else. No markdown, no code fences, no commentary before or after. Use exactly these keys:
{
  "title": string — an evocative residency title,
  "hook": string — one vivid sentence that sells the experience,
  "durationDays": number — total days, appropriate to the format,
  "skillLevel": string — e.g. "All levels", "Beginner", "Intermediate",
  "groupSize": number — a sensible maximum cohort size,
  "schedule": array of { "day": number, "title": string, "activities": string[] } — one object per day,
  "studentOutcomes": string[] — concrete skills/takeaways the student leaves with,
  "landImpact": string[] — the genuine, real improvements to the land/host (a by-product of the learning),
  "materials": string[] — materials, tools, or inputs used,
  "whatToBring": string[] — what the student should bring,
  "whyThisMatch": string, 1 to 2 sentences on why this skill and this site fit together,
  "suggestedPrice": number, the fair price in euros that ONE student pays for the whole residency (realistic for this format, skill, and region),
  "materialsCostPerStudent": number, estimated euros of materials and consumables per student (0 if minimal),
  "pricingRationale": string, one short sentence explaining the price
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
}) {
  return `Design a teacher residency.

SKILL THE TEACHER OFFERS: ${opts.skill}

HOST SITE: ${opts.hostName} — ${opts.landType} in ${opts.location}
About the site: ${opts.story}
Real projects this land needs help with:
${opts.needs.map((n) => `- ${n}`).join("\n")}

DESIRED FORMAT: ${opts.format}
STUDENT LEVEL: ${opts.level}
WHO IT'S FOR: ${opts.audience}

Design a residency that teaches "${opts.skill}" here. The hands-on work should genuinely advance one or more of the site's real projects, while always centring what students learn and take away. Choose an appropriate number of days for the format. The schedule must have one entry per day.`;
}

const FORMAT_LABELS: Record<string, string> = {
  day: "a single immersive day course",
  weekend: "a weekend workshop (2–3 days)",
  "multi-week": "a multi-day intensive (about 7–12 days)",
  residency: "a multi-week residency (2–3 weeks)",
};

export async function POST(request: Request) {
  let body: DesignRequest;
  try {
    body = (await request.json()) as DesignRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const host = getHost(body.hostId);
  if (!host) {
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

  const userPrompt = buildUserPrompt({
    hostName: host.name,
    location: [host.location.place, host.location.country].join(", "),
    landType: host.landType,
    story: host.story,
    needs: host.needs,
    skill: body.skill.trim(),
    format: FORMAT_LABELS[body.format ?? "weekend"] ?? "a weekend workshop",
    level: body.level?.trim() || "all levels welcome",
    audience: body.audience?.trim() || "curious adults who want to learn by doing",
  });

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
