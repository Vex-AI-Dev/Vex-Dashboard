'use client';

import { useState } from 'react';

import { cn } from '@kit/ui/utils';

// Syntax highlighting via JSX spans
function PythonCode() {
  return (
    <pre className="whitespace-pre font-mono text-[13px] leading-[1.8]">
      <span className="text-purple-400">from</span> vex{' '}
      <span className="text-purple-400">import</span> Vex, VexConfig{'\n'}
      {'\n'}
      guard = <span className="text-blue-400">Vex</span>({'\n'}
      {'    '}api_key=<span className="text-emerald-400">{'"your-api-key"'}</span>,{'\n'}
      {'    '}config=<span className="text-blue-400">VexConfig</span>({'\n'}
      {'        '}mode=<span className="text-emerald-400">{'"sync"'}</span>,{'\n'}
      {'        '}api_url=<span className="text-emerald-400">{'"https://api.tryvex.dev"'}</span>,{'\n'}
      {'    '}),{'\n'}
      ){'\n'}
      {'\n'}
      <span className="text-amber-400">@guard.watch</span>(agent_id=<span className="text-emerald-400">{'"support-bot"'}</span>){'\n'}
      <span className="text-purple-400">def</span>{' '}
      <span className="text-blue-400">handle_ticket</span>(query:{' '}
      <span className="text-pink-400">str</span>) -{'>'}
      {' '}<span className="text-pink-400">str</span>:{'\n'}
      {'    '}<span className="text-purple-400">return</span>{' '}
      <span className="text-blue-400">call_llm</span>(query){'\n'}
      {'\n'}
      result = <span className="text-blue-400">handle_ticket</span>(
      <span className="text-emerald-400">{'"How do I reset my password?"'}</span>){'\n'}
      <span className="text-blue-400">print</span>(result.action){'      '}
      <span className="text-neutral-500"># &quot;pass&quot; | &quot;flag&quot; | &quot;block&quot;</span>{'\n'}
      <span className="text-blue-400">print</span>(result.confidence){'   '}
      <span className="text-neutral-500"># 0.92</span>
    </pre>
  );
}

function TypeScriptCode() {
  return (
    <pre className="whitespace-pre font-mono text-[13px] leading-[1.8]">
      <span className="text-purple-400">import</span> {'{ '}Vex{' }'}{' '}
      <span className="text-purple-400">from</span>{' '}
      <span className="text-emerald-400">{`'@vex_dev/sdk'`}</span>;{'\n'}
      {'\n'}
      <span className="text-purple-400">const</span> guard ={' '}
      <span className="text-purple-400">new</span>{' '}
      <span className="text-blue-400">Vex</span>({'{'}
      {'\n'}
      {'  '}apiKey: <span className="text-emerald-400">{`'your-api-key'`}</span>,{'\n'}
      {'  '}config: {'{ '}mode: <span className="text-emerald-400">{`'sync'`}</span>{' }'}
      {'\n'}
      {'}'});{'\n'}
      {'\n'}
      <span className="text-purple-400">const</span> result ={' '}
      <span className="text-purple-400">await</span> guard.
      <span className="text-blue-400">watch</span>(
      <span className="text-emerald-400">{`'support-bot'`}</span>,{' '}
      <span className="text-purple-400">async</span> () ={'> {'}
      {'\n'}
      {'  '}<span className="text-purple-400">return await</span>{' '}
      <span className="text-blue-400">callLLM</span>(query);{'\n'}
      {'}'});{'\n'}
      {'\n'}
      console.<span className="text-blue-400">log</span>(result.action);{'     '}
      <span className="text-neutral-500">// &quot;pass&quot; | &quot;flag&quot; | &quot;block&quot;</span>{'\n'}
      console.<span className="text-blue-400">log</span>(result.confidence);{' '}
      <span className="text-neutral-500">// 0.92</span>
    </pre>
  );
}

type Lang = 'python' | 'typescript';

export function CodeExample() {
  const [lang, setLang] = useState<Lang>('python');

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="flex border-b">
        {(['python', 'typescript'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setLang(tab)}
            className={cn(
              'text-muted-foreground border-b-2 border-transparent px-5 py-3 text-[13px] font-medium transition-colors',
              lang === tab && 'text-foreground border-b-emerald-500',
              lang !== tab && 'hover:text-secondary-foreground',
            )}
          >
            {tab === 'python' ? 'Python' : 'TypeScript'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto p-6">
        {lang === 'python' ? <PythonCode /> : <TypeScriptCode />}
      </div>
    </div>
  );
}
