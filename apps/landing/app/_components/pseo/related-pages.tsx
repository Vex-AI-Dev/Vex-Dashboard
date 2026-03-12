import Link from 'next/link';

interface RelatedPage {
  title: string;
  href: string;
  description?: string;
}

export function RelatedPages({ pages, heading = 'Related' }: { pages: RelatedPage[]; heading?: string }) {
  if (pages.length === 0) return null;

  return (
    <div className="mt-12 rounded-xl border border-[#252525] bg-[#0a0a0a] p-6">
      <h3 className="mb-4 text-sm font-medium tracking-widest text-[#585858] uppercase">{heading}</h3>
      <div className="grid gap-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group flex flex-col rounded-lg border border-[#1a1a1a] p-3 transition-colors hover:border-[#252525] hover:bg-[#111]"
          >
            <span className="text-sm font-medium text-white group-hover:text-emerald-400">
              {page.title}
            </span>
            {page.description && (
              <span className="mt-1 text-xs text-[#585858]">{page.description}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
