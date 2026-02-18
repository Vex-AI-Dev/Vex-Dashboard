# Vex Documentation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic Mintlify starter kit with complete, production-quality Vex documentation covering SDKs, REST API, dashboard, framework guides, and core concepts.

**Architecture:** SDK-first structure organized around developer workflow (install → integrate → verify → monitor). Mintlify MDX pages with CodeGroup tabs for Python/TypeScript dual-SDK examples. OpenAPI 3.1 spec for REST API auto-generated pages.

**Tech Stack:** Mintlify (MDX, docs.json), OpenAPI 3.1, Vex Python SDK (vex-sdk v0.3.0), Vex TypeScript SDK (@vex_dev/sdk v0.1.1)

---

## Phase 1: Foundation — Config, Branding, Cleanup

### Task 1: Delete all Mintlify starter kit content

**Files:**
- Delete: `apps/docs/essentials/` (all 6 files)
- Delete: `apps/docs/ai-tools/` (all 3 files)
- Delete: `apps/docs/api-reference/endpoint/` (all 4 files)
- Delete: `apps/docs/api-reference/introduction.mdx`
- Delete: `apps/docs/api-reference/openapi.json`
- Delete: `apps/docs/snippets/snippet-intro.mdx`
- Delete: `apps/docs/development.mdx`
- Delete: `apps/docs/index.mdx`
- Delete: `apps/docs/quickstart.mdx`

**Step 1:** Delete all files listed above.

**Step 2:** Verify `apps/docs/` only contains: `docs.json`, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE`, `README.md`, `favicon.svg`, `images/`, `logo/`.

**Step 3:** Commit: `chore(docs): remove Mintlify starter kit placeholder content`

### Task 2: Replace brand assets

**Files:**
- Replace: `apps/docs/logo/dark.svg` ← copy from `vex-final/svg/vex-logo-white-transparent.svg`
- Replace: `apps/docs/logo/light.svg` ← copy from `vex-final/svg/vex-logo-dark.svg`
- Replace: `apps/docs/favicon.svg` ← copy from `vex-final/svg/vex-mark-white-transparent.svg`

**Step 1:** Copy the three files as specified above.

**Step 2:** Verify the files exist at their destination paths and are non-zero size.

**Step 3:** Commit: `chore(docs): replace logo and favicon with Vex brand assets`

### Task 3: Rewrite docs.json configuration

**Files:**
- Modify: `apps/docs/docs.json`

**Step 1:** Replace the entire `docs.json` with the Vex-branded configuration:

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Vex Documentation",
  "colors": {
    "primary": "#10b981",
    "light": "#34d399",
    "dark": "#059669"
  },
  "favicon": "/favicon.svg",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "navbar": {
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/Vex-AI-Dev/Python-SDK"
      }
    ],
    "primary": {
      "type": "button",
      "label": "Dashboard",
      "href": "https://app.tryvex.dev"
    }
  },
  "contextual": {
    "options": ["copy", "view", "chatgpt", "claude", "cursor", "vscode"]
  },
  "footer": {
    "socials": {
      "x": "https://x.com/tryvex",
      "github": "https://github.com/Vex-AI-Dev"
    }
  },
  "navigation": {
    "tabs": [
      {
        "tab": "Guides",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["index", "quickstart", "how-vex-works"]
          },
          {
            "group": "Core Concepts",
            "pages": [
              "concepts/async-vs-sync",
              "concepts/correction-cascade",
              "concepts/confidence",
              "concepts/sessions"
            ]
          },
          {
            "group": "Python SDK",
            "pages": [
              "python/installation",
              "python/decorator",
              "python/context-manager",
              "python/sessions",
              "python/configuration",
              "python/error-handling"
            ]
          },
          {
            "group": "TypeScript SDK",
            "pages": [
              "typescript/installation",
              "typescript/tracing",
              "typescript/sessions",
              "typescript/configuration",
              "typescript/error-handling"
            ]
          },
          {
            "group": "Framework Guides",
            "pages": [
              "frameworks/langchain",
              "frameworks/crewai",
              "frameworks/openai-assistants",
              "frameworks/nextjs",
              "frameworks/express"
            ]
          },
          {
            "group": "Dashboard",
            "pages": [
              "dashboard/overview",
              "dashboard/agents",
              "dashboard/sessions",
              "dashboard/failures",
              "dashboard/alerts",
              "dashboard/executions",
              "dashboard/api-keys"
            ]
          }
        ]
      },
      {
        "tab": "API Reference",
        "groups": [
          {
            "group": "Overview",
            "pages": ["api-reference/introduction"]
          },
          {
            "group": "Endpoints",
            "pages": [
              "api-reference/verify",
              "api-reference/ingest",
              "api-reference/webhooks"
            ]
          }
        ]
      }
    ],
    "global": {
      "anchors": [
        {
          "anchor": "GitHub",
          "href": "https://github.com/Vex-AI-Dev/Python-SDK",
          "icon": "github"
        },
        {
          "anchor": "Community",
          "href": "https://x.com/tryvex",
          "icon": "x-twitter"
        }
      ]
    }
  }
}
```

