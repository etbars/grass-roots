/** Core domain types for the Grass Roots marketplace. */

export type CategoryId =
  | "permaculture"
  | "natural-building"
  | "beekeeping"
  | "regenerative-farming"
  | "herbalism"
  | "food-forest"
  | "mushroom-cultivation"
  | "foraging"
  | "fire-fermentation"
  | "animal-husbandry";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
  /** lucide-react icon name, resolved in the UI */
  icon: string;
}

export type CourseFormat = "day" | "weekend" | "multi-week" | "residency";

/** Whether a listing is a bookable course, a host's open project, or a teacher's pitch. */
export type ListingType = "course" | "project-opportunity" | "residency-proposal";

export interface Location {
  place: string;
  region?: string;
  country: string;
}

export interface Host {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: Location;
  /** e.g. "Regenerative farm", "Off-grid homestead", "Permaculture project" */
  landType: string;
  sizeHa?: number;
  image: string;
  story: string;
  /** Real, on-the-ground projects the land needs help with — feeds the Residency Studio. */
  needs: string[];
  /** What a teacher-in-residence receives (accommodation, food, etc.) */
  offers: string[];
  amenities: string[];
  /** Lightly adapted from the GoHabitat listing this host is inspired by. */
  inspiredBy?: string;
  /** Link to the real GoHabitat listing this host is based on. */
  listingUrl?: string;
}

export interface Teacher {
  id: string;
  slug: string;
  name: string;
  image: string;
  headline: string;
  skills: CategoryId[];
  bio: string;
  basedIn: string;
  yearsTeaching: number;
  rating: number;
  reviews: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryId: CategoryId;
  format: CourseFormat;
  listingType: ListingType;
  teacherId: string;
  hostId: string;
  image: string;
  durationLabel: string;
  startDate: string; // ISO date
  capacity: number;
  spotsLeft: number;
  price: number;
  currency: "EUR";
  level: "All levels" | "Beginner" | "Intermediate" | "Advanced";
  highlights: string[];
  studentOutcomes: string[];
  landImpact: string[];
}
