import Link from 'next/link';

export function CtaBanner({
  heading = 'Start verifying your agents in minutes',
  description = 'Add Vex to your agent pipeline with two lines of code.',
}: {
  heading?: string;
  description?: string;
}) {
  return (
    <div className="mt-16 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-white">{heading}</h2>
      <p className="mb-6 text-[#a2a2a2]">{description}</p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <code className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-4 py-2 font-mono text-sm text-emerald-400">
          pip install vex-sdk
        </code>
        <Link
          href="https://app.tryvex.dev"
          className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-emerald-400"
        >
          Get API Key
        </Link>
      </div>
    </div>
  );
}
