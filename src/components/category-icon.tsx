import {
  Sprout,
  Hammer,
  Hexagon,
  Wheat,
  Leaf,
  Trees,
  Flower2,
  Compass,
  Flame,
  Egg,
  Droplets,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

const MAP: Record<CategoryId, React.ComponentType<LucideProps>> = {
  permaculture: Sprout,
  "natural-building": Hammer,
  beekeeping: Hexagon,
  "regenerative-farming": Wheat,
  herbalism: Leaf,
  "food-forest": Trees,
  "mushroom-cultivation": Flower2,
  foraging: Compass,
  "fire-fermentation": Flame,
  "animal-husbandry": Egg,
  "water-earthworks": Droplets,
  "off-grid-tech": Zap,
};

export function CategoryIcon({
  id,
  ...props
}: { id: CategoryId } & LucideProps) {
  const Icon = MAP[id] ?? Sprout;
  return <Icon {...props} />;
}
