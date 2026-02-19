import type { TocHeading } from '~/lib/blog';

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-xl border border-[#252525] bg-[#161616] p-5"
    >
      <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-widest text-[#585858]">
        On this page
      </p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-[#a2a2a2] transition-colors hover:text-emerald-400"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
