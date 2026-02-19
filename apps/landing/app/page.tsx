import { CodeExample } from './_components/code-example';
import { ComparisonTable } from './_components/comparison-table';
import { FaqAccordion } from './_components/faq-accordion';
import { HeroCodeEditor } from './_components/hero-code-editor';
import { HowItWorks } from './_components/how-it-works';
import { LogoBar } from './_components/logo-bar';
export default function LandingPage() {
  return (
    <>
        {/* ===== HERO ===== */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="container">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
              {/* Left column — copy + CTAs */}
              <div className="flex flex-col justify-center pt-8">
                <h1 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  Runtime Reliability
                  <br />
                  for AI Agents.
                </h1>

                <p className="mb-10 max-w-[460px] text-[17px] leading-relaxed text-[#a2a2a2]">
                  Detect drift. Correct hallucinations.
                  <br />
                  Reliable AI agents in production.
                </p>

                <div className="flex items-center gap-3">
                  <a
                    href="https://app.tryvex.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-lg bg-emerald-500 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-400"
                  >
                    Start for Free
                  </a>
                  <a
                    href="https://cal.com/abhishek-singh-bvoj1a/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-lg border border-[#252525] px-7 text-[15px] font-medium text-[#a2a2a2] transition-colors hover:border-[#585858] hover:text-white"
                  >
                    Book Demo&ensp;&rarr;
                  </a>
                </div>
              </div>

              {/* Right column — install + code editor */}
              <div className="hidden lg:block">
                <HeroCodeEditor />
              </div>
            </div>
          </div>
        </section>

        {/* ===== LOGO BAR ===== */}
        <LogoBar />

        {/* ===== CAPABILITIES ===== */}
        <section className="border-t border-[#252525] py-20">
          <div className="container">
            <h2 className="max-w-[800px] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Observe, Correct, Optimize.{' '}
              <span className="text-[#686868]">
                Runtime Guardrails for AI Agents.
              </span>
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[#252525] bg-[#252525] lg:grid-cols-3">
              {/* Col 1 — Observe */}
              <div className="flex flex-col bg-[#0a0a0a] p-7">
                <div className="mb-6">
                  <h3 className="mb-2 font-mono text-[18px] font-medium leading-snug text-white">
                    Real-Time Observability for Every Agent Action
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#a2a2a2]">
                    Track every LLM call, tool use, and decision in production. Detect drift before users do.
                  </p>
                </div>
                <div className="mt-auto flex flex-col items-center justify-center py-12">
                  <div className="relative flex h-36 w-36 items-center justify-center">
                    <svg
                      className="absolute inset-0"
                      viewBox="0 0 144 144"
                      fill="none"
                    >
                      <circle
                        cx="72"
                        cy="72"
                        r="70"
                        stroke="#252525"
                        strokeWidth="1"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="70"
                        stroke="rgb(16,185,129)"
                        strokeWidth="2"
                        strokeDasharray="440"
                        strokeDashoffset="44"
                        strokeLinecap="round"
                        className="opacity-60"
                      />
                    </svg>
                    <span className="font-mono text-2xl text-emerald-500">
                      99.2%
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center rounded-full border border-[#252525] bg-[#161616] px-4 py-1.5">
                    <code className="font-mono text-sm text-[#a2a2a2]">
                      vex.observe(agent)
                    </code>
                  </div>
                </div>
              </div>

              {/* Col 2 — Correct */}
              <div className="flex flex-col bg-[#0a0a0a] p-7">
                <div className="mb-6">
                  <h3 className="mb-2 font-mono text-[18px] font-medium leading-snug text-white">
                    Automatic Correction When Agents Drift
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#a2a2a2]">
                    Multi-layer guardrails catch hallucinations, off-task behavior, and policy violations in real time.
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-3 py-12">
                  {[
                    { label: 'Hallucination', status: 'blocked', color: 'text-red-400 border-red-400/40' },
                    { label: 'Policy Violation', status: 'blocked', color: 'text-red-400 border-red-400/40' },
                    { label: 'Off-Task Drift', status: 'corrected', color: 'text-amber-400 border-amber-400/40' },
                    { label: 'Factual Response', status: 'passed', color: 'text-emerald-500 border-emerald-500/40' },
                    { label: 'On-Task Action', status: 'passed', color: 'text-emerald-500 border-emerald-500/40' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex items-center justify-center rounded-full border px-3 py-1 font-mono text-xs ${row.color}`}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          className="mr-1.5"
                        >
                          <circle
                            cx="5"
                            cy="5"
                            r="4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                        {row.label}
                      </div>
                      <div className="h-px flex-1 bg-[#252525]" />
                      <span className={`font-mono text-[11px] uppercase ${row.color.split(' ')[0]}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 3 — Optimize */}
              <div className="flex flex-col bg-[#0a0a0a] p-7">
                <div className="mb-6">
                  <h3 className="mb-2 font-mono text-[18px] font-medium leading-snug text-white">
                    Continuous Optimization Across Agent Runs
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#a2a2a2]">
                    Learn from every session. Automatically tune prompts, thresholds, and correction strategies.
                  </p>
                </div>
                <div className="mt-auto grid grid-cols-3 gap-2 py-12">
                  {[
                    { label: 'Accuracy', value: '94→99%', improved: true },
                    { label: 'Latency', value: '-42%', improved: true },
                    { label: 'Cost', value: '-38%', improved: true },
                    { label: 'Drift', value: '-87%', improved: true },
                    { label: 'Uptime', value: '99.9%', improved: true },
                    { label: 'Incidents', value: '-91%', improved: true },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="flex flex-col items-center justify-center rounded-md border border-[#252525] bg-[#161616] p-3"
                    >
                      <span className="font-mono text-sm text-emerald-500">
                        {metric.value}
                      </span>
                      <span className="mt-1 text-[11px] text-[#585858]">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEM ===== */}
        <section id="problem" className="border-t border-[#252525] py-20">
          <div className="container">
            <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-red-400">
              The Problem
            </div>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              The agent passes all evals. Ships to production. Then slowly
              drifts.
            </h2>
            <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-[#a2a2a2]">
              No error. No crash. No alert. Just quietly doing 90% of the job
              instead of 100%. You find out when a customer complains. Or never.
            </p>

            <div className="mt-12 grid gap-px bg-[#252525] md:grid-cols-3">
              {[
                {
                  title: 'Support agent hallucinates features',
                  desc: 'Customer gets wrong info. 2-3 hours to detect and fix.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ),
                },
                {
                  title: 'Report agent fabricates data',
                  desc: 'Bad data ships to stakeholders. Wrong decisions made.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ),
                },
                {
                  title: 'Workflow agent drifts off-task',
                  desc: 'Cascade failure through your pipeline. Full restart needed.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#0a0a0a] p-7 transition-colors hover:bg-[#161616]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center bg-red-400/10 text-red-400">
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#a2a2a2]">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="border-t border-[#252525] py-20">
          <div className="container">
            <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              How It Works
            </div>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Three layers of runtime reliability
            </h2>

            <HowItWorks />
          </div>
        </section>

        {/* ===== CODE EXAMPLE ===== */}
        <section id="code" className="border-t border-[#252525] py-20">
          <div className="container">
            <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              Quick Start
            </div>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Add Vex to your agent in 3 lines
            </h2>

            <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <CodeExample />

              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                  Three lines to runtime reliability
                </h3>
                <p className="mb-6 text-[15px] leading-relaxed text-[#a2a2a2]">
                  Wrap your agent function. Every output is verified against
                  drift, hallucination, and schema compliance. Corrections
                  happen automatically.
                </p>
                <p className="text-sm text-[#585858]">
                  Works with LangChain, CrewAI, OpenAI Assistants, and any
                  Python/TypeScript agent. No framework lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section className="border-t border-[#252525] py-20">
          <div className="container">
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[40px] sm:leading-[1.15]">
              Most monitoring tells you the agent ran. Vex tells you the agent{' '}
              <span className="text-emerald-500">changed</span>.
            </h2>

            <ComparisonTable />
          </div>
        </section>

        {/* ===== INTEGRATIONS ===== */}
        <section className="border-t border-[#252525] py-20">
          <div className="container">
            <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              Integrations
            </div>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Drop into any stack
            </h2>

            <div className="mt-12 grid gap-px bg-[#252525] sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  name: 'LangChain',
                  desc: 'LangGraph',
                  color: 'text-teal-400',
                  bgColor: 'bg-teal-400/10',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  name: 'CrewAI',
                  desc: 'Multi-agent',
                  color: 'text-violet-400',
                  bgColor: 'bg-violet-400/10',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                },
                {
                  name: 'OpenAI',
                  desc: 'Assistants API',
                  color: 'text-sky-400',
                  bgColor: 'bg-sky-400/10',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-400">
                      <path d="M12 2a7 7 0 017 7v1a7 7 0 01-7 7 7 7 0 01-7-7v-1a7 7 0 017-7z" strokeLinecap="round" />
                      <path d="M12 17v4M8 21h8" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  name: 'Custom',
                  desc: 'Any Python/TS function',
                  color: 'text-amber-400',
                  bgColor: 'bg-amber-400/10',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
                      <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-[#0a0a0a] p-6 text-center transition-colors hover:bg-[#161616]"
                >
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center ${item.bgColor}`}
                  >
                    {item.icon}
                  </div>
                  <div className={`mb-1 font-mono text-[15px] font-medium ${item.color}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-[#a2a2a2]">{item.desc}</div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[15px] text-[#a2a2a2]">
              If your code calls an LLM, Vex can watch it.
            </p>
          </div>
        </section>

        {/* ===== GET STARTED ===== */}
        <section id="get-started" className="border-t border-[#252525] py-20">
          <div className="container">
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Start catching drift in 5 minutes
            </h2>

            <div className="mt-12 grid gap-px bg-[#252525] sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: '1',
                  title: 'Install the SDK',
                  desc: (
                    <code className="bg-emerald-500/10 px-1.5 py-0.5 text-[13px] text-emerald-500">
                      pip install vex-sdk
                    </code>
                  ),
                },
                {
                  num: '2',
                  title: 'Get your API key',
                  desc: (
                    <>
                      Sign up at{' '}
                      <a
                        href="https://tryvex.dev"
                        className="text-emerald-500 hover:underline"
                      >
                        tryvex.dev
                      </a>
                    </>
                  ),
                },
                {
                  num: '3',
                  title: 'Wrap your agent',
                  desc: (
                    <>
                      Add{' '}
                      <code className="bg-emerald-500/10 px-1.5 py-0.5 text-[13px] text-emerald-500">
                        @guard.watch()
                      </code>{' '}
                      decorator
                    </>
                  ),
                },
                {
                  num: '4',
                  title: 'Deploy',
                  desc: 'Deploy as usual. Vex starts learning from first request.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-start bg-[#0a0a0a] p-7"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center border border-emerald-500/30 text-sm font-bold text-emerald-500">
                    {step.num}
                  </div>
                  <h3 className="mb-1.5 text-[15px] font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#a2a2a2]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[15px] text-[#a2a2a2]">
              Full docs at{' '}
              <a
                href="https://docs.tryvex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 underline underline-offset-2 hover:text-white"
              >
                docs.tryvex.dev
              </a>
            </p>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <FaqAccordion />

        {/* ===== BOTTOM CTA ===== */}
        <section className="border-t border-[#252525] py-28 text-center">
          <div className="container">
            <h2 className="mx-auto mb-4 max-w-[700px] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Plug Vex into one agent. See what it catches.
            </h2>
            <p className="mx-auto mb-10 max-w-[520px] text-[15px] leading-relaxed text-[#a2a2a2]">
              30-minute setup. If Vex doesn&apos;t catch something your current
              monitoring missed in 2 weeks, walk away.
            </p>

            <div className="mb-8 flex items-center justify-center gap-3">
              <a
                href="https://app.tryvex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-emerald-500 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-400"
              >
                Get Started
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ml-2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a
                href="https://cal.com/abhishek-singh-bvoj1a/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-[#252525] px-7 py-3.5 text-[15px] font-medium text-[#a2a2a2] transition-colors hover:border-[#585858] hover:text-white"
              >
                Book a Demo
              </a>
            </div>

            <p className="text-sm italic text-[#585858]">
              Or just star the repo and come back when your agent drifts in
              production. It will.
            </p>
          </div>
        </section>
    </>
  );
}
