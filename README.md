# Bright Data SEO Marking SaaS

An AI-powered SEO scoring and reporting platform. It pulls live, unblocked web data via **Bright Data**, runs it through an **AI analysis pipeline**, and turns the result into a scored, chart-driven SEO report — all served through a real-time **Next.js + Convex** app with **Clerk** authentication.

> This README describes the project based on its current codebase and structure. Update the sections below (screenshots, live links, exact scoring criteria) as the product evolves.

## What it does

- **Fetches real web data** for a target site/keyword set using Bright Data (SERP results, page content, competitor signals) instead of relying on stale or self-reported data.
- **Scores and "marks" SEO health** — on-page, technical, and competitive signals are analyzed by an LLM using structured prompts and turned into a report card / score.
- **Generates AI-written reports** summarizing findings, strengths, weaknesses, and recommended fixes.
- **Visualizes results** with interactive charts and dashboards (Recharts) so scores and trends are easy to read at a glance.
- **Updates in real time** — report generation status and results stream to the UI live via Convex's reactive queries, no polling required.
- **Gates access with auth** — users sign in with Clerk before running or viewing reports.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Backend / Database | [Convex](https://convex.dev/) (reactive backend-as-a-service) |
| Auth | [Clerk](https://clerk.com/) |
| Web data | [Bright Data](https://brightdata.com/) (SERP / Web Unlocker) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/) + OpenAI |
| UI | Tailwind CSS, Radix UI, shadcn-style components, Lucide icons |
| Charts | [Recharts](https://recharts.org/) |
| Validation | [Zod](https://zod.dev/) |

## Project structure

```
.
├── actions/       # Server actions (data fetching, report generation, mutations)
├── app/           # Next.js App Router pages, layouts, and API routes
├── components/    # Reusable UI components
├── convex/        # Convex schema, queries, mutations, and backend functions
├── lib/           # Shared utilities and helpers
├── prompts/       # AI prompt templates used for SEO analysis/scoring
├── public/        # Static assets
└── proxy.ts        # Bright Data proxy/request configuration
```

## Getting started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account
- A [Bright Data](https://brightdata.com/) account with an API token
- An [OpenAI](https://platform.openai.com/) API key

### Installation

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Bright Data
BRIGHTDATA_API_TOKEN=your_brightdata_api_token

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

> Check `convex/auth.config.ts` and `proxy.ts` for any additional variables your deployment expects — add them here as the project grows.

### Run locally

```bash
npm run dev
```

This runs the Next.js frontend and the Convex dev backend in parallel. On first run, Convex will prompt you to log in and link a deployment.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Lint the codebase
```

## Roadmap ideas

- [ ] Additional Bright Data sources beyond SERP (e.g. backlink or competitor datasets)
- [ ] Historical score tracking / trend charts over time
- [ ] Shareable/exportable report links
- [ ] Team workspaces and billing

## Contributing

Issues and pull requests are welcome. Please open an issue to discuss significant changes before submitting a PR.

## License

Add a license (e.g. MIT) here if you intend for others to reuse this code.