import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export function AppLogo({
  href,
  className,
  variant = 'logo',
}: {
  href?: string;
  className?: string;
  variant?: 'logo' | 'mark';
}) {
  const isLogo = variant === 'logo';

  const logo = (
    <div className={cn('flex items-center', className)}>
      <Image
        src={
          isLogo
            ? '/images/vex-logo-white-transparent.svg'
            : '/images/vex-mark-white-transparent.svg'
        }
        alt="Vex"
        width={isLogo ? 80 : 28}
        height={isLogo ? 33 : 28}
        priority
      />
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
