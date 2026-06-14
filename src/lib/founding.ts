export interface FoundingTier {
  id: string;
  name: string;
  /** What they will pay when credit goes live. */
  pay: number;
  /** The credit they receive (pay + bonus). */
  credit: number;
}

export const FOUNDING_TIERS: FoundingTier[] = [
  { id: "seedling", name: "Seedling", pay: 50, credit: 60 },
  { id: "grove", name: "Grove", pay: 150, credit: 190 },
  { id: "field", name: "Field", pay: 400, credit: 520 },
  { id: "patron", name: "Patron", pay: 1000, credit: 1350 },
];

export const foundingBonusPct = (t: FoundingTier) =>
  Math.round(((t.credit - t.pay) / t.pay) * 100);

export const getFoundingTier = (id?: string) =>
  FOUNDING_TIERS.find((t) => t.id === id);

/**
 * Whether the founding campaign is live. When true, the founding banner and
 * home band show. When false, the demo notice + waitlist banner shows instead.
 */
export const FOUNDING_LIVE = false;