**Step 2:** Verify JSON is valid (no syntax errors).

**Step 3:** Commit: `feat(docs): configure docs.json with Vex branding and navigation`

---

## Phase 2: Getting Started Pages

### Task 4: Create index.mdx (Introduction)

**Files:**
- Create: `apps/docs/index.mdx`

**Content:** Hero with "Your AI agent doesn't crash. It drifts." tagline. Four capability cards: Drift Detection, Execution Tracing, Sync Verification, Correction Cascade. Comparison table (Evals vs Tracing vs Vex). Quick links to Quickstart, Python SDK, TypeScript SDK, API Reference.

Use Mintlify `<Card>`, `<CardGroup>` components. Keep it concise — this page sells the product and routes readers.

**Commit:** `feat(docs): add introduction page`

### Task 5: Create quickstart.mdx

**Files:**
- Create: `apps/docs/quickstart.mdx`

**Content:** Three numbered steps:

1. **Install** — `<CodeGroup>` with `pip install vex-sdk` and `npm install @vex_dev/sdk` tabs
2. **Add tracing** — `<CodeGroup>` showing Python `@guard.watch()` and TypeScript `vex.trace()` minimal examples. Use `your-api-key` placeholder with note to get key from dashboard.
3. **See results** — Description of what appears in dashboard + link to dashboard docs.

End with "What's next?" links to Core Concepts and SDK guides.

**Commit:** `feat(docs): add quickstart guide`

### Task 6: Create how-vex-works.mdx

**Files:**
- Create: `apps/docs/how-vex-works.mdx`

**Content:** Visual explanation of the Vex flow:

1. **Observe** — SDK captures agent input/output/steps → sends to Vex API
2. **Verify** — Server runs checks: schema validation, hallucination detection, task drift, confidence scoring, coherence (multi-turn)
3. **Correct** — If confidence is low, cascade correction attempts repair

Use Mintlify `<Steps>` component. Explain async vs sync at a high level (link to detailed page). Explain what "drift" means — behavioral change without errors.

**Commit:** `feat(docs): add how-vex-works conceptual page`

---

## Phase 3: Core Concepts

### Task 7: Create concepts/async-vs-sync.mdx

**Files:**
- Create: `apps/docs/concepts/async-vs-sync.mdx`

**Content:**

| | Async (default) | Sync |
|---|---|---|
| Latency | Zero added | ~100-200ms |
| Returns | Pass-through immediately | Real confidence + action |
| Use case | Observability, drift detection | Guardrails, blocking bad output |
| Correction | Not available | Available with `correction` |
| API endpoint | POST /v1/ingest/batch | POST /v1/verify |

Code examples for both modes in Python and TypeScript. When to use each. Migration path from async to sync.

**Commit:** `feat(docs): add async-vs-sync concept page`

### Task 8: Create concepts/correction-cascade.mdx

**Files:**
- Create: `apps/docs/concepts/correction-cascade.mdx`

**Content:** Three-layer cascade diagram:

- **Layer 1: Repair** (confidence > 0.5) — gpt-4o-mini surgical fix
- **Layer 2: Constrained Regen** (0.3–0.5) — gpt-4o fresh output with constraints
- **Layer 3: Full Re-prompt** (< 0.3) — gpt-4o full regeneration with failure feedback

Configuration: `correction="cascade"` (Python) / `correction: "auto"` (TypeScript). Transparency modes (opaque vs transparent). Code examples showing `result.corrected`, `result.original_output`, `result.corrections`. Timeout behavior (3x normal timeout for correction).

**Commit:** `feat(docs): add correction cascade concept page`

### Task 9: Create concepts/confidence.mdx

**Files:**
- Create: `apps/docs/concepts/confidence.mdx`

