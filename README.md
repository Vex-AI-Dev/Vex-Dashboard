# Vex Dashboard

**The web dashboard and marketing site for [Vex](https://tryvex.dev).**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](../LICENSING.md)

## Overview

This is the Next.js application that powers the Vex dashboard — where teams monitor AI agent behavior, configure guardrails, manage API keys, and review alerts. It also includes the public marketing site and documentation landing pages.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** (Postgres, Auth, Storage)
- **Tailwind CSS 4** + Shadcn UI
- **Turborepo** monorepo
- **Stripe** for billing

## Getting Started

```bash
# Install dependencies
pnpm install

# Start local Supabase
pnpm supabase:web:start

# Copy environment variables
cp apps/web/.env.development.example apps/web/.env.development
# Fill in your credentials in .env.development

# Start development server
pnpm dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
apps/
├── web/          # Main Next.js application
│   ├── app/      # App Router pages and API routes
│   ├── config/   # Feature flags, navigation, billing config
│   └── supabase/ # Database schemas and migrations
└── e2e/          # Playwright end-to-end tests

packages/
├── ui/           # Shared UI components (@kit/ui)
├── supabase/     # Supabase client utilities
├── features/     # Feature packages
└── next/         # Next.js utilities (actions, routes)
```

## Commands

```bash
pnpm dev                      # Start development server
pnpm build                    # Production build
pnpm typecheck                # Type check all packages
pnpm lint:fix                 # Fix linting issues
pnpm format:fix               # Format code with Prettier
pnpm supabase:web:start       # Start local Supabase
pnpm supabase:web:reset       # Reset local database
pnpm supabase:web:typegen     # Generate TypeScript types
```

## Environment Variables

Copy `apps/web/.env.development.example` to `apps/web/.env.development` and fill in your credentials. Never commit `.env.development` — it is gitignored.

## License

This project is licensed under [GNU AGPL v3](../LICENSING.md). See the root repository's [LICENSING.md](../LICENSING.md) for full details.

---

Part of the [Vex](https://github.com/Vex-AI-Dev/AgentGuard) monorepo.
