import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://tryvex.dev${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-[#585858]">
        {items.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-white">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#a2a2a2]">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
