import { z } from 'zod';

const RULE_TYPES = [
  'regex',
  'keyword',
  'threshold',
  'llm',
  'tool_policy',
] as const;
const ACTIONS = ['flag', 'block'] as const;

export const CreateGuardrailSchema = z.object({
  accountSlug: z.string().min(1),
  agentId: z.string().nullable().default(null),
  name: z.string().min(1).max(255),
  ruleType: z.enum(RULE_TYPES),
  condition: z.record(z.unknown()),
  action: z.enum(ACTIONS).default('flag'),
});

export const DeleteGuardrailSchema = z.object({
  accountSlug: z.string().min(1),
  guardrailId: z.string().min(1),
});

export const ToggleGuardrailSchema = z.object({
  accountSlug: z.string().min(1),
  guardrailId: z.string().min(1),
  enabled: z.boolean(),
});

export type CreateGuardrailInput = z.infer<typeof CreateGuardrailSchema>;
export type DeleteGuardrailInput = z.infer<typeof DeleteGuardrailSchema>;
export type ToggleGuardrailInput = z.infer<typeof ToggleGuardrailSchema>;
