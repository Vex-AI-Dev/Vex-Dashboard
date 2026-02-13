-- Add onboarding state columns to accounts table.
-- These track whether a team account has completed the onboarding wizard
-- and which step they are on (for resume support).

ALTER TABLE public.accounts
  ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN onboarding_step integer NOT NULL DEFAULT 0;

-- Mark all existing accounts as onboarded so they are not blocked
UPDATE public.accounts SET onboarding_completed = true;
