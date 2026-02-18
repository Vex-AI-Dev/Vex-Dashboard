import Link from 'next/link';

import { cn } from '@kit/ui/utils';

import { AnimatedLogo } from './animated-logo';

export function AppLogo({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const logo = (
    <div className={cn('flex items-center', className)}>
      <AnimatedLogo width={140} height={50} fontSize={28} numParticles={200} />
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
