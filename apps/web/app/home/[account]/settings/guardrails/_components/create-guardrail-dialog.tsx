'use client';

import { useEffect, useState, useTransition } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@kit/ui/button';
import { Checkbox } from '@kit/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';

import { createGuardrailAction } from '../_lib/server/guardrails-actions';

type RuleType = 'regex' | 'keyword' | 'threshold' | 'llm' | 'tool_policy';
type Action = 'flag' | 'block';

interface CreateGuardrailDialogProps {
  accountSlug: string;
}

export default function CreateGuardrailDialog({
  accountSlug,
}: CreateGuardrailDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('keyword');
  const [action, setAction] = useState<Action>('flag');
  const [agentId, setAgentId] = useState('');

  // Regex condition
  const [pattern, setPattern] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(true);

  // Keyword condition
  const [keywords, setKeywords] = useState('');

  // Threshold condition
  const [metric, setMetric] = useState('token_count');
  const [operator, setOperator] = useState('>');
  const [limit, setLimit] = useState('');

  // LLM condition
  const [llmDescription, setLlmDescription] = useState('');

  // Tool policy condition
  const [toolName, setToolName] = useState('');
  const [toolPolicy, setToolPolicy] = useState<'deny' | 'allow'>('deny');
  const [maxCalls, setMaxCalls] = useState('');

  // Prefill from URL params (from anomaly card "Create Guardrail" link)
  const searchParams = useSearchParams();
  const prefillTool = searchParams.get('prefill_tool');
  const prefillAgent = searchParams.get('prefill_agent');
  useEffect(() => {
    if (prefillTool) {
      queueMicrotask(() => {
        setOpen(true);
        setRuleType('tool_policy');
        setToolName(prefillTool);
        setToolPolicy('deny');
        setAction('block');
        setName(`Block ${prefillTool}`);
        if (prefillAgent) setAgentId(prefillAgent);
      });
    }
  }, [prefillTool, prefillAgent]);

  function resetForm() {
    setName('');
    setRuleType('keyword');
    setAction('flag');
    setAgentId('');
    setPattern('');
    setIgnoreCase(true);
    setKeywords('');
    setMetric('token_count');
    setOperator('>');
    setLimit('');
    setLlmDescription('');
    setToolName('');
    setToolPolicy('deny');
    setMaxCalls('');
  }

  function buildCondition(): Record<string, unknown> {
    switch (ruleType) {
      case 'regex':
        return { pattern, ignore_case: ignoreCase };
      case 'keyword':
        return {
          keywords: keywords
            .split('\n')
            .map((k) => k.trim())
            .filter(Boolean),
          ignore_case: ignoreCase,
        };
      case 'threshold':
        return { metric, operator, limit: parseFloat(limit) };
      case 'llm':
        return { description: llmDescription };
      case 'tool_policy': {
        const cond: Record<string, unknown> = {
          tool_name: toolName,
          policy: toolPolicy,
        };
        if (toolPolicy === 'allow' && maxCalls) {
          cond.max_calls_per_execution = parseInt(maxCalls, 10);
        }
        return cond;
      }
    }
  }

  function isFormValid(): boolean {
    if (!name.trim()) return false;

    switch (ruleType) {
      case 'regex':
        return pattern.trim().length > 0;
      case 'keyword':
        return keywords.trim().length > 0;
      case 'threshold':
        return limit.trim().length > 0 && !isNaN(parseFloat(limit));
      case 'llm':
        return llmDescription.trim().length > 0;
      case 'tool_policy':
        if (!toolName.trim()) return false;
        if (toolPolicy === 'allow' && maxCalls) {
          return !isNaN(parseInt(maxCalls, 10));
        }
        return true;
    }
  }

  function handleCreate() {
    startTransition(async () => {
      await createGuardrailAction({
        accountSlug,
        name: name.trim(),
        ruleType,
        condition: buildCondition(),
        action,
        agentId: agentId.trim() || null,
      });

      setOpen(false);
      resetForm();
      router.refresh();
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Trans i18nKey="agentguard:guardrails.createGuardrail" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="agentguard:guardrails.createGuardrail" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="agentguard:guardrails.createGuardrailDescription" />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="guardrail-name">
              <Trans i18nKey="agentguard:guardrails.ruleName" />
            </Label>
            <Input
              id="guardrail-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Block PII, Profanity Filter"
              maxLength={255}
            />
          </div>

          {/* Rule Type */}
          <div className="space-y-2">
            <Label>
              <Trans i18nKey="agentguard:guardrails.ruleTypeLabel" />
            </Label>
            <Select
              value={ruleType}
              onValueChange={(v) => setRuleType(v as RuleType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regex">Regex</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
                <SelectItem value="threshold">Threshold</SelectItem>
                <SelectItem value="llm">LLM</SelectItem>
                <SelectItem value="tool_policy">
                  <Trans i18nKey="agentguard:guardrails.ruleTypeToolPolicy" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action */}
          <div className="space-y-2">
            <Label>
              <Trans i18nKey="agentguard:guardrails.actionLabel" />
            </Label>
            <Select
              value={action}
              onValueChange={(v) => setAction(v as Action)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flag">Flag</SelectItem>
                <SelectItem value="block">Block</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agent ID */}
          <div className="space-y-2">
            <Label htmlFor="guardrail-agent-id">
              <Trans i18nKey="agentguard:guardrails.agentIdLabel" />
            </Label>
            <Input
              id="guardrail-agent-id"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Leave blank for org-wide"
            />
          </div>

          {/* Dynamic Condition */}
          <div className="space-y-2">
            <Label>
              <Trans i18nKey="agentguard:guardrails.conditionLabel" />
            </Label>

            {ruleType === 'regex' && (
              <div className="space-y-3">
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g., \b\d{3}-\d{2}-\d{4}\b"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignore-case"
                    checked={ignoreCase}
                    onCheckedChange={(v) => setIgnoreCase(v === true)}
                  />
                  <Label htmlFor="ignore-case" className="text-sm font-normal">
                    <Trans i18nKey="agentguard:guardrails.ignoreCaseLabel" />
                  </Label>
                </div>
              </div>
            )}

            {ruleType === 'keyword' && (
              <div className="space-y-3">
                <Textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={'confidential\nsecret\npassword'}
                  rows={4}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignore-case-kw"
                    checked={ignoreCase}
                    onCheckedChange={(v) => setIgnoreCase(v === true)}
                  />
                  <Label
                    htmlFor="ignore-case-kw"
                    className="text-sm font-normal"
                  >
                    <Trans i18nKey="agentguard:guardrails.ignoreCaseLabel" />
                  </Label>
                </div>
              </div>
            )}

            {ruleType === 'threshold' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">
                    <Trans i18nKey="agentguard:guardrails.metricLabel" />
                  </Label>
                  <Select value={metric} onValueChange={setMetric}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="token_count">token_count</SelectItem>
                      <SelectItem value="cost_estimate">
                        cost_estimate
                      </SelectItem>
                      <SelectItem value="latency_ms">latency_ms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    <Trans i18nKey="agentguard:guardrails.operatorLabel" />
                  </Label>
                  <Select value={operator} onValueChange={setOperator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">&gt;</SelectItem>
                      <SelectItem value=">=">&gt;=</SelectItem>
                      <SelectItem value="<">&lt;</SelectItem>
                      <SelectItem value="<=">&lt;=</SelectItem>
                      <SelectItem value="==">==</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    <Trans i18nKey="agentguard:guardrails.limitLabel" />
                  </Label>
                  <Input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="4000"
                  />
                </div>
              </div>
            )}

            {ruleType === 'llm' && (
              <Textarea
                value={llmDescription}
                onChange={(e) => setLlmDescription(e.target.value)}
                placeholder="Describe what the rule checks in plain English"
                rows={3}
              />
            )}

            {ruleType === 'tool_policy' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">
                    <Trans i18nKey="agentguard:guardrails.toolNameLabel" />
                  </Label>
                  <Input
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g., web_search, send_email"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    <Trans i18nKey="agentguard:guardrails.policyLabel" />
                  </Label>
                  <Select
                    value={toolPolicy}
                    onValueChange={(v) => setToolPolicy(v as 'deny' | 'allow')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deny">
                        <Trans i18nKey="agentguard:guardrails.policyDeny" />
                      </SelectItem>
                      <SelectItem value="allow">
                        <Trans i18nKey="agentguard:guardrails.policyAllow" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {toolPolicy === 'allow' && (
                  <div className="space-y-1">
                    <Label className="text-xs">
                      <Trans i18nKey="agentguard:guardrails.maxCallsLabel" />
                    </Label>
                    <Input
                      type="number"
                      value={maxCalls}
                      onChange={(e) => setMaxCalls(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={pending}
          >
            <Trans i18nKey="agentguard:guardrails.cancel" />
          </Button>
          <Button onClick={handleCreate} disabled={!isFormValid() || pending}>
            <Trans i18nKey="agentguard:guardrails.create" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