**Content:** ThresholdConfig explanation with defaults (pass=0.8, flag=0.5, block=0.3). How scores map to actions. Customization examples in both SDKs. What each check measures (schema validation, hallucination, task drift, confidence, coherence). VexResult.verification field structure.

**Commit:** `feat(docs): add confidence thresholds concept page`

### Task 10: Create concepts/sessions.mdx

**Files:**
- Create: `apps/docs/concepts/sessions.mdx`

**Content:** Multi-turn conversation tracking. Session creation, sequence numbers, conversation window (default 10 turns). How history enables cross-turn checks (self-contradiction, goal drift, coherence). Code examples in both SDKs. Parent execution linking for tree traces.

**Commit:** `feat(docs): add sessions concept page`

---

## Phase 4: Python SDK

### Task 11: Create python/installation.mdx

**Files:**
- Create: `apps/docs/python/installation.mdx`

**Content:** `pip install vex-sdk`. Requirements: Python 3.9+, httpx, pydantic v2 (auto-installed). Basic initialization with `Vex(api_key=...)`. Environment variable convention (`VEX_API_KEY`). API key validation rules (min 10 chars). Close/cleanup (`guard.close()`).

**Commit:** `feat(docs): add Python SDK installation page`

### Task 12: Create python/decorator.mdx

**Files:**
- Create: `apps/docs/python/decorator.mdx`

**Content:** `@guard.watch()` pattern. Full working example. Parameters: `agent_id` (required), `task` (optional). How input capture works (single arg vs args+kwargs). Return type is `VexResult`, not raw function return. Async vs sync mode behavior. Exception propagation (agent errors pass through).

**Commit:** `feat(docs): add Python decorator pattern page`

### Task 13: Create python/context-manager.mdx

**Files:**
- Create: `apps/docs/python/context-manager.mdx`

**Content:** `with guard.trace(...) as ctx:` pattern. All TraceContext methods: `record()`, `step()`, `set_ground_truth()`, `set_schema()`, `set_token_count()`, `set_cost_estimate()`, `set_metadata()`. Full example with multi-step agent. `guard.run()` alternative. Result access via `ctx.result`.

**Commit:** `feat(docs): add Python context manager pattern page`

### Task 14: Create python/sessions.mdx

**Files:**
- Create: `apps/docs/python/sessions.mdx`

**Content:** `guard.session()` creation. `session.trace()` usage. Auto-incrementing sequence. Conversation history injection. Custom session IDs. Session metadata. `parent_execution_id` for tree tracing.

**Commit:** `feat(docs): add Python sessions page`

### Task 15: Create python/configuration.mdx

**Files:**
- Create: `apps/docs/python/configuration.mdx`

**Content:** Complete `VexConfig` reference table with every parameter, type, default, and description. `ThresholdConfig` sub-table. Examples of common configurations: async observability, sync verification, sync + correction cascade.

**Commit:** `feat(docs): add Python configuration reference page`

### Task 16: Create python/error-handling.mdx

**Files:**
- Create: `apps/docs/python/error-handling.mdx`

**Content:** Exception hierarchy diagram. `VexBlockError` with `e.result` access. `ConfigurationError` causes. Graceful fallback on network errors (sync mode). `VexResult` field reference. Example: try/except with fallback response.

**Commit:** `feat(docs): add Python error handling page`

---

## Phase 5: TypeScript SDK

### Task 17: Create typescript/installation.mdx

**Files:**
- Create: `apps/docs/typescript/installation.mdx`

**Content:** `npm install @vex_dev/sdk`. Requirements: Node.js 18+ / Deno / Bun. Zero runtime dependencies. Basic initialization. `await vex.close()` for cleanup. ESM + CJS support.

**Commit:** `feat(docs): add TypeScript SDK installation page`

### Task 18: Create typescript/tracing.mdx

**Files:**
- Create: `apps/docs/typescript/tracing.mdx`

**Content:** `vex.trace()` callback pattern. TraceContext methods: `record()`, `step()`, `setGroundTruth()`, `setSchema()`, `setTokenCount()`, `setCostEstimate()`, `setMetadata()`. Full working example. Return type is `VexResult`. Async/sync mode behavior.

**Commit:** `feat(docs): add TypeScript tracing page`

### Task 19: Create typescript/sessions.mdx

**Files:**
- Create: `apps/docs/typescript/sessions.mdx`

**Content:** `vex.session()` creation. `session.trace()` usage. Sequence tracking. Conversation history. Custom session IDs and metadata. `parentExecutionId` linking.

