# Grass Roots

**Learn by doing. Teach by living.**

Grass Roots is a three-sided marketplace for hands-on, land-based learning at
regenerative farms, homesteads, and eco-building sites. Students learn crafts
like natural building, beekeeping, herbalism, and food-forest design by doing
them on real land; teachers design and lead residencies for a living; and hosts
open their land and get the regenerative work it needs done.

🌱 **Live demo:** [grassroots.earth](https://grassroots.earth)

> This is a demonstration. The courses, host sites, teachers, and listings are
> illustrative, and nothing is bookable or charged. It shares a regenerative
> thesis with, and seeds its host data from, [GoHabitat](https://www.gohabitat.earth).

## The hero feature: the Residency Studio

A teacher brings a skill, gets matched to a host site whose land needs it, and a
complete, editable, ready-to-publish course is generated for them in minutes:
schedule, student outcomes, materials, suggested pricing and earnings, a
listing description, and a pitch to the host. They can refine it in plain
language ("make it more hands-on"), edit any field inline, and publish it as a
live listing students can find and reserve.

Powered by Claude (`claude-opus-4-8`) with streamed responses.

## What's built

- **Three-sided marketplace** — courses and residencies, host sites, teacher
  profiles, with browse and craft filtering.
- **The Residency Studio** — AI residency design, conversational refine, full
  inline editing, save, and publish.
- **Smart matching** — teachers are matched to host sites whose projects fit
  their craft.
- **A living map** — host sites across Europe on an interactive Mapbox map with
  clustering and a craft filter.
- **Real accounts** — Google sign-in with three roles (student / teacher /
  host), saved residencies, published listings, reservations, and a per-role
  dashboard.
- **Host tooling** — hosts claim sites, post the projects their land needs, and
  see live residencies and matching teachers.
- **Listing management** — owners edit their listings, including uploading a
  photo from their device.
- **Lead capture** — request-to-join, host applications, and a waitlist, all
  persisted.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Firebase** — Auth (Google), Firestore, Storage
- **Mapbox GL** — the host-site map
- **Anthropic Claude** — the Residency Studio and matching
- **Netlify** — hosting and serverless functions
- **Google Analytics 4**

## Steward-ownership

Grass Roots is being built to be steward-owned (a Dutch
[STAK](https://grassroots.earth/about) structure): held in trust for its
purpose rather than sold, with profits flowing back to teachers, hosts, and the
land. See the [About page](https://grassroots.earth/about).

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See `.env.example`. You'll need:

- `ANTHROPIC_API_KEY` — powers the Residency Studio and matching (server-side).
- `NEXT_PUBLIC_MAPBOX_TOKEN` — the host-site map.
- `NEXT_PUBLIC_FIREBASE_*` — the Firebase web config (Auth, Firestore, Storage).
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 (optional).

### Firebase

Auth (Google provider), Firestore, and Storage back the dynamic features.
Security rules live in `firestore.rules` and `storage.rules`:

```bash
firebase deploy --only firestore:rules,storage
```

## Deployment

Pushes to `main` deploy to Netlify automatically. The catalog (courses, hosts,
teachers) is curated static data; user-generated data (accounts, listings,
reservations, leads) lives in Firestore.

## License

Demonstration project, built for a hackathon. Photographs are from Unsplash and
illustrative; people pictured are not affiliated with Grass Roots.
