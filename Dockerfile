# ---------------------------------------------------------------------------
# Dashboard – Multi-stage Docker build (Next.js standalone in Turborepo)
# Build context: repository root  (docker build -f Dashboard/Dockerfile .)
# ---------------------------------------------------------------------------

# ---- Stage 0: base --------------------------------------------------------
FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ---- Stage 1: deps --------------------------------------------------------
FROM base AS deps

WORKDIR /app

# Copy workspace configuration first
COPY Dashboard/pnpm-lock.yaml ./pnpm-lock.yaml
COPY Dashboard/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY Dashboard/package.json ./package.json

# Copy all workspace package.json files to satisfy pnpm install
# -- apps
COPY Dashboard/apps/web/package.json ./apps/web/package.json
COPY Dashboard/apps/dev-tool/package.json ./apps/dev-tool/package.json
COPY Dashboard/apps/e2e/package.json ./apps/e2e/package.json
COPY Dashboard/apps/landing/package.json ./apps/landing/package.json

# -- packages (top-level)
COPY Dashboard/packages/analytics/package.json ./packages/analytics/package.json
COPY Dashboard/packages/database-webhooks/package.json ./packages/database-webhooks/package.json
COPY Dashboard/packages/email-templates/package.json ./packages/email-templates/package.json
COPY Dashboard/packages/i18n/package.json ./packages/i18n/package.json
COPY Dashboard/packages/mcp-server/package.json ./packages/mcp-server/package.json
COPY Dashboard/packages/next/package.json ./packages/next/package.json
COPY Dashboard/packages/otp/package.json ./packages/otp/package.json
COPY Dashboard/packages/policies/package.json ./packages/policies/package.json
COPY Dashboard/packages/shared/package.json ./packages/shared/package.json
COPY Dashboard/packages/supabase/package.json ./packages/supabase/package.json
COPY Dashboard/packages/ui/package.json ./packages/ui/package.json

# -- packages (nested workspaces under packages/**)
COPY Dashboard/packages/billing/core/package.json ./packages/billing/core/package.json
COPY Dashboard/packages/billing/gateway/package.json ./packages/billing/gateway/package.json
COPY Dashboard/packages/billing/lemon-squeezy/package.json ./packages/billing/lemon-squeezy/package.json
COPY Dashboard/packages/billing/stripe/package.json ./packages/billing/stripe/package.json
COPY Dashboard/packages/cms/core/package.json ./packages/cms/core/package.json
COPY Dashboard/packages/cms/keystatic/package.json ./packages/cms/keystatic/package.json
COPY Dashboard/packages/cms/types/package.json ./packages/cms/types/package.json
COPY Dashboard/packages/cms/wordpress/package.json ./packages/cms/wordpress/package.json
COPY Dashboard/packages/features/accounts/package.json ./packages/features/accounts/package.json
COPY Dashboard/packages/features/admin/package.json ./packages/features/admin/package.json
COPY Dashboard/packages/features/auth/package.json ./packages/features/auth/package.json
COPY Dashboard/packages/features/notifications/package.json ./packages/features/notifications/package.json
COPY Dashboard/packages/features/team-accounts/package.json ./packages/features/team-accounts/package.json
COPY Dashboard/packages/mailers/core/package.json ./packages/mailers/core/package.json
COPY Dashboard/packages/mailers/nodemailer/package.json ./packages/mailers/nodemailer/package.json
COPY Dashboard/packages/mailers/resend/package.json ./packages/mailers/resend/package.json
COPY Dashboard/packages/mailers/shared/package.json ./packages/mailers/shared/package.json
COPY Dashboard/packages/monitoring/api/package.json ./packages/monitoring/api/package.json
COPY Dashboard/packages/monitoring/core/package.json ./packages/monitoring/core/package.json
COPY Dashboard/packages/monitoring/sentry/package.json ./packages/monitoring/sentry/package.json

# -- tooling
COPY Dashboard/tooling/eslint/package.json ./tooling/eslint/package.json
COPY Dashboard/tooling/prettier/package.json ./tooling/prettier/package.json
COPY Dashboard/tooling/scripts/package.json ./tooling/scripts/package.json
COPY Dashboard/tooling/typescript/package.json ./tooling/typescript/package.json

# Copy the scripts tooling source so the preinstall hook succeeds
COPY Dashboard/tooling/scripts/src ./tooling/scripts/src

RUN pnpm install --frozen-lockfile

# ---- Stage 2: builder -----------------------------------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/ ./
COPY Dashboard/ .

# Build-time environment variables (self-hosting defaults)
ENV NEXT_PUBLIC_SITE_URL=https://localhost:3000
# Skip HTTPS-only validation during build (overridden at runtime)
ENV NEXT_PUBLIC_CI=true
ENV NEXT_PUBLIC_PRODUCT_NAME=Vex
ENV NEXT_PUBLIC_SITE_TITLE="Vex - Runtime Reliability for AI Agents"
ENV NEXT_PUBLIC_SITE_DESCRIPTION="Vex is the runtime reliability layer for AI agents in production."
ENV NEXT_PUBLIC_DEFAULT_THEME_MODE=light
ENV NEXT_PUBLIC_THEME_COLOR="#ffffff"
ENV NEXT_PUBLIC_THEME_COLOR_DARK="#0a0a0a"
ENV NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
ENV NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=true
ENV NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION=true
ENV NEXT_PUBLIC_AUTH_PASSWORD=true
ENV NEXT_TELEMETRY_DISABLED=1

# Supabase placeholders – required at build time but overridden at runtime
ENV NEXT_PUBLIC_SUPABASE_URL=http://localhost:8443
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder

# Billing / Stripe – not required for self-hosting
ENV NEXT_PUBLIC_BILLING_PROVIDER=stripe
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=placeholder

# Email / Mailer – required at build time for server-side module evaluation
ENV EMAIL_SENDER=noreply@localhost
ENV MAILER_PROVIDER=nodemailer

# CMS
ENV CMS_CLIENT=keystatic
ENV NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH=./content

# Server-only placeholders – only needed at build time, not baked into the image
ARG SUPABASE_SERVICE_ROLE_KEY=placeholder
ARG SUPABASE_DB_WEBHOOK_SECRET=placeholder-webhook-secret

RUN pnpm --filter web build

# ---- Stage 3: runner -------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone output (includes node_modules and server.js at root)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

# Copy static assets and public files into the web app directory
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
