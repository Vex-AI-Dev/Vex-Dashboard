'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Trans } from '@kit/ui/trans';

interface DocsContentProps {
  accountSlug: string;
}

export function DocsContent({ accountSlug }: DocsContentProps) {
  return (
    <div className="flex max-w-4xl flex-1 flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          <Trans i18nKey="agentguard:docs.pageTitle" />
        </h1>

        <p className="text-muted-foreground mt-1">
          <Trans i18nKey="agentguard:docs.pageDescription" />
        </p>
      </div>

      <InstallationSection />
      <QuickStartSection />
      <ConfigurationSection />
      <IntegrationPatternsSection />
      <SessionsSection />
      <SyncVerificationSection />
      <CorrectionCascadeSection />
      <ErrorHandlingSection />
      <ThresholdsSection accountSlug={accountSlug} />
      <FullExampleSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Code Block with copy button                                       */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  language = 'python',
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="bg-muted text-muted-foreground hover:text-foreground absolute top-2 right-2 rounded-md border px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <pre className="bg-muted overflow-x-auto rounded-lg border p-4">
        <code className={`language-${language} text-sm leading-relaxed`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsible section wrapper                                       */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  description,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card id={id}>
      <details open={defaultOpen || undefined}>
        <summary className="cursor-pointer list-none">
          <CardHeader>
            <CardTitle className="text-lg">
              <Trans i18nKey={title} />
            </CardTitle>

            {description && (
              <CardDescription>
                <Trans i18nKey={description} />
              </CardDescription>
            )}
          </CardHeader>
        </summary>

        <CardContent>{children}</CardContent>
      </details>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Installation                                                   */
/* ------------------------------------------------------------------ */

function InstallationSection() {
  return (
    <Section id="installation" title="agentguard:docs.installation" defaultOpen>
      <div className="space-y-3">
        <CodeBlock code="pip install agentx-sdk" language="bash" />

        <p className="text-muted-foreground text-sm">
          Requires Python 3.9 or later. The package is imported as{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            agentguard
          </code>
          .
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Quick Start                                                    */
/* ------------------------------------------------------------------ */

const QUICK_START = `from agentguard import AgentGuard

guard = AgentGuard(api_key="your-api-key")

@guard.watch(agent_id="my-agent", task="Answer questions")
def my_agent(query: str) -> str:
    return llm.generate(query)

result = my_agent("What is AgentGuard?")
print(result.output)       # The agent's response
print(result.confidence)   # Reliability score (0-1)
print(result.action)       # "pass", "flag", or "block"`;

function QuickStartSection() {
  return (
    <Section id="quick-start" title="agentguard:docs.quickStart" defaultOpen>
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Wrap any agent function with a single decorator to get reliability
          scoring on every call.
        </p>

        <CodeBlock code={QUICK_START} />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Configuration                                                  */
/* ------------------------------------------------------------------ */

const CONFIG_OPTIONS: Array<{
  name: string;
  type: string;
  defaultVal: string;
  description: string;
}> = [
  {
    name: 'mode',
    type: '"async" | "sync"',
    defaultVal: '"async"',
    description:
      'Async fires-and-forgets; sync blocks for a verification score.',
  },
  {
    name: 'correction',
    type: '"none" | "cascade"',
    defaultVal: '"none"',
    description:
      'Enable 3-layer auto-correction cascade on low-confidence outputs.',
  },
  {
    name: 'transparency',
    type: '"opaque" | "transparent"',
    defaultVal: '"opaque"',
    description: 'Transparent exposes correction metadata in GuardResult.',
  },
  {
    name: 'api_url',
    type: 'str',
    defaultVal: '"https://api.agentguard.dev"',
    description: 'AgentGuard backend URL.',
  },
  {
    name: 'timeout_s',
    type: 'float',
    defaultVal: '2.0',
    description: 'Timeout in seconds for sync verification calls.',
  },
  {
    name: 'conversation_window_size',
    type: 'int',
    defaultVal: '10',
    description: 'Number of prior turns sent for multi-turn coherence checks.',
  },
  {
    name: 'confidence_threshold',
    type: 'ThresholdConfig',
    defaultVal: 'pass=0.8, flag=0.5, block=0.3',
    description: 'Custom thresholds for pass / flag / block actions.',
  },
];

function ConfigurationSection() {
  return (
    <Section id="configuration" title="agentguard:docs.configuration">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Pass a{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            GuardConfig
          </code>{' '}
          to customize behavior.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 text-left font-medium">Option</th>
                <th className="py-2 pr-4 text-left font-medium">Type</th>
                <th className="py-2 pr-4 text-left font-medium">Default</th>
                <th className="py-2 text-left font-medium">Description</th>
              </tr>
            </thead>

            <tbody>
              {CONFIG_OPTIONS.map((opt) => (
                <tr key={opt.name} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <code className="bg-muted rounded px-1 py-0.5 text-xs">
                      {opt.name}
                    </code>
                  </td>
                  <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                    {opt.type}
                  </td>
                  <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                    {opt.defaultVal}
                  </td>
                  <td className="text-muted-foreground py-2">
                    {opt.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Integration Patterns (tabbed)                                  */
/* ------------------------------------------------------------------ */

const WATCH_CODE = `@guard.watch(agent_id="support-bot", task="Answer billing questions")
def handle_support(query: str) -> str:
    return my_agent.run(query)

# The return value is a GuardResult with .output, .confidence, .action
result = handle_support("How do I update my payment method?")`;

const TRACE_CODE = `with guard.trace(agent_id="enricher", task="Enrich records") as ctx:
    output = my_agent.run(data)
    ctx.step("llm", "generate", input=data, output=output)
    ctx.set_ground_truth(source_docs)
    ctx.set_schema({"type": "object", "properties": {"name": {"type": "string"}}})
    ctx.set_token_count(1500)
    ctx.set_cost_estimate(0.003)
    ctx.record(output)

# Access results after the context manager exits
print(ctx.result.confidence)
print(ctx.result.action)`;

const RUN_CODE = `result = guard.run(
    agent_id="report-gen",
    fn=lambda: my_agent.run(query),
    task="Generate report",
    ground_truth=source_docs,
    input_data={"query": query},
)

print(result.output)
print(result.confidence)`;

function IntegrationPatternsSection() {
  return (
    <Section id="patterns" title="agentguard:docs.integrationPatterns">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          AgentGuard provides three integration patterns. Choose the one that
          best fits your architecture.
        </p>

        <Tabs defaultValue="watch">
          <TabsList>
            <TabsTrigger value="watch">
              <Trans i18nKey="agentguard:docs.watchDecorator" />
            </TabsTrigger>
            <TabsTrigger value="trace">
              <Trans i18nKey="agentguard:docs.traceContext" />
            </TabsTrigger>
            <TabsTrigger value="run">
              <Trans i18nKey="agentguard:docs.runWrapper" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watch" className="mt-4 space-y-3">
            <p className="text-muted-foreground text-sm">
              The simplest approach. Decorate any function to automatically
              capture its input/output and run verification.
            </p>

            <CodeBlock code={WATCH_CODE} />
          </TabsContent>

          <TabsContent value="trace" className="mt-4 space-y-3">
            <p className="text-muted-foreground text-sm">
              Fine-grained control. Use a context manager to attach metadata
              like ground truth, schemas, token counts, and individual steps.
            </p>

            <CodeBlock code={TRACE_CODE} />
          </TabsContent>

          <TabsContent value="run" className="mt-4 space-y-3">
            <p className="text-muted-foreground text-sm">
              Framework-agnostic wrapper. Pass any callable and AgentGuard
              handles the rest.
            </p>

            <CodeBlock code={RUN_CODE} />
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Multi-Turn Sessions                                            */
/* ------------------------------------------------------------------ */

const SESSION_CODE = `session = guard.session(agent_id="chat-bot", metadata={"user": "u123"})

# Each trace auto-increments sequence_number
# and accumulates conversation history
for user_msg in messages:
    with session.trace(task="chat turn", input_data=user_msg) as ctx:
        response = llm.chat(user_msg)
        ctx.record(response)
    # session.sequence is now incremented
    # Conversation history is sent for cross-turn verification

# Conversation history enables:
# - Cross-turn coherence checking (self-contradiction detection)
# - Trajectory-aware drift scoring
# - Conversation-aware hallucination detection`;

function SessionsSection() {
  return (
    <Section id="sessions" title="agentguard:docs.sessions">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          For chatbots and multi-turn agents, sessions track conversation
          history and enable cross-turn verification checks.
        </p>

        <CodeBlock code={SESSION_CODE} />

        <div className="space-y-2">
          <p className="text-sm font-medium">Session features:</p>

          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            <li>Automatic sequence numbering across turns</li>
            <li>
              Sliding window history (configurable via{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                conversation_window_size
              </code>
              )
            </li>
            <li>Thread-safe history snapshots for concurrent access</li>
            <li>Cross-turn coherence checking detects self-contradictions</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Sync Verification                                              */
/* ------------------------------------------------------------------ */

function SyncVerificationSection() {
  return (
    <Section id="sync-verification" title="agentguard:docs.syncVerification">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          In sync mode, each execution is sent to the Verification Gateway which
          returns a confidence score and action before your code continues.
        </p>

        <div className="space-y-3">
          <p className="text-sm font-medium">Verification checks:</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <CheckCard
              name="Schema Validation"
              description="Validates output against a JSON schema if provided"
              weight="0.15"
            />

            <CheckCard
              name="Hallucination Detection"
              description="Compares output against ground truth for factual accuracy"
              weight="0.35"
            />

            <CheckCard
              name="Task Drift"
              description="Measures whether the output stays on-task"
              weight="0.30"
            />

            <CheckCard
              name="Confidence Scoring"
              description="Overall reliability assessment of the output"
              weight="0.20"
            />
          </div>

          <p className="text-muted-foreground text-sm">
            In multi-turn sessions, a <strong>coherence check</strong> is
            dynamically added (weight 0.20) and the other weights rebalance
            automatically.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Graceful degradation:</p>

          <p className="text-muted-foreground text-sm">
            If the backend is unreachable or the request times out, the SDK
            returns a pass-through result with{' '}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              action=&quot;pass&quot;
            </code>{' '}
            so your agent is never blocked by infrastructure issues.
          </p>
        </div>
      </div>
    </Section>
  );
}

function CheckCard({
  name,
  description,
  weight,
}: {
  name: string;
  description: string;
  weight: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <Badge variant="secondary">{weight}</Badge>
      </div>

      <p className="text-muted-foreground mt-1 text-xs">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Correction Cascade                                             */
/* ------------------------------------------------------------------ */

const CORRECTION_CODE = `guard = AgentGuard(
    api_key="your-key",
    config=GuardConfig(
        mode="sync",
        correction="cascade",
        transparency="transparent",
    ),
)

result = guard.run(agent_id="my-agent", fn=generate, task="Summarize doc")

if result.corrected:
    print(f"Output was corrected: {result.output}")
    print(f"Original: {result.original_output}")
    print(f"Corrections applied: {result.corrections}")
else:
    print(f"Output passed as-is: {result.output}")`;

function CorrectionCascadeSection() {
  return (
    <Section id="correction" title="agentguard:docs.correctionCascade">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          When enabled, the correction cascade automatically attempts to fix
          low-confidence outputs through three progressive layers.
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Badge variant="outline">Layer 1</Badge>
            <div>
              <p className="text-sm font-medium">Repair</p>
              <p className="text-muted-foreground text-xs">
                Fix specific identified issues in the output while preserving
                the overall structure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Badge variant="outline">Layer 2</Badge>
            <div>
              <p className="text-sm font-medium">Constrained Regeneration</p>
              <p className="text-muted-foreground text-xs">
                Regenerate the output with constraints derived from the
                identified issues.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Badge variant="outline">Layer 3</Badge>
            <div>
              <p className="text-sm font-medium">Full Re-prompt</p>
              <p className="text-muted-foreground text-xs">
                Complete regeneration from scratch with enhanced guardrails.
              </p>
            </div>
          </div>
        </div>

        <CodeBlock code={CORRECTION_CODE} />

        <p className="text-muted-foreground text-sm">
          Set{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            transparency=&quot;transparent&quot;
          </code>{' '}
          to access{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            result.corrected
          </code>
          ,{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            result.corrections
          </code>
          , and{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            result.original_output
          </code>
          .
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Error Handling                                                  */
/* ------------------------------------------------------------------ */

const ERROR_CODE = `from agentguard import AgentGuard, AgentGuardBlockError

guard = AgentGuard(api_key="your-key", config=GuardConfig(mode="sync"))

try:
    result = guard.run(agent_id="my-agent", fn=generate, task="Answer query")
    print(result.output)
except AgentGuardBlockError as e:
    print(f"Blocked! Confidence: {e.result.confidence}")
    print(f"Action: {e.result.action}")
    print(f"Checks: {e.result.verification}")
    # Handle blocked output — e.g., return a fallback response`;

function ErrorHandlingSection() {
  return (
    <Section id="error-handling" title="agentguard:docs.errorHandling">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          In sync mode, when an output&apos;s confidence falls below the block
          threshold, an{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            AgentGuardBlockError
          </code>{' '}
          is raised. The exception includes the full{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">
            GuardResult
          </code>{' '}
          with verification details.
        </p>

        <CodeBlock code={ERROR_CODE} />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Thresholds                                                     */
/* ------------------------------------------------------------------ */

const THRESHOLD_CODE = `from agentguard import AgentGuard, GuardConfig

guard = AgentGuard(
    api_key="your-key",
    config=GuardConfig(
        mode="sync",
        confidence_threshold={
            "pass_threshold": 0.9,    # Stricter pass
            "flag_threshold": 0.6,
            "block_threshold": 0.4,   # More lenient block
        },
    ),
)`;

function ThresholdsSection({ accountSlug }: { accountSlug: string }) {
  return (
    <Section id="thresholds" title="agentguard:docs.thresholds">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Customize the confidence score boundaries that determine whether an
          output is passed, flagged for review, or blocked entirely.
        </p>

        <CodeBlock code={THRESHOLD_CODE} />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 text-left font-medium">Threshold</th>
                <th className="py-2 pr-4 text-left font-medium">Default</th>
                <th className="py-2 text-left font-medium">Description</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4">
                  <Badge variant="success">pass_threshold</Badge>
                </td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                  0.8
                </td>
                <td className="text-muted-foreground py-2">
                  Scores above this are passed without intervention
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-2 pr-4">
                  <Badge variant="warning">flag_threshold</Badge>
                </td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                  0.5
                </td>
                <td className="text-muted-foreground py-2">
                  Scores between flag and pass are flagged for review
                </td>
              </tr>

              <tr>
                <td className="py-2 pr-4">
                  <Badge variant="destructive">block_threshold</Badge>
                </td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                  0.3
                </td>
                <td className="text-muted-foreground py-2">
                  Scores below this are blocked (raises AgentGuardBlockError)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground text-sm">
          Your API key is configured in the{' '}
          <Link
            href={`/home/${accountSlug}/settings/api-keys`}
            className="text-primary underline underline-offset-4"
          >
            API Keys settings
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Full Example                                                  */
/* ------------------------------------------------------------------ */

const FULL_EXAMPLE = `import os
from agentguard import AgentGuard, AgentGuardBlockError, GuardConfig

guard = AgentGuard(
    api_key=os.environ["AGENTGUARD_API_KEY"],
    config=GuardConfig(
        mode="sync",
        correction="cascade",
        transparency="transparent",
    ),
)

session = guard.session(agent_id="my-agent")

def chat(user_message: str):
    with session.trace(task=f"chat: {user_message[:50]}", input_data=user_message) as ctx:
        response = llm.generate(user_message)
        ctx.step("llm", "generate", input=user_message, output=response)
        ctx.record(response)

    if ctx.result and ctx.result.corrected:
        response = ctx.result.output  # Use corrected output

    return response, ctx.result

# Usage
try:
    response, result = chat("What is the weather?")
    print(f"Response: {response}")
    print(f"Confidence: {result.confidence}")
except AgentGuardBlockError as e:
    print(f"Output blocked: {e.result.confidence}")
finally:
    guard.close()`;

function FullExampleSection() {
  return (
    <Section id="full-example" title="agentguard:docs.fullExample">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          A complete example combining sessions, sync verification, correction
          cascade, and error handling.
        </p>

        <CodeBlock code={FULL_EXAMPLE} />
      </div>
    </Section>
  );
}
