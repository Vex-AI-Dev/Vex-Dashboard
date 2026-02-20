-- Add 'starter' to the valid plan values CHECK constraint.
-- This is a non-destructive change — existing rows are unaffected.

ALTER TABLE public.accounts
  DROP CONSTRAINT accounts_vex_plan_valid;

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_vex_plan_valid CHECK (
    vex_plan IN ('free', 'starter', 'pro', 'team', 'enterprise')
  );
