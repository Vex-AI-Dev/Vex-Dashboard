'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@kit/ui/button';

interface StepInstallSdkProps {
  apiKey: string | null;
  onNext: () => void;
  onBack: () => void;
}

function CodeBlock({
  title,
  code,
  delay = 0,
}: {
  title: string;
  code: string;
  delay?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="border-border/50 overflow-hidden rounded-xl border">
        <div className="bg-card/50 flex items-center justify-between px-4 py-2">
          <span className="text-muted-foreground text-xs font-medium">
            {title}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1 px-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto bg-zinc-950 p-4 text-sm text-zinc-100 dark:bg-zinc-900">
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
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

# Add this decorator to any agent function
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
      {/* Heading + description centered */}
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

      <CodeBlock
        title={t('onboarding.step4InstallTitle')}
        code={installCode}
        delay={0.2}
      />

      <CodeBlock
        title={t('onboarding.step4InitTitle')}
        code={initCode}
        delay={0.3}
      />

      <CodeBlock
        title={t('onboarding.step4CorrectionTitle')}
        code={correctionCode}
        delay={0.4}
      />

      {/* CTA + back */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
