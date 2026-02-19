-- Add Vex plan columns to accounts table.
-- vex_plan: the current pricing tier (free/pro/team/enterprise)
-- vex_plan_overrides: optional JSONB with per-org custom limit overrides (enterprise)

ALTER TABLE public.accounts
  ADD COLUMN vex_plan varchar(50) NOT NULL DEFAULT 'free',
  ADD COLUMN vex_plan_overrides jsonb DEFAULT NULL;

-- Add check constraint for valid plan values
ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_vex_plan_valid CHECK (
    vex_plan IN ('free', 'pro', 'team', 'enterprise')
  );

-- Index for plan-based queries (admin dashboard, retention)
CREATE INDEX ix_accounts_vex_plan ON public.accounts (vex_plan);
