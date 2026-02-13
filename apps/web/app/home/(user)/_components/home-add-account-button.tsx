'use client';

import Link from 'next/link';

import { Button } from '@kit/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { Trans } from '@kit/ui/trans';

interface HomeAddAccountButtonProps {
  className?: string;
  canCreateTeamAccount?: {
    allowed: boolean;
    reason?: string;
  };
}

export function HomeAddAccountButton(props: HomeAddAccountButtonProps) {
  const canCreate = props.canCreateTeamAccount?.allowed ?? true;
  const reason = props.canCreateTeamAccount?.reason;

  const button = (
    <Button
      className={props.className}
      disabled={!canCreate}
      asChild={canCreate}
    >
      {canCreate ? (
        <Link href="/home/addworkspace">
          <Trans i18nKey={'account:createTeamButtonLabel'} />
        </Link>
      ) : (
        <Trans i18nKey={'account:createTeamButtonLabel'} />
      )}
    </Button>
  );

  if (!canCreate && reason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-not-allowed">{button}</span>
          </TooltipTrigger>
          <TooltipContent>
            <Trans i18nKey={reason} defaults={reason} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
