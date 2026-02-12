'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@kit/ui/alert-dialog';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

import { formatTimestamp } from '~/lib/agentguard/formatters';
import type { ApiKeyDisplay } from '~/lib/agentguard/types';

import { revokeApiKeyAction } from '../_lib/server/api-keys-actions';

interface ApiKeysTableProps {
  keys: ApiKeyDisplay[];
  accountSlug: string;
}

export default function ApiKeysTable({ keys, accountSlug }: ApiKeysTableProps) {
  const router = useRouter();
  const [revoking, startRevoke] = useTransition();
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyDisplay | null>(null);

  function handleRevoke() {
    if (!revokeTarget) return;

    startRevoke(async () => {
      await revokeApiKeyAction({
        accountSlug,
        keyId: revokeTarget.id,
      });

      setRevokeTarget(null);
      router.refresh();
    });
  }

  if (keys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground mb-2 text-4xl">&#128273;</div>
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="agentguard:apiKeys.noKeys" />
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            <Trans i18nKey="agentguard:apiKeys.noKeysDescription" />
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:apiKeys.pageTitle" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:apiKeys.pageDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.name" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.key" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.scopes" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.rateLimit" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.expires" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.lastUsed" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.status" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:apiKeys.actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <TableRow
                  key={apiKey.id}
                  className={apiKey.revoked ? 'opacity-50' : ''}
                >
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                      {apiKey.prefix}
                      {'••••'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="text-xs"
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {apiKey.rate_limit_rpm.toLocaleString()} rpm
                  </TableCell>
                  <TableCell className="text-sm">
                    {apiKey.expires_at ? (
                      formatTimestamp(apiKey.expires_at)
                    ) : (
                      <Trans i18nKey="agentguard:apiKeys.never" />
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {apiKey.last_used_at ? (
                      formatTimestamp(apiKey.last_used_at)
                    ) : (
                      <Trans i18nKey="agentguard:apiKeys.never" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        apiKey.revoked
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }
                    >
                      {apiKey.revoked ? (
                        <Trans i18nKey="agentguard:apiKeys.revoked" />
                      ) : (
                        <Trans i18nKey="agentguard:apiKeys.active" />
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!apiKey.revoked && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRevokeTarget(apiKey)}
                      >
                        <Trans i18nKey="agentguard:apiKeys.revokeKey" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Trans i18nKey="agentguard:apiKeys.revokeConfirmTitle" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget && (
                <Trans
                  i18nKey="agentguard:apiKeys.revokeConfirmDescription"
                  values={{ name: revokeTarget.name }}
                />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>
              <Trans i18nKey="agentguard:apiKeys.cancel" />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trans i18nKey="agentguard:apiKeys.revokeConfirm" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
