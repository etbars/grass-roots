import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Streamed generation; give it room before the platform cuts the stream.
export const maxDuration = 26;

const SYSTEM_PROMPT = `You refine an existing teacher residency for Grass Roots, a marketplace for hands-on, land-based learning. You are given the current residency as JSON and a change the teacher wants. Apply the change and return the COMPLETE updated residency (not a diff), keeping everything else coherent: if the duration changes, rebuild and renumber the schedule to match; keep pricing realistic; keep what students learn front and centre.

Principles:
- Student value comes first. The land benefit is a genuine by-product of the learning, never free labour.
- Be concrete and specific. Be concise: about 3 short activity bullets per day, short copy.
- Warm, grounded, practical voice.
- Never use em dashes (the "—" character). Use commas, colons, or periods.

Respond with a SINGLE valid JSON object and NOTHING else (no markdown, no commentary), using exactly these keys:
{
  "title": string,
  "hook": string,
  "durationDays": number,
  "skillLevel": string,
  "groupSize": number,
  "schedule": array of { "day": number, "title": string, "activities": string[] } with 3 short bullets per day,
  "studentOutcomes": string[],
  "landImpact": string[],
  "materials": string[],
  "whatToBring": string[],
  "whyThisMatch": string,
  "suggestedPrice": number,
  "materialsCostPerStudent": number,
  "pricingRationale": string,
  "listingDescription": string (two short paragraphs separated by \\n\\n),
  "idealStudent": string,
  "socialBlurb": string,
  "hostPitch": string
}`;

export async function POST(request: Request) {
  let body: { residency?: unknown; instruction?: string; hostName?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.residency || !body.instruction?.trim()) {
    return Response.json(
      { error: "Need a residency and a requested change." },
      { status: 400 },
    );
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The Residency Studio isn't configured yet." },
      { status: 503 },
    );
  }

  const userPrompt = `HOST SITE: ${body.hostName ?? "the chosen host site"}

CURRENT RESIDENCY (JSON):
${JSON.stringify(body.residency)}

REQUESTED CHANGE: ${body.instruction.trim()}

Apply the change and return the full updated residency JSON.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const client = new Anthropic();
        const modelStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 8000,
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
          err instanceof Error ? err.message : "The studio hit an error.";
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
