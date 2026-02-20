import type { Metadata } from 'next';

import { LiveDemo } from './_components/live-demo';

export const metadata: Metadata = {
  title: 'Live Demo — Vex',
  description:
    'Watch Vex protect an AI agent in real-time. See drift detection and auto-correction in action.',
};

export default function DemoPage() {
  return (
    <div className="container py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 text-[13px] font-medium tracking-widest text-emerald-500 uppercase">
          Live Demo
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
          Watch Vex Protect an Agent in Real-Time
        </h1>

        <p className="text-lg text-[#a2a2a2]">
          A support ticket classifier runs live. When the model drifts, Vex
          detects the issue and auto-corrects — before bad outputs reach
          production.
        </p>
      </div>

      {/* Demo */}
      <div className="mt-16">
        <LiveDemo />
      </div>

      {/* Key Takeaways */}
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Detect',
            description:
              'Confidence scoring flags misclassifications the moment they happen.',
          },
          {
            title: 'Correct',
            description:
              'Prompt refinement cascades re-classify outputs automatically.',
          },
          {
            title: 'Zero Downtime',
            description:
              'Corrections happen inline — no redeployments, no manual intervention.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-[#252525] bg-[#161616] p-6"
          >
            <h3 className="mb-2 text-lg font-semibold text-white">
              {card.title}
            </h3>

            <p className="text-sm text-[#a2a2a2]">{card.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <a
          href="https://app.tryvex.dev"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Start Protecting Your Agents
        </a>
      </div>
    </div>
  );
}
