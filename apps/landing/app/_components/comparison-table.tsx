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
    <div className="-webkit-overflow-scrolling-touch mt-12 overflow-x-auto rounded-xl border border-white/[0.12] bg-white/[0.04] shadow-lg shadow-black/20 backdrop-blur-xl">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-muted-foreground border-b px-5 py-3.5 text-left text-[13px] font-semibold" />
            <th className="text-muted-foreground border-b px-5 py-3.5 text-left text-[13px] font-semibold">
              Evals / Testing
            </th>
            <th className="text-muted-foreground border-b px-5 py-3.5 text-left text-[13px] font-semibold">
              Tracing (LangSmith etc.)
            </th>
            <th className="border-b border-l-2 border-l-emerald-500/40 bg-emerald-500/[0.08] px-5 py-3.5 text-left text-[13px] font-semibold text-emerald-500">
              Vex
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="text-foreground border-b border-border/50 px-5 py-3.5 font-medium">
                {row.feature}
              </td>
              <td className="text-muted-foreground border-b border-border/50 px-5 py-3.5">
                {row.evals}
              </td>
              <td className="text-muted-foreground border-b border-border/50 px-5 py-3.5">
                {row.tracing}
              </td>
              <td className="border-b border-border/50 border-l-2 border-l-emerald-500/40 bg-emerald-500/[0.08] px-5 py-3.5 font-semibold text-emerald-500">
                {row.vex}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
