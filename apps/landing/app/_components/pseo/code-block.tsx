'use client';

import { useState } from 'react';

export function CodeBlock({
  code,
  language = 'python',
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 rounded-xl border border-[#252525] bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-[#252525] px-4 py-2">
        <span className="text-xs text-[#585858]">{language}</span>
        <button
          onClick={copy}
          className="text-xs text-[#585858] transition-colors hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[#a2a2a2]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
