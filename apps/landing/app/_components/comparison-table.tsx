const rows = [
  {
    feature: 'When',
    evals: 'Before deployment',
    tracing: 'After something breaks',
    vex: 'Continuously in production',
  },
  {
    feature: 'What it tells you',
    evals: '"Agent was good"',
    tracing: '"Here\'s what happened"',
    vex: '"Agent just changed"',
  },
  {
    feature: 'Catches drift?',
    evals: 'No',
    tracing: 'No',
    vex: 'Yes',
  },
  {
    feature: 'Auto-corrects?',
    evals: 'No',
    tracing: 'No',
    vex: 'Yes',
  },
  {
    feature: 'Setup',
    evals: 'Test suites, datasets',
    tracing: 'Instrumentation, dashboards',
    vex: '3 lines of code',
  },
];

export function ComparisonTable() {
  return (
    <div className="mt-12 overflow-x-auto border border-[#252525] bg-[#0a0a0a]">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-[#252525] px-5 py-3.5 text-left text-[13px] font-semibold text-[#a2a2a2]" />
            <th className="border-b border-[#252525] px-5 py-3.5 text-left text-[13px] font-semibold text-[#a2a2a2]">
              Evals / Testing
            </th>
            <th className="border-b border-[#252525] px-5 py-3.5 text-left text-[13px] font-semibold text-[#a2a2a2]">
              Tracing (LangSmith etc.)
            </th>
            <th className="border-b border-l border-[#252525] border-l-emerald-500/40 bg-emerald-500/[0.08] px-5 py-3.5 text-left text-[13px] font-semibold text-emerald-500">
              Vex
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="transition-colors hover:bg-[#161616]"
            >
              <td className="border-b border-[#252525] px-5 py-3.5 font-medium text-white">
                {row.feature}
              </td>
              <td className="border-b border-[#252525] px-5 py-3.5 text-[#a2a2a2]">
                {row.evals}
              </td>
              <td className="border-b border-[#252525] px-5 py-3.5 text-[#a2a2a2]">
                {row.tracing}
              </td>
              <td className="border-b border-l border-[#252525] border-l-emerald-500/40 bg-emerald-500/[0.08] px-5 py-3.5 font-semibold text-emerald-500">
                {row.vex}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
