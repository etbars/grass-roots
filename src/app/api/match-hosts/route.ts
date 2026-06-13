import Anthropic from "@anthropic-ai/sdk";
import { hosts } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HostMatch {
  hostId: string;
  fitScore: number;
  reason: string;
}

export async function POST(request: Request) {
  let skill = "";
  try {
    const body = (await request.json()) as { skill?: string };
    skill = body.skill ?? "";
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!skill?.trim()) {
    return Response.json({ error: "Tell us what you teach first." }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Matching isn't configured yet. Set ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }

  const catalogue = hosts
    .map(
      (h) =>
        `- id: ${h.id}\n  name: ${h.name} (${h.landType}, ${h.location.place}, ${h.location.country})\n  needs: ${h.needs.join("; ")}`,
    )
    .join("\n");

  const system = `You match teachers to host sites for Grass Roots, a hands-on, land-based learning marketplace. Given a teacher's skill, pick the THREE host sites from the list whose real on-the-ground projects would benefit most from that skill, ranked best first. Judge by how directly the skill serves the site's stated needs and land type.

Respond with a SINGLE valid JSON object and nothing else (no markdown, no prose):
{ "matches": [ { "hostId": string (must be an id from the list), "fitScore": number (0 to 100), "reason": string (one warm, specific sentence on why this site fits the skill, no em dashes) } ] }
Return exactly three matches, highest fitScore first.`;

  const user = `TEACHER'S SKILL: ${skill.trim()}\n\nHOST SITES:\n${catalogue}`;

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system,
      messages: [{ role: "user", content: user }],
    });
    const raw = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      matches: HostMatch[];
    };
    // Keep only valid host ids, cap at 3.
    const valid = (parsed.matches ?? [])
      .filter((m) => hosts.some((h) => h.id === m.hostId))
      .slice(0, 3);
    return Response.json({ matches: valid });
  } catch {
    return Response.json(
      { error: "Couldn't find matches right now. Try again." },
      { status: 500 },
    );
  }
}
