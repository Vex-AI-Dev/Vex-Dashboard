import type { ConceptComparison } from '~/lib/pseo/types';

import { CtaBanner } from './cta-banner';

export function ConceptComparisonRenderer({ comparison }: { comparison: ConceptComparison }) {
  const { content } = comparison;

  return (
    <div>
      <p className="mb-10 text-lg leading-relaxed text-[#a2a2a2]">{content.intro}</p>

      {/* Side-by-side approaches */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        {[content.approachA, content.approachB].map((approach) => (
          <div key={approach.name} className="rounded-xl border border-[#252525] bg-[#0a0a0a] p-6">
            <h2 className="mb-3 text-lg font-bold text-white">{approach.name}</h2>
            <p className="mb-4 text-sm text-[#a2a2a2]">{approach.description}</p>
            <div className="mb-3">
              <h3 className="mb-2 text-xs font-medium tracking-widest text-emerald-500 uppercase">
                Strengths
              </h3>
              <ul className="grid gap-1">
                {approach.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#a2a2a2]">
                    <span className="text-emerald-500">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium tracking-widest text-red-400 uppercase">
                Weaknesses
              </h3>
              <ul className="grid gap-1">
                {approach.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#a2a2a2]">
                    <span className="text-red-400">-</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mb-10 overflow-hidden rounded-xl border border-[#252525]">
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#161616] px-6 py-3 text-sm font-medium">
          <span className="text-[#585858]">Dimension</span>
          <span className="text-emerald-400">{content.approachA.name}</span>
          <span className="text-[#a2a2a2]">{content.approachB.name}</span>
        </div>
        {content.comparison.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_1fr_1fr] px-6 py-3 text-sm ${
              i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#0f0f0f]'
            }`}
          >
            <span className="font-medium text-white">{row.dimension}</span>
            <span className="text-[#a2a2a2]">{row.approachA}</span>
            <span className="text-[#a2a2a2]">{row.approachB}</span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="mb-10 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="mb-2 text-lg font-bold text-white">{content.recommendation.heading}</h2>
        <p className="text-sm text-[#a2a2a2]">{content.recommendation.summary}</p>
      </div>

      <CtaBanner heading={content.cta.heading} description={content.cta.description} />
    </div>
  );
}
