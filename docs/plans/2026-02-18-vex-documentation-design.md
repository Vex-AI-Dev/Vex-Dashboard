# Vex Documentation — Complete Rebuild Design

## Context

The docs site at `apps/docs/` is an unmodified Mintlify starter kit with zero Vex content. We need to build production-quality documentation covering both SDKs (Python + TypeScript), the REST API, the dashboard, framework integrations, and core concepts.

**Audience:** Backend/AI engineers integrating Vex + engineering leads evaluating it.

**Platform:** Mintlify (MDX, `docs.json` config, deployed to `docs.tryvex.dev`).

## Architecture: SDK-First (Approach A)

Structure around developer workflow: install → integrate → verify → monitor.

### Navigation Structure

```
Tab 1: "Guides"
├── Group: "Getting Started"
│   ├── index.mdx              — What is Vex + value prop
│   ├── quickstart.mdx         — 5-min: install → first trace → dashboard
│   └── how-vex-works.mdx      — Observe → Verify → Correct flow diagram
│
├── Group: "Core Concepts"
│   ├── async-vs-sync.mdx      — Async (fire-and-forget) vs Sync (inline verification)
│   ├── correction-cascade.mdx — 3 layers: Repair → Constrained Regen → Full Re-prompt
│   ├── confidence.mdx         — Thresholds: pass/flag/block + customization
│   └── sessions.mdx           — Multi-turn tracking, conversation window, coherence
│
├── Group: "Python SDK"
│   ├── python/installation.mdx    — pip install, requirements, env vars
│   ├── python/decorator.mdx       — @guard.watch() pattern
│   ├── python/context-manager.mdx — with guard.trace() pattern
│   ├── python/sessions.mdx        — guard.session() + session.trace()
│   ├── python/configuration.mdx   — VexConfig reference table
│   └── python/error-handling.mdx  — VexBlockError, VexResult, exceptions
│
├── Group: "TypeScript SDK"
│   ├── typescript/installation.mdx    — npm install, requirements
│   ├── typescript/tracing.mdx         — vex.trace() callback pattern
│   ├── typescript/sessions.mdx        — vex.session() + session.trace()
│   ├── typescript/configuration.mdx   — VexConfig reference table
│   └── typescript/error-handling.mdx  — VexBlockError, VexResult, errors
│
├── Group: "Framework Guides"
│   ├── frameworks/langchain.mdx       — LangChain / LangGraph integration
│   ├── frameworks/crewai.mdx          — CrewAI integration
│   ├── frameworks/openai-assistants.mdx — OpenAI Assistants / function calling
│   ├── frameworks/nextjs.mdx          — Next.js API routes + server actions
│   └── frameworks/express.mdx         — Express middleware pattern
│
├── Group: "Dashboard"
│   ├── dashboard/overview.mdx         — Reliability score, KPIs, 24h chart
│   ├── dashboard/agents.mdx           — Fleet health, agent detail, confidence trends
│   ├── dashboard/sessions.mdx         — Session list, conversation replay, turn timeline
│   ├── dashboard/failures.mdx         — Failure analysis, filters, correction status
│   ├── dashboard/alerts.mdx           — Alert management, severity levels
│   ├── dashboard/executions.mdx       — Execution inspector: checks, corrections, diffs
│   └── dashboard/api-keys.mdx         — Key management: scopes, rate limits, expiry

Tab 2: "API Reference"
├── Group: "Overview"
│   ├── api-reference/introduction.mdx — Auth (X-Vex-Key header), base URL, errors
│   └── api-reference/openapi.json     — Full OpenAPI 3.1 spec for Vex API
│
├── Group: "Endpoints"
│   ├── api-reference/verify.mdx       — POST /v1/verify (sync verification)
│   ├── api-reference/ingest.mdx       — POST /v1/ingest/batch (async ingestion)
│   └── api-reference/webhooks.mdx     — Webhook event delivery
```

### Files to Delete (Mintlify starter kit)

