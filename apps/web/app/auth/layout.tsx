import Image from 'next/image';

import { AuthLayoutShell } from '@kit/auth/shared';

function VexLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src="/images/vex-icon-black-transparent.svg"
        alt="Vex"
        width={140}
        height={140}
        className="block dark:hidden"
        priority
      />
      <Image
        src="/images/vex-icon-white-transparent.svg"
        alt="Vex"
        width={140}
        height={140}
        className="hidden dark:block"
        priority
      />
    </div>
  );
}

function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <AuthLayoutShell Logo={VexLogo} className="gap-y-4 lg:gap-y-4">
      {children}
    </AuthLayoutShell>
  );
}

export default AuthLayout;
