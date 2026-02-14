'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';

interface StepInstallSdkProps {
  apiKey: string | null;
  onNext: () => void;
  onBack: () => void;
}

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
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 dark:bg-zinc-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function StepInstallSdk({
  apiKey,
  onNext,
  onBack,
}: StepInstallSdkProps) {
  const { t } = useTranslation('agentguard');

  const installCode = 'pip install agentx-sdk';

  const initCode = `from agentguard import AgentGuard

guard = AgentGuard(api_key="${apiKey ?? 'your-api-key'}")

@guard.watch(agent_id="my-agent", task="Describe the task")
def your_agent(query: str) -> str:
    # Your existing agent code — no changes needed
    ...`;

  const correctionCode = `from agentguard import AgentGuard, GuardConfig

guard = AgentGuard(
    api_key="${apiKey ?? 'your-api-key'}",
    config=GuardConfig(
        mode="sync",               # Verify inline before returning
        correction="cascade",      # Auto-fix flagged outputs
        transparency="transparent", # See what was corrected
    ),
)

with guard.trace(agent_id="my-agent", task="Answer questions") as ctx:
    response = llm.generate(query)
    ctx.set_ground_truth(reference_data)  # Optional: improve accuracy
    ctx.record(response)

# If output was flagged, Vex auto-corrects through 3 layers:
#   Layer 1: Repair → Layer 2: Regenerate → Layer 3: Re-prompt
output = ctx.result.output  # Always the best available output`;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('onboarding.step4Title')}
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-center">
          {t('onboarding.step4Description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Accordion type="single" collapsible defaultValue="install">
          <AccordionItem value="install" className="border-border/50">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                >
                  1
                </Badge>
                <span className="font-semibold">
                  {t('onboarding.step4InstallTitle')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9">
              <CodeBlock code={installCode} />
              <p className="text-muted-foreground mt-2 text-xs">
                Requires Python 3.9+. Import as{' '}
                <code className="bg-muted rounded px-1 py-0.5">
                  from agentguard import ...
                </code>
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="init" className="border-border/50">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                >
                  2
                </Badge>
                <span className="font-semibold">
                  {t('onboarding.step4InitTitle')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9">
              <CodeBlock code={initCode} />
              <p className="text-muted-foreground mt-2 text-xs">
                Wrap any function with{' '}
                <code className="bg-muted rounded px-1 py-0.5">
                  @guard.watch
                </code>{' '}
                to start monitoring.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="correction" className="border-border/50">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                >
                  3
                </Badge>
                <span className="font-semibold">
                  {t('onboarding.step4CorrectionTitle')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9">
              <CodeBlock code={correctionCode} />
              <p className="text-muted-foreground mt-2 text-xs">
                Flagged outputs are automatically corrected through 3 graduated
                layers before reaching your users.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button onClick={onNext} className="rounded-lg px-8" size="lg">
          {t('onboarding.next')}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('onboarding.back')}
        </button>
      </motion.div>
    </div>
  );
}
