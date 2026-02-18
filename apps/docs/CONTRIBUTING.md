# Contributing to Vex Documentation

Thank you for your interest in contributing to the Vex docs!

## How to contribute

### Option 1: Edit on GitHub

1. Navigate to the page you want to edit
2. Click the edit button (pencil icon)
3. Make your changes and submit a pull request

### Option 2: Local development

1. Fork and clone the [Dashboard repository](https://github.com/Vex-AI-Dev/Dashboard)
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Navigate to `apps/docs/` and run `mint dev`
5. Preview your changes at `http://localhost:3000`
6. Commit and submit a pull request

## Writing guidelines

- **Code first**: Lead with a working code example, then explain
- **Dual SDK**: Include both Python and TypeScript examples using `<CodeGroup>`
- **Active voice**: "Run the command" not "The command should be run"
- **Address the reader**: Use "you" instead of "the user"
- **One idea per sentence**: Keep it concise
- **Use consistent terminology**: See `AGENTS.md` for the glossary

## Page structure

Every documentation page should have:

1. YAML frontmatter with `title`, `sidebarTitle` (if different), and `description`
2. A brief introduction (1-2 sentences)
3. A working code example (for SDK/concept pages)
4. Detailed explanation
5. Navigation links to related pages (using `<CardGroup>`)