**Commit:** `feat(docs): add TypeScript sessions page`

### Task 20: Create typescript/configuration.mdx

**Files:**
- Create: `apps/docs/typescript/configuration.mdx`

**Content:** Complete `VexConfig` / `VexConfigInput` reference table. `ThresholdConfig` sub-table. Note on `correction: 'auto'` vs `'cascade'`. Common configuration examples.

**Commit:** `feat(docs): add TypeScript configuration reference page`

### Task 21: Create typescript/error-handling.mdx

**Files:**
- Create: `apps/docs/typescript/error-handling.mdx`

**Content:** Error class hierarchy. `VexBlockError` with `err.result` access. `ConfigurationError`, `VerificationError`. Network fallback behavior. `VexResult` field reference.

**Commit:** `feat(docs): add TypeScript error handling page`

---

## Phase 6: Framework Guides

### Task 22: Create frameworks/langchain.mdx

**Files:**
- Create: `apps/docs/frameworks/langchain.mdx`

**Content:** LangChain/LangGraph integration. Python: wrap `chain.invoke()` with `@guard.watch()` or `guard.trace()`. TypeScript: wrap with `vex.trace()`. Show both a simple chain and a LangGraph agent. Include step tracing for intermediate tool calls.

**Commit:** `feat(docs): add LangChain framework guide`

### Task 23: Create frameworks/crewai.mdx

**Files:**
- Create: `apps/docs/frameworks/crewai.mdx`

**Content:** CrewAI integration. Wrap crew `kickoff()` with `guard.run()`. Show per-agent tracing with sessions. Step recording for crew tasks.

**Commit:** `feat(docs): add CrewAI framework guide`

### Task 24: Create frameworks/openai-assistants.mdx

**Files:**
- Create: `apps/docs/frameworks/openai-assistants.mdx`

**Content:** OpenAI Assistants / function calling integration. Wrap message creation and run retrieval. Python and TypeScript examples. Step tracing for tool calls.

**Commit:** `feat(docs): add OpenAI Assistants framework guide`

### Task 25: Create frameworks/nextjs.mdx

**Files:**
- Create: `apps/docs/frameworks/nextjs.mdx`

**Content:** Next.js integration patterns. API routes (App Router): initialize Vex as singleton, trace in route handlers. Server Actions: wrap action functions. Edge considerations. Cleanup in shutdown hooks. Based on MoonForge patterns.

**Commit:** `feat(docs): add Next.js framework guide`

### Task 26: Create frameworks/express.mdx

**Files:**
- Create: `apps/docs/frameworks/express.mdx`

**Content:** Express integration. Middleware pattern for automatic tracing. Per-route tracing. Singleton Vex instance. Graceful shutdown with `vex.close()`.

**Commit:** `feat(docs): add Express framework guide`

---

## Phase 7: Dashboard Documentation

### Task 27: Create dashboard/overview.mdx

**Files:**
- Create: `apps/docs/dashboard/overview.mdx`

**Content:** Main dashboard overview. 4 KPI cards (Reliability Score, Verifications, Issues Caught, Auto-Corrected). 24-hour activity chart. Agent health grid. Alert summary panel. Explain what each metric means and how to interpret it.

**Commit:** `feat(docs): add dashboard overview page`

### Task 28: Create dashboard/agents.mdx

**Files:**
- Create: `apps/docs/dashboard/agents.mdx`

**Content:** Fleet health view (5 KPIs, execution chart, agent cards). Agent detail view (confidence over time, action distribution, recent executions). Status badges (Healthy/Degraded/No Data).

**Commit:** `feat(docs): add agents dashboard page`

### Task 29: Create dashboard/sessions.mdx

**Files:**
- Create: `apps/docs/dashboard/sessions.mdx`

**Content:** Session list (filters, status badges). Session detail: conversation replay view with user/assistant bubbles, tool call expansion, verification bars per turn. Fallback timeline view.

**Commit:** `feat(docs): add sessions dashboard page`

### Task 30: Create dashboard/failures.mdx

**Files:**
- Create: `apps/docs/dashboard/failures.mdx`

**Content:** Failures view with 4 filters (Action, Agent, Time Range, Correction Status). Table columns explained. How to investigate a failure (click through to execution detail).

**Commit:** `feat(docs): add failures dashboard page`

### Task 31: Create dashboard/alerts.mdx

**Files:**
- Create: `apps/docs/dashboard/alerts.mdx`

**Content:** Alert management. Severity levels (Critical/High/Medium/Low). Filters. Alert types. Delivery status.

