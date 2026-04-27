# Botlane Light

Marketing site for Botlane's pipeline-as-a-service offer, built with Next.js App Router.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - run production build locally
- `npm run lint` - run ESLint checks
- `npm run typecheck` - run TypeScript checks

## Environment Variables

- `LEAD_WEBHOOK_URL` (optional) - receives form submissions from `/api/leads` as JSON payload.
- `ANALYTICS_WEBHOOK_URL` (optional) - receives event payloads from `/api/events`.

## Project Structure

- `src/app` - routes and page-level layout
- `src/components` - shared UI components (header, footer, transitions)
- `.github/workflows/ci.yml` - CI checks for typecheck, lint, and build

## Key Routes

- `/` - homepage
- `/how-it-works`
- `/metrics`
- `/pricing`
- `/contact`
- `/book-call`
- `/about`
- `/case-studies`
- `/faq`
- `/privacy`
- `/terms`

## Quality and Release

Before opening or merging a PR:

```bash
npm run typecheck
npm run lint
npm run build
```

CI runs the same checks automatically on pull requests and pushes to `main`.
