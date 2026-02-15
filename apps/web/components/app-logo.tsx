import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  const logo = (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/images/vex-icon-black-transparent.svg"
        alt="Vex"
        width={28}
        height={28}
        className="block dark:hidden"
      />
      <Image
        src="/images/vex-icon-white-transparent.svg"
        alt="Vex"
        width={28}
        height={28}
        className="hidden dark:block"
      />
      <span className="text-foreground text-lg font-semibold tracking-tight">
        Vex
      </span>
    </div>
  );

  if (href === null) {
    return logo;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'} prefetch={true}>
      {logo}
    </Link>
  );
}
