import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export function AppLogo({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const logo = (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/images/vex-logo-white-transparent.svg"
        alt="Vex"
        width={32}
        height={32}
      />
      <span className="text-lg font-semibold tracking-tight text-white">
        Vex
      </span>
    </div>
  );

  if (!href) {
    return logo;
  }

  return (
    <Link aria-label="Home Page" href={href}>
      {logo}
    </Link>
  );
}
