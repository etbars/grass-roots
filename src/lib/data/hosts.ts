import type { Host } from "@/lib/types";

export const hosts: Host[] = [
  {
    id: "fairytale-cob",
    slug: "fairytale-cob-house",
    name: "Fairytale Cob House",
    tagline: "An off-grid cob hideaway in a Scottish forest garden",
    location: { place: "Abeloer", region: "Scottish Highlands", country: "United Kingdom" },
    landType: "Off-grid smallholding & forest garden",
    sizeHa: 4,
    image: "/images/cabin-redhill.jpg",
    story:
      "A hand-built cob cottage with curved walls sits at the heart of a young forest garden on a small Scottish holding. The land is slowly being shaped into a productive, biodiverse haven — and there's always something to build, plant, or mend.",
    needs: [
      "Restore and extend the forest-garden swales to slow water on the slope",
      "Build a cob bread oven and outdoor cooking shelter",
      "Repair and re-plaster a weathered south-facing cob wall",
    ],
    offers: [
      "Private room in the cob house for the teacher-in-residence",
      "All meals from the garden and local croft",
      "Use of the on-site workshop and hand tools",
    ],
    amenities: ["Off-grid solar", "Wood stove", "Spring water", "Forest garden"],
    inspiredBy: "Fairytale Cob House, Scotland (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/hideaway/51-fairytale-cob-house.html",
  },
  {
    id: "quinta-abelhas",
    slug: "quinta-das-abelhas",
    name: "Quinta das Abelhas",
    tagline: "A bee-rich restoration project in the Serra da Estrela",
    location: { place: "Cortiço", region: "Serra da Estrela", country: "Portugal" },
    landType: "Mountain restoration smallholding",
    sizeHa: 8,
    image: "/images/farmstead-goldenhour.jpg",
    story:
      "Set against Portugal's highest mountains, this rustic quinta is reviving terraced land and tending a growing apiary. Its name means 'farm of the bees', and pollinators are at the centre of everything happening here.",
    needs: [
      "Expand the apiary and build new top-bar hives",
      "Replant pollinator forage along the stone terraces",
      "Rebuild a collapsed dry-stone terrace wall",
    ],
    offers: [
      "The heritage Hoopoe Cabin for the resident teacher",
      "Hearty farm meals and mountain spring water",
      "Beekeeping equipment and protective gear",
    ],
    amenities: ["Apiary", "Dry-stone terraces", "Wood-fired kitchen", "Mountain trails"],
    inspiredBy: "The Hoopoe Cabin · Quinta das Abelhas, Portugal (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/quinta-das-abelhas/110-the-hoopoe-cabin.html",
  },
  {
    id: "la-goursaline",
    slug: "la-goursaline",
    name: "La Goursaline",
    tagline: "A permaculture farmstay between meadow and forest",
    location: { place: "Bussière-Galant", region: "Limousin", country: "France" },
    landType: "Permaculture farmstay",
    sizeHa: 12,
    image: "/images/forest.jpg",
    story:
      "Traditional Mongolian yurts dot a permaculture farm where meadow meets ancient woodland. The land is a living classroom of food forests, ponds, and rotational systems, with wood stoves keeping it cosy year-round.",
    needs: [
      "Plant the next phase of the young food forest",
      "Dig and seal a new wildlife and irrigation pond",
      "Establish a market-garden bed system near the yurts",
    ],
    offers: [
      "A private Mongolian yurt with wood stove",
      "Shared farm meals with seasonal produce",
      "Access to nursery, tools, and growing areas",
    ],
    amenities: ["Yurts", "Food forest", "Ponds", "Wood stoves"],
    inspiredBy: "Hillside Yurt · La Goursaline, France (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/french-hillside-permaculture-farmstay/83-hillside-yurt-between-meadow-and-forest.html",
  },
  {
    id: "tuscan-cestaio",
    slug: "wild-tuscan-cestaio",
    name: "Bioagriturismo Cestaio",
    tagline: "126 hectares of Tuscan eco-activism and farm-to-table",
    location: { place: "Gaiole in Chianti", region: "Tuscany", country: "Italy" },
    landType: "Organic agriturismo & nature reserve",
    sizeHa: 126,
    image: "/images/vineyard-terraces.jpg",
    story:
      "An 18th-century stone farmhouse anchors 126 hectares of organic vineyards, olive groves, woodland, and herb gardens in the heart of Chianti. Farm-to-table is a daily practice, and the estate runs as a long-term act of ecological care.",
    needs: [
      "Develop the medicinal and culinary herb gardens",
      "Inoculate logs for a woodland mushroom yard",
      "Restore terraces in the old olive grove",
    ],
    offers: [
      "A farmhouse apartment for the resident teacher",
      "Farm-to-table meals, wine, and estate olive oil",
      "Use of the cellar, kitchen, and herb gardens",
    ],
    amenities: ["Stone farmhouse", "Vineyards", "Olive groves", "Herb gardens"],
    inspiredBy: "Wild Tuscan Agriturismo: Cestaio, Italy (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/bioagriturismo-reggioli/111-wild-tuscan-agriturismo-cestaio.html",
  },
  {
    id: "andalusian-ecovillage",
    slug: "andalusian-ecovillage",
    name: "Periana Ecovillage",
    tagline: "A 240-hectare regenerative landscape in formation",
    location: { place: "Periana", region: "Andalusia", country: "Spain" },
    landType: "Ecovillage & regenerative landscape",
    sizeHa: 240,
    image: "/images/valley-misty.jpg",
    story:
      "A vast Andalusian landscape is being shaped into an ecovillage from the ground up. Water, soil, and community are all works in progress here, with room for ambitious projects and people who want to help lay the foundations.",
    needs: [
      "Build earthworks and swales for water harvesting",
      "Raise the first natural-plastered communal building",
      "Design and plant a drought-resilient food forest",
    ],
    offers: [
      "A private yurt within the ecovillage",
      "Communal meals and shared village life",
      "Earth-building materials and a maker's workshop",
    ],
    amenities: ["Yurts", "Communal kitchen", "Workshop", "Spring-fed water"],
    inspiredBy: "Andalusian Ecovillage in Formation, Spain (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/gh/75-andalusian-ecovillage-in-formation.html",
  },
  {
    id: "arran-rewilding",
    slug: "runach-arainn",
    name: "Rùnach Àrainn",
    tagline: "Nature-led yurts on a rewilding island holding",
    location: { place: "Isle of Arran", region: "Scotland", country: "United Kingdom" },
    landType: "Rewilding holding & orchard meadow",
    sizeHa: 6,
    image: "/images/wildflowers.jpg",
    story:
      "On a UNESCO Geopark island, three Scottish-made yurts sit in an orchard meadow given over to nature. The holding is a quiet experiment in rewilding, wild food, and letting the land lead.",
    needs: [
      "Map and expand wild-food hedgerows and the orchard",
      "Create a foraging and identification trail",
      "Build habitat features for pollinators and birds",
    ],
    offers: [
      "An insulated yurt with private amenities",
      "Island-grown and wild-gathered meals",
      "Guided access to coast, woodland, and meadow",
    ],
    amenities: ["Yurts", "Orchard meadow", "Wild coastline", "Solar lighting"],
    inspiredBy: "Among Arran's Ancient Ecology · Rùnach Àrainn, UK (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/runach-arainn-glamping/107-among-arrans-ancient-ecology.html",
  },
  {
    id: "ecosystem-collective",
    slug: "ecosystem-collective",
    name: "Fornos Ecosystem Collective",
    tagline: "A rewilding cottage in a recovering Portuguese valley",
    location: { place: "Fornos de Algodres", region: "Centro", country: "Portugal" },
    landType: "Rewilding project & heritage cottage",
    sizeHa: 18,
    image: "/images/cabin-forest.jpg",
    story:
      "A restored heritage cottage sits within a collective working to bring a degraded valley back to life. Tiny-home builds, native planting, and hands-on regeneration are all part of daily life here.",
    needs: [
      "Build a timber-framed tiny home from local wood",
      "Plant native trees to stabilise eroded slopes",
      "Set up a rainwater harvesting and greywater system",
    ],
    offers: [
      "The heritage cottage for the resident teacher",
      "Shared meals with the collective",
      "Locally milled timber and a build workshop",
    ],
    amenities: ["Heritage cottage", "Timber workshop", "Native nursery", "River access"],
    inspiredBy: "Outdoor Living on Ecosystem Collective, Portugal (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/quinta-abelhas/93-outdoor-living-on-ecosystem-collective.html",
  },
  {
    id: "lochem-demo-farm",
    slug: "lochem-demonstration-farm",
    name: "De Marke Demonstration Farm",
    tagline: "A 45-hectare regenerative demonstration site",
    location: { place: "Lochem", region: "Gelderland", country: "Netherlands" },
    landType: "Regenerative demonstration farm",
    sizeHa: 45,
    image: "/images/farm-work.jpg",
    story:
      "A working demonstration farm showing what regenerative agriculture can do at scale — food forests, edible landscapes, and a campground where visitors learn by walking the fields. There's always a trial, a harvest, or a build underway.",
    needs: [
      "Set up a mushroom cultivation yard using farm waste",
      "Expand the edible food-forest planting",
      "Build raised market-garden beds for the campground",
    ],
    offers: [
      "A self-contained caravan or glamping tent",
      "Produce from the farm and shared facilities",
      "Use of barns, tools, and growing infrastructure",
    ],
    amenities: ["Food forest", "Campground", "Barns & tools", "Demonstration plots"],
    inspiredBy: "Small Caravan, Big Transition · Lochem, Netherlands (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/gemeenschapsboerderij-t-gagel/102-small-caravan-big-transition.html",
  },
  {
    id: "alcolea-sanctuary",
    slug: "off-grid-rewilding-sanctuary",
    name: "Alcolea Off-grid Sanctuary",
    tagline: "An off-grid Mediterranean eco-cultural farm",
    location: { place: "Villanueva de Alcolea", region: "Valencia", country: "Spain" },
    landType: "Off-grid eco-farm",
    sizeHa: 22,
    image: "/images/field-golden.jpg",
    story:
      "A sun-baked, off-grid farm in the Mediterranean hills, run with limited connectivity and a lot of intention. Dry-climate growing, water wisdom, and self-reliance are the lessons the land teaches every day.",
    needs: [
      "Establish a dry-climate, no-dig market garden",
      "Build a solar food dryer and seed-saving store",
      "Install drip irrigation fed from the cistern",
    ],
    offers: [
      "An off-grid casita for the resident teacher",
      "Meals from the farm and local village",
      "Tools, beds, and a propagation area",
    ],
    amenities: ["Off-grid solar", "Cistern & wells", "Dry-climate beds", "Quiet hills"],
    inspiredBy: "Off-grid Rewilding Sanctuary, Spain (GoHabitat)",
    listingUrl:
      "https://www.gohabitat.earth/wild-spirit-eco-cultural-farm/87-off-grid-rewilding-sanctuary.html",
  },
];
