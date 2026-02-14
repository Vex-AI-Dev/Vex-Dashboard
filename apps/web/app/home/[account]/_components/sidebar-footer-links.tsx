'use client';

import Link from 'next/link';

import { Headset, MessageSquareMore } from 'lucide-react';

import { Trans } from '@kit/ui/trans';

const linkClasses =
  'flex items-center gap-2 rounded px-2 py-1 text-[13px] text-white/80 transition-colors hover:bg-[hsl(210_10%_65%/0.08)] hover:text-white';

export function SidebarFooterLinks() {
  return (
    <div className={'flex flex-col gap-px px-2'}>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined' && window.Featurebase) {
            window.Featurebase('open');
          }
        }}
        className={linkClasses}
      >
        <Headset className={'size-[15px]'} />
        <Trans i18nKey={'agentguard:nav.liveAssist'} defaults={'Live Assist'} />
      </button>

      <Link
        href={'https://vex.featurebase.app'}
        target={'_blank'}
        rel={'noopener noreferrer'}
        className={linkClasses}
      >
        <MessageSquareMore className={'size-[15px]'} />
        <Trans i18nKey={'agentguard:nav.feedback'} defaults={'Feedback'} />
      </Link>
    </div>
  );
}
