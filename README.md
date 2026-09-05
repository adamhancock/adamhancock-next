# adamhancock.co.uk

Personal site and blog for Adam Hancock.

Next.js 16 static export, served from Cloudflare. Pushing to `main` builds and deploys automatically, nothing to run locally.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn-style components in `src/components/ui`
- Blog content in `content/blog` as Markdown, rendered with `next-mdx-remote` and Shiki code highlighting
- OpenPanel analytics, proxied through the `/ingest` route in `_worker.ts`

## Develop

```bash
npm install
npm run dev
```

## Content

Blog posts live in `content/blog/<slug>.md`. The slug comes from the filename.

Frontmatter:

```yaml
---
title: Post title
date: "2026-01-30"        # YYYY-MM-DD
tags: ["Kubernetes", "DevOps"]
excerpt: One or two sentences for listings and SEO.
updated: "2026-02-01"      # optional
---
```

Posts sort by date descending. The three most recent appear on the homepage.

## Build

```bash
npm run build   # static export to out/
```

## Deploy

Automatic. Merging to `main` triggers a Cloudflare build that serves `./out`. `_worker.ts` handles the OpenPanel ingest proxy and 301 redirects (old Ghost-era URLs, the Clawdbot to OpenClaw rename).

Wrangler is not needed for deploys.
