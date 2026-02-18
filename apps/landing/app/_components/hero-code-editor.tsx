'use client';

import { useCallback, useState } from 'react';

import {
  SandpackCodeEditor,
  SandpackProvider,
} from '@codesandbox/sandpack-react';

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

type Lang = 'python' | 'typescript';

function PythonIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="py1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={active ? 'rgb(56,126,184)' : '#a2a2a2'} />
          <stop offset="1" stopColor={active ? 'rgb(54,105,148)' : '#888'} />
        </linearGradient>
        <linearGradient id="py2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={active ? 'rgb(255,224,82)' : '#a2a2a2'} />
          <stop offset="1" stopColor={active ? 'rgb(255,195,49)' : '#888'} />
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
      <rect width="24" height="24" rx="2.344" fill={active ? '#3178c6' : '#a2a2a2'} />
      <path
        d="M13.922 11.391H5.531V13.316H8.527V21.891H10.912V13.316H13.922ZM16.21 21.885C16.731 21.982 17.28 22.031 17.857 22.031C18.419 22.031 18.954 21.978 19.46 21.87C19.966 21.762 20.41 21.585 20.791 21.338C21.173 21.091 21.475 20.769 21.697 20.37C21.92 19.972 22.031 19.479 22.031 18.893C22.031 18.467 21.968 18.095 21.84 17.774C21.713 17.454 21.53 17.169 21.29 16.92C21.051 16.671 20.763 16.447 20.428 16.249C20.093 16.051 19.716 15.864 19.295 15.688C18.987 15.561 18.71 15.438 18.466 15.318C18.221 15.198 18.013 15.076 17.842 14.951C17.671 14.826 17.539 14.694 17.446 14.555C17.353 14.416 17.307 14.258 17.307 14.082C17.307 13.921 17.348 13.775 17.432 13.646C17.515 13.516 17.632 13.405 17.784 13.312C17.935 13.219 18.121 13.147 18.341 13.096C18.561 13.044 18.806 13.019 19.075 13.019C19.27 13.019 19.477 13.034 19.695 13.063C19.912 13.092 20.131 13.137 20.351 13.198C20.571 13.26 20.785 13.337 20.993 13.429C21.201 13.522 21.393 13.63 21.569 13.752V11.56C21.212 11.423 20.822 11.321 20.399 11.255C19.976 11.189 19.491 11.156 18.943 11.156C18.385 11.156 17.857 11.216 17.358 11.336C16.859 11.456 16.42 11.643 16.041 11.897C15.662 12.151 15.363 12.475 15.143 12.869C14.923 13.262 14.813 13.733 14.813 14.28C14.813 14.979 15.014 15.576 15.418 16.069C15.821 16.563 16.434 16.981 17.255 17.323C17.578 17.455 17.879 17.585 18.158 17.712C18.437 17.839 18.677 17.971 18.88 18.108C19.083 18.245 19.243 18.394 19.361 18.555C19.478 18.717 19.537 18.9 19.537 19.105C19.537 19.257 19.5 19.397 19.427 19.527C19.354 19.657 19.242 19.769 19.093 19.864C18.944 19.96 18.758 20.034 18.536 20.088C18.313 20.142 18.053 20.169 17.754 20.169C17.246 20.169 16.742 20.079 16.243 19.901C15.744 19.723 15.282 19.455 14.856 19.098V21.445C15.238 21.64 15.689 21.787 16.21 21.885Z"
        fill="white"
      />
    </svg>
  );
}

export function HeroCodeEditor() {
  const [lang, setLang] = useState<Lang>('python');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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
      {/* Install command bar — dark, rounded, bordered */}
      <div className="flex items-center overflow-hidden rounded-[10px] border border-[#252525] bg-[#161616]">
        {/* Language icon switcher */}
        <div className="flex items-center gap-0.5 rounded-[10px] bg-[#0a0a0a] p-1">
          <button
            onClick={() => setLang('python')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              lang === 'python'
                ? 'border border-[#252525] bg-[#161616]'
                : 'hover:bg-[#161616]/60'
            }`}
          >
            <PythonIcon active={lang === 'python'} />
          </button>
          <button
            onClick={() => setLang('typescript')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              lang === 'typescript'
                ? 'border border-[#252525] bg-[#161616]'
                : 'hover:bg-[#161616]/60'
            }`}
          >
            <TSIcon active={lang === 'typescript'} />
          </button>
        </div>

        {/* Separator */}
        <div className="mx-3 h-[18px] w-px bg-[#252525]" />

        {/* Install command */}
        <code className="flex-1 font-mono text-sm text-[#a2a2a2]">
          {installCommands[lang]}
        </code>

        {/* Copy button */}
        <button
          onClick={handleCopyInstall}
          className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[#252525] bg-[#161616] transition-colors hover:bg-[#252525]"
        >
          {copiedInstall ? (
            <svg width="16" height="16" viewBox="0 0 256 256" fill="#10b981">
              <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 256 256" fill="#a2a2a2">
              <path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Code editor — dark, rounded, bordered */}
      <div className="relative overflow-hidden rounded-lg border border-[#252525] bg-[#161616]">
        <SandpackProvider
          key={lang}
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
              code: lang === 'python' ? pythonCode : typescriptCode,
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

        {/* Copy code button — top right */}
        <button
          onClick={handleCopyCode}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#252525] bg-[#161616] transition-colors hover:bg-[#252525]"
        >
          {copiedCode ? (
            <svg width="16" height="16" viewBox="0 0 256 256" fill="#10b981">
              <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 256 256" fill="#a2a2a2">
              <path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
