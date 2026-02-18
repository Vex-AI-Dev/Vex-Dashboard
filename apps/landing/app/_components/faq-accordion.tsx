'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What is Vex?',
    a: 'Vex is an open-source runtime reliability layer for AI agents. It detects when your agent\'s behavior silently changes in production — hallucinations, drift, schema violations — and auto-corrects before your users notice.',
  },
  {
    q: 'How is Vex different from evals or tracing?',
    a: 'Evals test your agent before deployment. Tracing shows you what happened after something breaks. Vex runs continuously in production, catching behavioral drift in real-time and auto-correcting on the fly. They\'re complementary — Vex fills the gap between pre-deploy testing and post-mortem analysis.',
  },
  {
    q: 'How long does it take to set up?',
    a: 'About 5 minutes. Install the SDK (pip install vex-sdk or npm install @vex_dev/sdk), add 3 lines of code to wrap your agent function, and deploy. Vex starts learning from the first request.',
  },
  {
    q: 'What frameworks does Vex support?',
    a: 'Vex works with LangChain, CrewAI, OpenAI Assistants, and any custom Python or TypeScript agent. If your code calls an LLM, Vex can watch it.',
  },
  {
    q: 'Is Vex open source?',
    a: 'Yes. Vex is fully open source under the Apache 2.0 license. Both the Python SDK and TypeScript SDK are available on GitHub.',
  },
  {
    q: 'Does Vex add latency?',
    a: 'In async mode (default), Vex adds zero latency — verification happens in the background. In sync mode, Vex adds a verification step before returning the output, which typically takes 200-500ms depending on the checks enabled.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-[#252525] py-20">
      <div className="container">
        <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
          FAQ
        </div>
        <h2 className="mb-12 max-w-[600px] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mx-auto max-w-[800px]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-[#252525]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="pr-4 text-[15px] font-medium text-white">
                    {faq.q}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`shrink-0 text-[#585858] transition-transform duration-200 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    <line x1="10" y1="4" x2="10" y2="16" />
                    <line x1="4" y1="10" x2="16" y2="10" />
                  </svg>
                </button>
                <div
                  className="grid transition-all duration-200"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-[#a2a2a2]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
