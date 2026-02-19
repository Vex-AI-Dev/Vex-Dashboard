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
import { Shield } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Switch } from '@kit/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

import type { GuardrailRow } from '../_lib/server/guardrails.loader';
import {
  deleteGuardrailAction,
  toggleGuardrailAction,
} from '../_lib/server/guardrails-actions';
import CreateGuardrailDialog from './create-guardrail-dialog';

const RULE_TYPE_LABELS: Record<string, string> = {
  regex: 'agentguard:guardrails.ruleTypeRegex',
  keyword: 'agentguard:guardrails.ruleTypeKeyword',
  threshold: 'agentguard:guardrails.ruleTypeThreshold',
  llm: 'agentguard:guardrails.ruleTypeLlm',
};

interface GuardrailsTableProps {
  guardrails: GuardrailRow[];
  accountSlug: string;
}

export default function GuardrailsTable({
  guardrails,
  accountSlug,
}: GuardrailsTableProps) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [toggling, startToggle] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<GuardrailRow | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;

    startDelete(async () => {
      await deleteGuardrailAction({
        accountSlug,
        guardrailId: deleteTarget.id,
      });

      setDeleteTarget(null);
      router.refresh();
    });
  }

  function handleToggle(guardrail: GuardrailRow) {
    startToggle(async () => {
      await toggleGuardrailAction({
        accountSlug,
        guardrailId: guardrail.id,
        enabled: !guardrail.enabled,
      });

      router.refresh();
    });
  }

  if (guardrails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Shield className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="text-foreground text-sm font-medium">
            <Trans i18nKey="agentguard:guardrails.noGuardrails" />
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-center text-xs">
            <Trans i18nKey="agentguard:guardrails.noGuardrailsDescription" />
          </p>
          <div className="mt-4">
            <CreateGuardrailDialog accountSlug={accountSlug} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey="agentguard:guardrails.pageTitle" />
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="agentguard:guardrails.pageDescription" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.name" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.ruleType" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.action" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.scope" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.status" />
                </TableHead>
                <TableHead>
                  <Trans i18nKey="agentguard:guardrails.actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guardrails.map((g) => (
                <TableRow
                  key={g.id}
                  className={!g.enabled ? 'opacity-50' : ''}
                >
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <Trans
                        i18nKey={
                          RULE_TYPE_LABELS[g.rule_type] ??
                          'agentguard:guardrails.ruleTypeRegex'
                        }
                      />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        g.action === 'block'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }
                    >
                      <Trans
                        i18nKey={`agentguard:guardrails.${g.action}`}
                      />
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {g.agent_id ?? (
                      <Trans i18nKey="agentguard:guardrails.allAgents" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={g.enabled}
                      disabled={toggling}
                      onCheckedChange={() => handleToggle(g)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(g)}
                    >
                      <Trans i18nKey="agentguard:guardrails.delete" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Trans i18nKey="agentguard:guardrails.deleteConfirmTitle" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <Trans
                  i18nKey="agentguard:guardrails.deleteConfirmDescription"
                  values={{ name: deleteTarget.name }}
                />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              <Trans i18nKey="agentguard:guardrails.cancel" />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trans i18nKey="agentguard:guardrails.deleteConfirm" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