All existing content pages — they're generic Mintlify templates:
- `essentials/` (settings, navigation, markdown, code, images, reusable-snippets)
- `ai-tools/` (cursor, claude-code, windsurf)
- `api-reference/endpoint/` (get, create, delete, webhook — Plant Store demo)
- `api-reference/introduction.mdx` (Plant Store intro)
- `api-reference/openapi.json` (Plant Store spec)
- `snippets/snippet-intro.mdx`
- `development.mdx`
- `index.mdx`, `quickstart.mdx`

### Files to Update

- `docs.json` — Complete rewrite: Vex branding, colors (#10b981 emerald), logo paths, navigation structure, navbar links (Dashboard → app.tryvex.dev, GitHub, Support), footer socials (Twitter @tryvex, GitHub Vex-AI-Dev)
- `favicon.svg` — Replace with Vex favicon
- `logo/dark.svg` and `logo/light.svg` — Replace with Vex logos from `vex-final/`
- `AGENTS.md` — Update for Vex docs project context
- `CONTRIBUTING.md` — Update for Vex docs

### Brand Assets Needed

- Copy Vex logo SVGs to `apps/docs/logo/` (dark.svg = vex-logo-white-transparent, light.svg = vex-logo-dark)
- Replace favicon.svg with Vex mark
- Dashboard screenshots (can be placeholder initially, with TODO markers)

### OpenAPI Spec

Create a real OpenAPI 3.1 spec for the Vex API covering:
- `POST /v1/verify` — Sync verification endpoint
- `POST /v1/ingest/batch` — Async batch ingestion endpoint
- Authentication: `X-Vex-Key` header
- Request/response schemas matching the actual SDK transport layer
- Error responses (400, 401, 429, 500)

### Content Principles

- **Code-first:** Every concept page leads with a working code example
- **Dual SDK:** Python and TypeScript tabs on all code examples (using Mintlify CodeGroup)
- **Real patterns:** Use the MoonForge integration patterns as inspiration for framework guides
- **Progressive disclosure:** Quickstart → Concepts → SDK Reference → API Reference
- **No placeholder content:** Every page has real, accurate Vex documentation

### Page Content Summaries

**index.mdx** — Hero: "Your AI agent doesn't crash. It drifts." + 4 capability cards (Drift Detection, Execution Tracing, Sync Verification, Correction Cascade) + comparison table (Evals vs Tracing vs Vex) + quick links

**quickstart.mdx** — 3-step: (1) Install SDK with CodeGroup Python/TS, (2) Add tracing with minimal code, (3) See results in dashboard. Ends with "Next: explore core concepts"

**how-vex-works.mdx** — Visual flow: Agent → Vex SDK → Vex API → Verification Engine → Response. Explains the observe/verify/correct loop.

**async-vs-sync.mdx** — Side-by-side comparison table, when to use each, code examples for both modes

**correction-cascade.mdx** — 3-layer diagram with confidence thresholds. Layer 1: Repair (>0.5, gpt-4o-mini), Layer 2: Constrained Regen (0.3-0.5, gpt-4o), Layer 3: Full Re-prompt (<0.3, gpt-4o). Transparent vs opaque modes.

**confidence.mdx** — ThresholdConfig explanation, default values, customization examples, how scores map to actions

**sessions.mdx** — Multi-turn tracking, conversation window, coherence detection, sequence numbers

**Python SDK pages** — Each page covers one integration pattern with full working examples, parameter tables, and edge cases. Configuration page is a complete reference table.

**TypeScript SDK pages** — Same structure as Python but adapted for TS patterns (callback vs context manager)

**Framework guides** — Each shows a complete working integration: project setup, Vex initialization, wrapping agent calls, handling results. Based on real patterns from MoonForge (batch sync agents, chat async agents).

**Dashboard pages** — Each covers one dashboard view with description of all metrics, filters, and actions available. Screenshot placeholders marked with TODO.

**API Reference** — OpenAPI-driven pages with request/response examples, error codes, and authentication details.
