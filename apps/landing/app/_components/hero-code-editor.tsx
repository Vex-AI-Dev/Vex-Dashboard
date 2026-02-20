'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  SandpackCodeEditor,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Code tab data                                                      */
/* ------------------------------------------------------------------ */

const pythonCode = `from vex import Vex

guard = Vex(api_key="your-api-key")

@guard.watch(agent_id="support-bot")
def handle_ticket(query: str) -> str:
    return call_llm(query)

result = handle_ticket("How do I reset my password?")
print(result.action)      # "pass" | "flag" | "block"
print(result.confidence)   # 0.92
print(result.corrected)    # True if auto-corrected
`;

const typescriptCode = `import { Vex } from '@vex_dev/sdk';

const guard = new Vex({
  apiKey: 'your-api-key',
  config: { mode: 'sync' },
});

const result = await guard.watch('support-bot', async () => {
  return await callLLM(query);
});

console.log(result.action);     // "pass" | "flag" | "block"
console.log(result.confidence); // 0.92
`;

const installCommands = {
  python: 'pip install vex-sdk',
  typescript: 'npm install @vex_dev/sdk',
} as const;

/* ------------------------------------------------------------------ */
/*  Live demo data                                                     */
/* ------------------------------------------------------------------ */

interface LogEntry {
  phase: 1 | 2 | 3;
  text: string;
  type: 'info' | 'warn' | 'success';
  classification?: string;
  confidence?: number;
  status?: 'pass' | 'flag' | 'corrected';
}

const DEMO_SEQUENCE: LogEntry[] = [
  {
    phase: 1,
    text: '"Can\'t login to my account"',
    type: 'info',
    classification: 'Technical',
    confidence: 0.97,
    status: 'pass',
  },
  {
    phase: 1,
    text: '"I want a refund for my last order"',
    type: 'info',
    classification: 'Billing',
    confidence: 0.95,
    status: 'pass',
  },
  {
    phase: 1,
    text: '"App crashes when I open settings"',
    type: 'info',
    classification: 'Technical',
    confidence: 0.96,
    status: 'pass',
  },
  {
    phase: 1,
    text: '"How do I cancel my subscription?"',
    type: 'info',
    classification: 'Billing',
    confidence: 0.93,
    status: 'pass',
  },
  {
    phase: 2,
    text: '⚠ drift_score: 0.45 — confidence dropping',
    type: 'warn',
  },
  {
    phase: 2,
    text: '"Payment failed on checkout"',
    type: 'warn',
    classification: 'Technical ✗',
    confidence: 0.61,
    status: 'flag',
  },
  {
    phase: 2,
    text: '"Charged twice for same item"',
    type: 'warn',
    classification: 'Technical ✗',
    confidence: 0.58,
    status: 'flag',
  },
  {
    phase: 3,
    text: 'correction cascade → L1 prompt refinement',
    type: 'success',
  },
  {
    phase: 3,
    text: 're-classify → Billing',
    type: 'success',
    classification: 'Billing ✓',
    confidence: 0.92,
    status: 'corrected',
  },
  {
    phase: 3,
    text: 're-classify → Billing',
    type: 'success',
    classification: 'Billing ✓',
    confidence: 0.94,
    status: 'corrected',
  },
  {
    phase: 3,
    text: '✓ 2 caught · 2 corrected · 0 reached production',
    type: 'success',
  },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function PythonIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="py1" x1="0" x2="1" y1="0" y2="1">
          <stop
            offset="0"
            stopColor={active ? 'rgb(56,126,184)' : '#a2a2a2'}
          />
          <stop
            offset="1"
            stopColor={active ? 'rgb(54,105,148)' : '#888'}
          />
        </linearGradient>
        <linearGradient id="py2" x1="0" x2="1" y1="0" y2="1">
          <stop
            offset="0"
            stopColor={active ? 'rgb(255,224,82)' : '#a2a2a2'}
          />
          <stop
            offset="1"
            stopColor={active ? 'rgb(255,195,49)' : '#888'}
          />
        </linearGradient>
      </defs>
      <path
        d="M11.913 0C5.821 0 6.201 2.642 6.201 2.642L6.208 5.379H12.022V6.201H3.899S0 5.759 0 11.907C0 18.054 3.403 17.836 3.403 17.836H5.434V14.984S5.324 11.581 8.782 11.581H14.549S17.789 11.633 17.789 8.449V3.186S18.281 0 11.913 0ZM8.708 1.841C9.286 1.841 9.754 2.308 9.754 2.887C9.754 3.465 9.286 3.933 8.708 3.933C8.129 3.933 7.662 3.465 7.662 2.887C7.662 2.308 8.129 1.841 8.708 1.841Z"
        fill="url(#py1)"
      />
      <path
        d="M12.087 23.875C18.18 23.875 17.799 21.233 17.799 21.233L17.792 18.496H11.978V17.674H20.102S24 18.116 24 11.968C24 5.821 20.597 6.039 20.597 6.039H18.567V8.891S18.676 12.294 15.218 12.294H9.451S6.212 12.242 6.212 15.426V20.689S5.72 23.875 12.087 23.875ZM15.293 22.034C14.714 22.034 14.247 21.567 14.247 20.988C14.247 20.41 14.714 19.942 15.293 19.942C15.871 19.942 16.339 20.41 16.339 20.988C16.339 21.567 15.871 22.034 15.293 22.034Z"
        fill="url(#py2)"
      />
    </svg>
  );
}

function TSIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect
        width="24"
        height="24"
        rx="2.344"
        fill={active ? '#3178c6' : '#a2a2a2'}
      />
      <path
        d="M13.922 11.391H5.531V13.316H8.527V21.891H10.912V13.316H13.922ZM16.21 21.885C16.731 21.982 17.28 22.031 17.857 22.031C18.419 22.031 18.954 21.978 19.46 21.87C19.966 21.762 20.41 21.585 20.791 21.338C21.173 21.091 21.475 20.769 21.697 20.37C21.92 19.972 22.031 19.479 22.031 18.893C22.031 18.467 21.968 18.095 21.84 17.774C21.713 17.454 21.53 17.169 21.29 16.92C21.051 16.671 20.763 16.447 20.428 16.249C20.093 16.051 19.716 15.864 19.295 15.688C18.987 15.561 18.71 15.438 18.466 15.318C18.221 15.198 18.013 15.076 17.842 14.951C17.671 14.826 17.539 14.694 17.446 14.555C17.353 14.416 17.307 14.258 17.307 14.082C17.307 13.921 17.348 13.775 17.432 13.646C17.515 13.516 17.632 13.405 17.784 13.312C17.935 13.219 18.121 13.147 18.341 13.096C18.561 13.044 18.806 13.019 19.075 13.019C19.27 13.019 19.477 13.034 19.695 13.063C19.912 13.092 20.131 13.137 20.351 13.198C20.571 13.26 20.785 13.337 20.993 13.429C21.201 13.522 21.393 13.63 21.569 13.752V11.56C21.212 11.423 20.822 11.321 20.399 11.255C19.976 11.189 19.491 11.156 18.943 11.156C18.385 11.156 17.857 11.216 17.358 11.336C16.859 11.456 16.42 11.643 16.041 11.897C15.662 12.151 15.363 12.475 15.143 12.869C14.923 13.262 14.813 13.733 14.813 14.28C14.813 14.979 15.014 15.576 15.418 16.069C15.821 16.563 16.434 16.981 17.255 17.323C17.578 17.455 17.879 17.585 18.158 17.712C18.437 17.839 18.677 17.971 18.88 18.108C19.083 18.245 19.243 18.394 19.361 18.555C19.478 18.717 19.537 18.9 19.537 19.105C19.537 19.257 19.5 19.397 19.427 19.527C19.354 19.657 19.242 19.769 19.093 19.864C18.944 19.96 18.758 20.034 18.536 20.088C18.313 20.142 18.053 20.169 17.754 20.169C17.246 20.169 16.742 20.079 16.243 19.901C15.744 19.723 15.282 19.455 14.856 19.098V21.445C15.238 21.64 15.689 21.787 16.21 21.885Z"
        fill="white"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Live Demo (compact, for hero tab)                             */
