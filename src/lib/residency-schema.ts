/**
 * Shape of a residency designed in the Residency Studio.
 * Mirrored by `residencyJsonSchema` below, which constrains the model output.
 */
export interface DesignedResidency {
  title: string;
  hook: string;
  durationDays: number;
  skillLevel: string;
  groupSize: number;
  schedule: { day: number; title: string; activities: string[] }[];
  studentOutcomes: string[];
  landImpact: string[];
  materials: string[];
  whatToBring: string[];
  whyThisMatch: string;
  suggestedPrice: number;
  materialsCostPerStudent: number;
  pricingRationale: string;
}

/** JSON Schema passed to the Messages API as a structured-output constraint. */
export const residencyJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    durationDays: { type: "integer" },
    skillLevel: { type: "string" },
    groupSize: { type: "integer" },
    schedule: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          activities: { type: "array", items: { type: "string" } },
        },
        required: ["day", "title", "activities"],
      },
    },
    studentOutcomes: { type: "array", items: { type: "string" } },
    landImpact: { type: "array", items: { type: "string" } },
    materials: { type: "array", items: { type: "string" } },
    whatToBring: { type: "array", items: { type: "string" } },
    whyThisMatch: { type: "string" },
  },
  required: [
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
  ],
} as const;
