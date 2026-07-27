# linkroom

A demo of a release link manager I built for a boutique record label. Artists get a
smart link per release (one URL, buttons out to every streaming service), and the
label gets an admin console to manage them.

This repo is a standalone demo fork of the production tool — same code, same UI,
but running entirely on seed data so nothing real (artists, releases, credentials)
is exposed. All the artists in it are made up.

## What it does

**Public link pages** — `/{linkName}` renders a release page with artwork, DSP
buttons, and per-release Open Graph metadata generated server-side, so links
unfurl properly when shared on Discord, Slack, or socials. Try pasting
`/nightdrive` into a Discord message.

**Admin console** — `/home` is the label-side console: searchable release table,
create/edit/delete with validation, artwork upload with dimension checking
(2000×2000 or 3000×3000 PNG only), public/private toggling, and per-release view
counts.

## Stack

- Next.js (App Router) + TypeScript
- HeroUI v3 + Tailwind
- In-memory data layer (demo only — production runs Postgres via Prisma)

## How the demo differs from production

The production version runs on a self-hosted Postgres database with Prisma,
NextAuth (Google/GitHub OAuth) with a roles system scoping artists to their own
releases, and artwork uploads to object storage. For the demo:

- The database is replaced by an in-memory array (`lib/demo-releases.ts`), so
  changes persist for the life of the server process and reset on restart
- Auth and the roles system are stripped out — everything is open
- Artwork "uploads" are encoded as base64 data URLs client-side instead of
  hitting real storage

Everything else — the routing, the metadata generation, the server/client
component split, the console UI — is the production code.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The root redirects to the console; the three
seeded releases are at `/nightdrive`, `/glasshouse`, and `/static`.

## Things worth a look

- `app/[slug]/page.tsx` — dynamic `generateMetadata` producing per-release OG
  tags from the slug
- `app/[slug]/client.tsx` — the public release page, with the DSP buttons driven
  by a single platform config
- `lib/demo-releases.ts` — the in-memory stand-in for the database, including
  uniqueness checks mirroring the production constraints
- `components/pages/ReleasesPage.tsx` — the console table with search, edit, and
  delete flows
