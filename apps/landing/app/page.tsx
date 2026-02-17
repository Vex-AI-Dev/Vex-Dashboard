import { CodeExample } from './_components/code-example';
import { ComparisonTable } from './_components/comparison-table';
import { HowItWorks } from './_components/how-it-works';
import { InstallBox } from './_components/install-box';
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative px-6 pt-40 pb-24 text-center">
          {/* Hero accent glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-32 left-1/2 -translate-x-1/2"
            style={{
              width: '800px',
              height: '500px',
              background:
                'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="container relative mx-auto max-w-[1200px]">
            <div className="mx-auto mb-10 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 text-[13px] font-medium text-emerald-500 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Open Source &middot; Apache 2.0
            </div>

            <h1 className="mx-auto mb-8 max-w-[800px] text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
              Your AI agent doesn&apos;t crash. It drifts.
            </h1>

            <p className="text-muted-foreground mx-auto mb-14 max-w-[600px] text-lg leading-relaxed">
              Vex detects when your AI agent&apos;s behavior silently changes
              in production.
            </p>

            <InstallBox />

            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="https://cal.com/tryvex/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.15] bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/80 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-150 hover:scale-[1.03] hover:border-white/[0.25] hover:bg-white/[0.14] hover:text-white"
              >
                Book a Demo
              </a>
            </div>

            <p className="text-muted-foreground mt-10 text-[13px]">
              By the team behind{' '}
              <a
                href="https://oppla.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground hover:text-foreground transition-colors"
              >
                Oppla.ai
              </a>{' '}
              &amp;{' '}
              <a
                href="https://imqa.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground hover:text-foreground transition-colors"
              >
                IMQA
              </a>
            </p>
          </div>
        </section>

        {/* ===== PROBLEM ===== */}
        <section id="problem" className="relative border-t border-white/5 py-20">
          {/* Red accent glow for problem section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2"
            style={{
              width: '600px',
              height: '400px',
              background:
                'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="container relative mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              The agent passes all evals. Ships to production. Then slowly
              drifts.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[600px] text-[17px] leading-relaxed">
              No error. No crash. No alert. Just quietly doing 90% of the job
              instead of 100%. You find out when a customer complains. Or never.
            </p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
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
                  className="group rounded-xl border border-white/[0.12] bg-white/[0.06] p-7 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-red-400/30 hover:bg-white/[0.10]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-400/15 text-red-400 transition-transform group-hover:scale-105">
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="relative border-t border-white/5 py-20">
          {/* Emerald glow for how-it-works */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 right-1/4"
            style={{
              width: '600px',
              height: '400px',
              background:
                'radial-gradient(ellipse at center, rgba(16,185,129,0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="container relative mx-auto max-w-[1200px] px-6">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              How It Works
            </p>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Three layers of runtime reliability
            </h2>

            <HowItWorks />
          </div>
        </section>

        {/* ===== CODE EXAMPLE ===== */}
        <section id="code" className="relative border-t border-white/5 py-20">
          <div className="container relative mx-auto max-w-[1200px] px-6">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              Quick Start
            </p>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Add Vex to your agent in 3 lines
            </h2>

            <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <CodeExample />

              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  Three lines to runtime reliability
                </h3>
                <p className="text-muted-foreground mb-6 text-[17px] leading-relaxed">
                  Wrap your agent function. Every output is verified against
                  drift, hallucination, and schema compliance. Corrections
                  happen automatically.
                </p>
                <p className="text-muted-foreground text-sm">
                  Works with LangChain, CrewAI, OpenAI Assistants, and any
                  Python/TypeScript agent. No framework lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section className="relative border-t border-white/5 py-20">
          <div className="container relative mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-[40px] sm:leading-[1.15]">
              Most monitoring tells you the agent ran. Vex tells you the agent{' '}
              <span className="text-emerald-500">changed</span>.
            </h2>

            <ComparisonTable />
          </div>
        </section>

        {/* ===== VISUAL BREAK — transition from "why" to "how" ===== */}
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>

        {/* ===== INTEGRATIONS ===== */}
        <section className="relative py-20">
          {/* Blue-ish glow for integrations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2"
            style={{
              width: '700px',
              height: '300px',
              background:
                'radial-gradient(ellipse at center, rgba(96,165,250,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="container relative mx-auto max-w-[1200px] px-6">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
              Integrations
            </p>
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Drop into any stack
            </h2>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  name: 'LangChain',
                  desc: 'LangGraph',
                  color: 'text-teal-400',
                  glowColor: 'rgba(45,212,191,0.06)',
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
                  glowColor: 'rgba(167,139,250,0.06)',
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
                  glowColor: 'rgba(56,189,248,0.06)',
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
                  glowColor: 'rgba(251,191,36,0.06)',
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
                  className="group rounded-xl border border-white/[0.12] bg-white/[0.06] p-6 text-center shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-white/[0.20] hover:bg-white/[0.10]"
                >
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                    style={{ background: item.glowColor }}
                  >
                    {item.icon}
                  </div>
                  <div className={`mb-1 font-mono text-[15px] font-medium ${item.color}`}>
                    {item.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mt-6 text-[15px]">
              If your code calls an LLM, Vex can watch it.
            </p>
          </div>
        </section>

        {/* ===== GET STARTED — horizontal timeline layout ===== */}
        <section id="get-started" className="border-t border-white/5 py-20">
          <div className="container mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[700px] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Start catching drift in 5 minutes
            </h2>

            <div className="relative mt-12">
              {/* Connecting line */}
              <div className="absolute top-5 left-4 hidden h-[2px] w-[calc(100%-2rem)] bg-gradient-to-r from-emerald-500/60 via-emerald-500/30 to-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)] lg:block" />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    num: '1',
                    title: 'Install the SDK',
                    desc: (
                      <code className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[13px] text-emerald-500">
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
                        <code className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[13px] text-emerald-500">
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
                  <div key={step.num} className="relative flex flex-col items-start">
                    <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-background text-sm font-bold text-emerald-500 backdrop-blur-sm">
                      {step.num}
                    </div>
                    <h3 className="mb-1.5 text-[15px] font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-[15px]">
              Full docs at{' '}
              <a
                href="https://docs.tryvex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 underline underline-offset-2 hover:text-foreground"
              >
                docs.tryvex.dev
              </a>
            </p>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="relative border-t border-white/5 py-28 text-center">
          {/* Centered emerald glow for CTA */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '700px',
              height: '500px',
              background:
                'radial-gradient(ellipse at center, rgba(16,185,129,0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="container relative mx-auto max-w-[1200px] px-6">
            <h2 className="mx-auto mb-4 max-w-[700px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Plug Vex into one agent. See what it catches.
            </h2>
            <p className="text-muted-foreground mx-auto mb-10 max-w-[520px] text-[17px] leading-relaxed">
              30-minute setup. If Vex doesn&apos;t catch something your current
              monitoring missed in 2 weeks, walk away.
            </p>

            <div className="mb-8 flex items-center justify-center gap-3">
              <a
                href="https://app.tryvex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-emerald-500 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-150 hover:scale-[1.04] hover:bg-emerald-400 hover:shadow-emerald-500/40"
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
                href="https://cal.com/tryvex/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border border-white/[0.15] bg-white/[0.08] px-7 py-3.5 text-[15px] font-medium text-white/80 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-150 hover:scale-[1.03] hover:border-white/[0.25] hover:bg-white/[0.14] hover:text-white"
              >
                Book a Demo
              </a>
            </div>

            <p className="text-muted-foreground text-sm italic">
              Or just star the repo and come back when your agent drifts in
              production. It will.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
