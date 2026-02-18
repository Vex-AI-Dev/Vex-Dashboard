const logos = [
  { name: 'LangChain', icon: '⚡' },
  { name: 'CrewAI', icon: '👥' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'LangGraph', icon: '📊' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Express', icon: '⚙️' },
  { name: 'Python', icon: '🐍' },
  { name: 'TypeScript', icon: 'TS' },
];

export function LogoBar() {
  return (
    <section className="border-y border-[#252525] py-10">
      <div className="container">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-[#585858]">
          Works with your stack
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex w-max gap-12"
            style={{
              animation: 'scrollLogos 20s linear infinite',
            }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-2 text-[#585858] transition-colors hover:text-[#a2a2a2]"
              >
                <span className="text-lg">{logo.icon}</span>
                <span className="whitespace-nowrap text-sm font-medium">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
