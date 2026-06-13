// Standalone check of the AI Residency Designer's core Claude call.
// Run: node --env-file=.env.local scripts/test-designer.mjs
import Anthropic from "@anthropic-ai/sdk";

const host = {
  name: "Quinta das Abelhas",
  location: "Cortiço, Portugal",
  landType: "Mountain restoration smallholding",
  story:
    "Set against Portugal's highest mountains, this rustic quinta is reviving terraced land and tending a growing apiary.",
  needs: [
    "Expand the apiary and build new top-bar hives",
    "Replant pollinator forage along the stone terraces",
    "Rebuild a collapsed dry-stone terrace wall",
  ],
};
const skill = "natural beekeeping";

const SYSTEM = `You are the residency designer for Grass Roots. Design principles: student value first (skills, mentorship, portfolio, community); never frame students as free labour; be concrete to THIS place and skill; warm, grounded voice.
OUTPUT CONTRACT: respond with a SINGLE valid JSON object and nothing else (no markdown, no prose). Keys: title (string), hook (string), durationDays (number), skillLevel (string), groupSize (number), schedule (array of {day:number,title:string,activities:string[]}), studentOutcomes (string[]), landImpact (string[]), materials (string[]), whatToBring (string[]), whyThisMatch (string).`;

const user = `Design a teacher residency teaching "${skill}".
HOST: ${host.name} — ${host.landType} in ${host.location}. ${host.story}
Real projects this land needs:\n${host.needs.map((n) => `- ${n}`).join("\n")}
FORMAT: a weekend workshop (2–3 days). LEVEL: beginner. One schedule entry per day.`;

const t0 = Date.now();
const client = new Anthropic();
const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 8000,
  thinking: { type: "disabled" },
  system: SYSTEM,
  messages: [{ role: "user", content: user }],
});

let firstTokenAt = 0;
stream.on("text", () => {
  if (!firstTokenAt) firstTokenAt = Date.now();
});

const msg = await stream.finalMessage();
const raw = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");

console.log(`model: ${msg.model}`);
console.log(`stop_reason: ${msg.stop_reason}`);
console.log(
  `time to first token: ${firstTokenAt ? firstTokenAt - t0 : "?"}ms | total: ${Date.now() - t0}ms`,
);
console.log(
  `usage: in=${msg.usage.input_tokens} out=${msg.usage.output_tokens}`,
);

const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");
const parsed = JSON.parse(raw.slice(start, end + 1));
const required = [
  "title",
  "hook",
  "durationDays",
  "skillLevel",
  "groupSize",
  "schedule",
  "studentOutcomes",
  "landImpact",
  "materials",
  "whatToBring",
  "whyThisMatch",
];
const missing = required.filter((k) => !(k in parsed));
console.log(`\nJSON parsed OK. missing keys: ${missing.length ? missing.join(", ") : "none"}`);
console.log(`\nTITLE: ${parsed.title}`);
console.log(`HOOK:  ${parsed.hook}`);
console.log(`DAYS:  ${parsed.durationDays} | level: ${parsed.skillLevel} | group: ${parsed.groupSize}`);
console.log(`SCHEDULE (${parsed.schedule.length} days):`);
for (const d of parsed.schedule) {
  console.log(`  Day ${d.day}: ${d.title}`);
  for (const a of d.activities) console.log(`    - ${a}`);
}
console.log(`\nSTUDENT OUTCOMES:`);
parsed.studentOutcomes.forEach((o) => console.log(`  • ${o}`));
console.log(`\nLAND IMPACT:`);
parsed.landImpact.forEach((o) => console.log(`  • ${o}`));
console.log(`\nWHY THIS MATCH: ${parsed.whyThisMatch}`);