/* ------------------------------------------------------------------ */

function HeroLiveDemo() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPlayback = useCallback(() => {
    setStep(0);
    setDone(false);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= DEMO_SEQUENCE.length) {
        setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setStep(idx);
    }, 600);
  }, []);

  // Auto-start on mount
  useEffect(() => {
    startPlayback();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startPlayback]);

  const replay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startPlayback();
  };

  const visibleEntries = DEMO_SEQUENCE.slice(0, step + 1);
  const currentPhase = visibleEntries[visibleEntries.length - 1]?.phase ?? 1;

  return (
    <div className="flex h-[400px] flex-col">
      {/* Phase bar + replay */}
      <div className="flex items-center justify-between border-b border-[#252525] px-4 py-2">
        <div className="flex gap-2">
          {[
            { phase: 1, label: 'Normal' },
            { phase: 2, label: 'Drift' },
            { phase: 3, label: 'Corrected' },
          ].map((p) => (
            <span
              key={p.phase}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                currentPhase === p.phase
                  ? p.phase === 2
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                  : 'text-[#585858]'
              }`}
            >
              {p.label}
            </span>
          ))}
        </div>

        {done && (
          <button
            onClick={replay}
            className="flex items-center gap-1 text-[10px] text-[#a2a2a2] transition-colors hover:text-white"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Replay
          </button>
        )}
      </div>

      {/* Terminal feed */}
      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed">
        {visibleEntries.map((entry, i) => (
          <div
            key={i}
            className={`mb-1.5 animate-[termLine_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 ${
              entry.type === 'warn'
                ? 'text-amber-400'
                : entry.type === 'success'
                  ? 'text-emerald-400'
                  : 'text-[#a2a2a2]'
            }`}
          >
            <span className="mr-1.5 text-[#585858]">$</span>
            {entry.text}
            {entry.classification && (
              <span className="ml-2 text-[#585858]">
                → {entry.classification}
              </span>
            )}
            {entry.confidence !== undefined && (
              <span
                className={`ml-2 ${
                  entry.confidence >= 0.9
                    ? 'text-emerald-500'
                    : entry.confidence >= 0.7
                      ? 'text-amber-500'
                      : 'text-red-400'
                }`}
              >
                {entry.confidence.toFixed(2)}
              </span>
            )}
            {entry.status && (
              <span
                className={`ml-2 rounded px-1 py-0.5 text-[10px] font-medium ${
                  entry.status === 'pass'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : entry.status === 'flag'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {entry.status === 'corrected' ? (
                  <span className="inline-flex items-center gap-0.5">
                    <RefreshCw className="inline h-2.5 w-2.5" />
                    corrected
                  </span>
                ) : (
                  entry.status
                )}
              </span>
            )}
          </div>
        ))}

        {/* Summary stats */}
        {done && (
          <div className="mt-3 flex gap-4 animate-[termLine_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 opacity-0">
            {[
              { n: '2', label: 'caught' },
              { n: '2', label: 'corrected' },
              { n: '0', label: 'leaked' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-sm font-bold text-emerald-400">{s.n}</div>
                <div className="text-[9px] text-[#a2a2a2]">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type Tab = 'live' | 'python' | 'typescript';

export function HeroCodeEditor() {
  const [tab, setTab] = useState<Tab>('live');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const lang = tab === 'live' ? 'python' : tab;

  const handleCopyInstall = useCallback(() => {
    void navigator.clipboard.writeText(installCommands[lang]).then(() => {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    });
  }, [lang]);

  const handleCopyCode = useCallback(() => {
    const code = lang === 'python' ? pythonCode : typescriptCode;
    void navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  }, [lang]);

  return (
    <div className="flex flex-col gap-3">
      {/* Tab bar */}
      <div className="flex items-center overflow-hidden rounded-[10px] border border-[#252525] bg-[#161616]">
        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 rounded-[10px] bg-[#0a0a0a] p-1">
          <button
            onClick={() => setTab('live')}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all ${
              tab === 'live'
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'text-[#a2a2a2] hover:bg-[#161616]/60 hover:text-white'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            Live
          </button>
          <button
            onClick={() => setTab('python')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              tab === 'python'
                ? 'border border-[#252525] bg-[#161616]'
                : 'hover:bg-[#161616]/60'
            }`}
          >
            <PythonIcon active={tab === 'python'} />
          </button>
          <button
            onClick={() => setTab('typescript')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              tab === 'typescript'
                ? 'border border-[#252525] bg-[#161616]'
                : 'hover:bg-[#161616]/60'
            }`}
          >
            <TSIcon active={tab === 'typescript'} />
          </button>
        </div>

        {/* Install command (hidden on live tab) */}
        {tab !== 'live' && (
          <>
            <div className="mx-3 h-[18px] w-px bg-[#252525]" />
            <code className="flex-1 font-mono text-sm text-[#a2a2a2]">
              {installCommands[lang]}
            </code>
            <button
              onClick={handleCopyInstall}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[#252525] bg-[#161616] transition-colors hover:bg-[#252525]"
            >
              {copiedInstall ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="#10b981"
                >
                  <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="#a2a2a2"
                >
                  <path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" />
                </svg>
              )}
            </button>
          </>
        )}

        {/* Live tab label */}
        {tab === 'live' && (
          <>
            <div className="mx-3 h-[18px] w-px bg-[#252525]" />
            <span className="flex-1 text-xs text-[#585858]">
              support-ticket-classifier — live verification feed
            </span>
          </>
        )}
      </div>

      {/* Content area */}
      <div className="relative overflow-hidden rounded-lg border border-[#252525] bg-[#161616]">
        {tab === 'live' ? (
          <HeroLiveDemo />
        ) : (
          <>
            <SandpackProvider
              key={tab}
              template="vanilla"
              theme={{
                colors: {
                  surface1: '#161616',
                  surface2: '#1e1e1e',
                  surface3: '#252525',
                  clickable: '#585858',
                  base: '#a2a2a2',
                  disabled: '#585858',
                  hover: '#a2a2a2',
                  accent: '#10b981',
                  error: '#ef4444',
                  errorSurface: '#1e1e1e',
                },
                syntax: {
                  plain: '#a2a2a2',
                  comment: { color: '#585858', fontStyle: 'italic' },
                  keyword: '#c084fc',
                  tag: '#60a5fa',
                  punctuation: '#a2a2a2',
                  definition: '#FFAA00',
                  property: '#34d399',
                  static: '#ff8866',
                  string: '#34d399',
                },
                font: {
                  body: 'Inter, system-ui, sans-serif',
                  mono: '"JetBrains Mono", "Fira Code", monospace',
                  size: '14px',
                  lineHeight: '20px',
                },
              }}
              files={{
                '/index.js': {
                  code: tab === 'python' ? pythonCode : typescriptCode,
                  active: true,
                },
              }}
            >
              <SandpackCodeEditor
                readOnly
                showLineNumbers
                style={{
                  height: 400,
                  fontSize: 14,
                }}
              />
            </SandpackProvider>

            {/* Copy code button */}
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#252525] bg-[#161616] transition-colors hover:bg-[#252525]"
            >
              {copiedCode ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="#10b981"
                >
                  <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="#a2a2a2"
                >
                  <path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