**Commit:** `feat(docs): add alerts dashboard page`

### Task 32: Create dashboard/executions.mdx

**Files:**
- Create: `apps/docs/dashboard/executions.mdx`

**Content:** Execution inspector deep dive. Metadata card. Trace steps (collapsible). Check results table (Schema, Hallucination, Task Drift, Confidence, Coherence). Correction timeline. Output diff view. Raw JSON viewer.

**Commit:** `feat(docs): add executions dashboard page`

### Task 33: Create dashboard/api-keys.mdx

**Files:**
- Create: `apps/docs/dashboard/api-keys.mdx`

**Content:** API key management. Creating keys (name, scopes, rate limit, expiry). Scope descriptions (ingest, verify, read). Revoking keys. Key prefixes and masking. Best practices (separate keys per environment).

**Commit:** `feat(docs): add API keys dashboard page`

---

## Phase 8: API Reference

### Task 34: Create api-reference/introduction.mdx

**Files:**
- Create: `apps/docs/api-reference/introduction.mdx`

**Content:** Base URL (`https://api.tryvex.dev`). Authentication via `X-Vex-Key` header. Rate limiting. Error response format (HTTP status codes, error body structure). Common errors (401, 429, 500).

**Commit:** `feat(docs): add API reference introduction`

### Task 35: Create api-reference/openapi.json

**Files:**
- Create: `apps/docs/api-reference/openapi.json`

**Content:** OpenAPI 3.1 spec covering:

- **POST /v1/verify** — Sync verification. Request: ExecutionEvent with metadata (thresholds, correction, transparency). Response: VexResult (execution_id, confidence, action, output, checks, corrected, original_output, correction_attempts).
- **POST /v1/ingest/batch** — Async batch ingestion. Request: `{"events": [ExecutionEvent]}`. Response: `{"accepted": count}`.
- **Security:** `X-Vex-Key` API key header.
- **Schemas:** ExecutionEvent, StepRecord, ConversationTurn, VexResult, ThresholdConfig, Error.
- **Error responses:** 400 (bad request), 401 (unauthorized), 429 (rate limited), 500 (internal error).

Build this from the actual SDK transport layer code — the request/response shapes in `sdk/python/vex/transport.py` and `sdk/typescript/src/transport/sync.ts`.

**Commit:** `feat(docs): add Vex OpenAPI 3.1 specification`

### Task 36: Create api-reference/verify.mdx and api-reference/ingest.mdx

**Files:**
- Create: `apps/docs/api-reference/verify.mdx`
- Create: `apps/docs/api-reference/ingest.mdx`

**Content:** These are Mintlify OpenAPI-driven pages that reference the spec:

`verify.mdx`:
```yaml
---
title: "Verify Execution"
openapi: "POST /v1/verify"
---
```

`ingest.mdx`:
```yaml
---
title: "Ingest Batch"
openapi: "POST /v1/ingest/batch"
---
```

**Commit:** `feat(docs): add API endpoint pages`

### Task 37: Create api-reference/webhooks.mdx

**Files:**
- Create: `apps/docs/api-reference/webhooks.mdx`

**Content:** Webhook event delivery documentation. Alert webhook payload structure. Configuration in dashboard. Retry behavior. Signature verification (if applicable).

**Commit:** `feat(docs): add webhooks documentation`

---

## Phase 9: Final Polish

### Task 38: Update AGENTS.md and CONTRIBUTING.md

**Files:**
- Modify: `apps/docs/AGENTS.md`
- Modify: `apps/docs/CONTRIBUTING.md`

**Content:** Update both files to reflect Vex docs project context, terminology, and style preferences.

**Commit:** `chore(docs): update AGENTS.md and CONTRIBUTING.md for Vex`

### Task 39: Create shared code snippets

**Files:**
- Create: `apps/docs/snippets/python-install.mdx`
- Create: `apps/docs/snippets/typescript-install.mdx`
- Create: `apps/docs/snippets/vex-result.mdx`

**Content:** Reusable snippets imported by multiple pages to keep install instructions and VexResult field reference DRY.

**Commit:** `feat(docs): add reusable code snippets`

### Task 40: Final review and commit

**Step 1:** Verify all pages referenced in `docs.json` navigation exist.

**Step 2:** Check for broken internal links (all `href` and page references).

**Step 3:** Git add all, commit: `feat(docs): complete Vex documentation site`

**Step 4:** Push to remote.
