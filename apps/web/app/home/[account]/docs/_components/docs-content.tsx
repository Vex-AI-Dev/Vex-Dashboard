'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-md p-1.5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-200"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 dark:bg-zinc-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DocsContent() {
  const { t } = useTranslation('agentguard');

  return (
    <div className="space-y-8">
      {/* Installation */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.installation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code="pip install agentx-sdk" />
          <p className="text-muted-foreground text-sm">
            Requires Python 3.9+. The package is published on PyPI as{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              agentx-sdk
            </code>{' '}
            and imported as{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              from agentguard import ...
            </code>
          </p>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.quickStart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`from agentguard import AgentGuard

guard = AgentGuard(api_key="your-api-key")

@guard.watch(agent_id="my-agent", task="Answer questions")
def my_agent(query: str) -> str:
    return llm.generate(query)

result = my_agent("What is AgentGuard?")
print(result.output)       # The agent's response
print(result.confidence)   # Reliability score (0-1)
print(result.action)       # "pass", "flag", or "block"`}
          />
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.configuration')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock
            code={`from agentguard import AgentGuard, GuardConfig

guard = AgentGuard(
    api_key="your-api-key",
    config=GuardConfig(
        mode="sync",              # "async" (default) or "sync"
        correction="cascade",     # "none" (default) or "cascade"
        transparency="transparent", # "opaque" (default) or "transparent"
        api_url="https://api.tryvex.dev",
        timeout_s=30.0,
        conversation_window_size=10,
        confidence_threshold={
            "pass_threshold": 0.8,
            "flag_threshold": 0.5,
            "block_threshold": 0.3,
        },
    ),
)`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-medium">Option</th>
                  <th className="py-2 pr-4 text-left font-medium">Default</th>
                  <th className="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs">mode</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">&quot;async&quot;</code>
                  </td>
                  <td className="py-2">
                    Verification mode — async (fire-and-forget) or sync (inline)
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs">correction</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">&quot;none&quot;</code>
                  </td>
                  <td className="py-2">
                    Enable 3-layer auto-correction cascade
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs">transparency</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">&quot;opaque&quot;</code>
                  </td>
                  <td className="py-2">
                    Expose correction metadata in GuardResult
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs">timeout_s</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">30.0</code>
                  </td>
                  <td className="py-2">Verification timeout in seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs">conversation_window_size</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">10</code>
                  </td>
                  <td className="py-2">
                    Number of turns to include in conversation-aware checks
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code className="text-xs">confidence_threshold</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-xs">0.8/0.5/0.3</code>
                  </td>
                  <td className="py-2">
                    Pass, flag, and block confidence thresholds
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Integration Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.integrationPatterns')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="watch">
            <TabsList className="mb-4">
              <TabsTrigger value="watch">
                {t('docs.watchDecorator')}
              </TabsTrigger>
              <TabsTrigger value="trace">{t('docs.traceContext')}</TabsTrigger>
              <TabsTrigger value="run">{t('docs.runWrapper')}</TabsTrigger>
            </TabsList>

            <TabsContent value="watch">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Simplest</Badge>
                  <span className="text-muted-foreground text-sm">
                    Decorator wraps your function — input/output captured
                    automatically
                  </span>
                </div>
                <CodeBlock
                  code={`@guard.watch(agent_id="support-bot", task="Answer billing questions")
def handle_support(query: str) -> str:
    return my_agent.run(query)

# result.output, result.confidence, result.action`}
                />
              </div>
            </TabsContent>

            <TabsContent value="trace">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Fine-grained</Badge>
                  <span className="text-muted-foreground text-sm">
                    Context manager for step-level tracing and metadata
                  </span>
                </div>
                <CodeBlock
                  code={`with guard.trace(agent_id="enricher", task="Enrich records") as ctx:
    output = my_agent.run(data)
    ctx.step("llm", "generate", input=data, output=output)
    ctx.set_ground_truth(source_docs)
    ctx.set_schema({"type": "object", "properties": {...}})
    ctx.set_token_count(1500)
    ctx.set_cost_estimate(0.003)
    ctx.record(output)

# ctx.result.confidence, ctx.result.action`}
                />
              </div>
            </TabsContent>

            <TabsContent value="run">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Framework-agnostic</Badge>
                  <span className="text-muted-foreground text-sm">
                    Wraps any callable with verification
                  </span>
                </div>
                <CodeBlock
                  code={`result = guard.run(
    agent_id="report-gen",
    fn=lambda: my_agent.run(query),
    task="Generate report",
    ground_truth=source_docs,
    input_data={"query": query},
)`}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Multi-Turn Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.sessions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Sessions track multi-turn conversations with sliding window history.
            Each trace auto-increments the sequence number and accumulates
            conversation context for cross-turn verification (coherence checks,
            drift detection).
          </p>
          <CodeBlock
            code={`session = guard.session(agent_id="chat-bot", metadata={"user": "u123"})

for user_msg in messages:
    with session.trace(task="chat turn", input_data=user_msg) as ctx:
        response = llm.chat(user_msg)
        ctx.record(response)
    # session.sequence is now incremented
    # Conversation history is sent for cross-turn verification`}
          />
        </CardContent>
      </Card>

      {/* Sync Verification */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.syncVerification')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            With{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              mode=&quot;sync&quot;
            </code>
            , each execution is verified inline before returning. The
            verification pipeline runs 4 checks in parallel:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                name: 'Schema Validation',
                desc: 'Validates output structure against expected schema',
              },
              {
                name: 'Hallucination Detection',
                desc: 'Checks output against ground truth for fabricated claims',
              },
              {
                name: 'Task Drift',
                desc: 'Measures how well the output addresses the original task',
              },
              {
                name: 'Confidence Scoring',
                desc: 'Overall reliability assessment combining all signals',
              },
            ].map((check) => (
              <div key={check.name} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{check.name}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {check.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Multi-turn sessions add a 5th check: <strong>Coherence</strong> —
            detects self-contradictions across conversation turns.
          </p>
        </CardContent>
      </Card>

      {/* Correction Cascade */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.correctionCascade')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            With{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              correction=&quot;cascade&quot;
            </code>
            , failed outputs are automatically corrected through 3 layers:
          </p>
          <div className="space-y-2">
            {[
              {
                layer: '1',
                name: 'Repair',
                desc: 'Patches specific issues in the original output',
              },
              {
                layer: '2',
                name: 'Constrained Regeneration',
                desc: 'Regenerates with constraints from the failed checks',
              },
              {
                layer: '3',
                name: 'Full Re-prompt',
                desc: 'Complete regeneration from scratch',
              },
            ].map((l) => (
              <div
                key={l.layer}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Badge variant="outline" className="shrink-0">
                  Layer {l.layer}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-muted-foreground text-xs">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <CodeBlock
            code={`from agentguard import AgentGuard, GuardConfig

guard = AgentGuard(
    api_key="your-api-key",
    config=GuardConfig(
        mode="sync",                  # Required for inline correction
        correction="cascade",         # Enable 3-layer auto-correction
        transparency="transparent",   # Expose correction details
    ),
)

# Your agent generates output as usual
with guard.trace(
    agent_id="support-bot",
    task="Answer billing questions accurately",
    input_data={"query": "What is the refund policy?"},
) as ctx:
    response = llm.generate("What is the refund policy?")
    ctx.set_ground_truth("Refunds are available within 30 days of purchase.")
    ctx.record(response)

result = ctx.result

# If the output was flagged, Vex auto-corrects it before returning
if result.corrected:
    print("Original:", result.original_output)  # What the LLM said
    print("Corrected:", result.output)           # Fixed by Vex
    print("Confidence:", result.confidence)      # Post-correction score

    # Inspect which correction layers were used
    for attempt in result.corrections:
        print(f"  Layer {attempt['layer']} ({attempt['layer_name']})")
        print(f"  Success: {attempt['success']}")
        print(f"  Latency: {attempt['latency_ms']:.0f}ms")
else:
    print("Output passed verification:", result.output)`}
          />
          <p className="text-muted-foreground mt-3 text-sm">
            The cascade selects a starting layer based on failure severity. If
            repair fails, it automatically escalates to the next layer (up to 2
            attempts). Your code always receives the best available output — no
            extra handling needed.
          </p>
        </CardContent>
      </Card>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.errorHandling')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`from agentguard import AgentGuard, AgentGuardBlockError

guard = AgentGuard(api_key="your-key", config=GuardConfig(mode="sync"))

try:
    result = guard.run(agent_id="my-agent", fn=generate)
    print(result.output)
except AgentGuardBlockError as e:
    print(f"Blocked! Confidence: {e.result.confidence}")
    print(f"Checks: {e.result.verification}")
    # Handle blocked output — e.g., return a safe fallback`}
          />
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.thresholds')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Customize when outputs are passed, flagged, or blocked based on the
            confidence score returned by verification.
          </p>
          <CodeBlock
            code={`from agentguard import AgentGuard, GuardConfig

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
)`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-medium">
                    Score Range
                  </th>
                  <th className="py-2 pr-4 text-left font-medium">Action</th>
                  <th className="py-2 text-left font-medium">Behavior</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 pr-4">&ge; pass_threshold</td>
                  <td className="py-2 pr-4">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Pass
                    </Badge>
                  </td>
                  <td className="py-2">Output returned as-is</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">&ge; flag_threshold</td>
                  <td className="py-2 pr-4">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Flag
                    </Badge>
                  </td>
                  <td className="py-2">Output returned with warning logged</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">&lt; block_threshold</td>
                  <td className="py-2 pr-4">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Block
                    </Badge>
                  </td>
                  <td className="py-2">AgentGuardBlockError raised</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Full Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t('docs.fullExample')}</CardTitle>
          <CardDescription>
            Complete real-world example with sync verification, correction
            cascade, and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`import os
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
    with session.trace(
        task=f"chat: {user_message[:50]}",
        input_data=user_message,
    ) as ctx:
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
    guard.close()`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
