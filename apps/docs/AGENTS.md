# Vex Documentation

## About this project

- Documentation site for [Vex](https://tryvex.dev) — runtime reliability for AI agents
- Built on [Mintlify](https://mintlify.com), deployed to `docs.tryvex.dev`
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Structure

| Directory | Content |
|-----------|---------|
| Root (`*.mdx`) | Getting Started (index, quickstart, how-vex-works) |
| `concepts/` | Core Concepts (async-vs-sync, correction-cascade, confidence, sessions) |
| `python/` | Python SDK reference (6 pages) |
| `typescript/` | TypeScript SDK reference (5 pages) |
| `frameworks/` | Framework integration guides (LangChain, CrewAI, OpenAI Assistants, Next.js, Express) |
| `dashboard/` | Dashboard documentation (7 pages) |
| `api-reference/` | REST API reference + OpenAPI spec |
| `snippets/` | Reusable MDX snippets |

## Terminology

- **Vex** — the product name, always capitalized
- **agent** — the AI agent being monitored (not "bot" or "model")
- **trace** / **tracing** — recording an agent execution
- **execution** — a single agent invocation with input/output
- **session** — a group of related executions (e.g., a conversation)
- **confidence** — 0–1 quality score from verification
- **action** — pass, flag, or block
- **drift** — behavioral change without errors
- **correction cascade** — three-layer auto-correction (repair → constrained regen → re-prompt)
- Use `guard` for Python SDK variable name, `vex` for TypeScript

## Style preferences

- Active voice and second person ("you")
- Code-first: every concept page leads with a working example
- Dual SDK: use `<CodeGroup>` with Python and TypeScript tabs
- Sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## SDK versions

- Python: `vex-sdk` v0.3.0
- TypeScript: `@vex_dev/sdk` v0.1.1
