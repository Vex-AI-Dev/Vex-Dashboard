'use client';

import { useState } from 'react';

import { Plus, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

import { sendInvitesAction } from '../_lib/server-actions';

interface Invite {
  email: string;
  role: 'owner' | 'member';
}

interface StepInviteTeamProps {
  accountSlug: string;
  onNext: () => void;
  onBack: () => void;
}

export function StepInviteTeam({
  accountSlug,
  onNext,
  onBack: _onBack,
}: StepInviteTeamProps) {
  const { t } = useTranslation('agentguard');
  const [invites, setInvites] = useState<Invite[]>([
    { email: '', role: 'member' },
  ]);
  const [loading, setLoading] = useState(false);

  const addInvite = () => {
    setInvites((prev) => [...prev, { email: '', role: 'member' }]);
  };

  const removeInvite = (index: number) => {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInvite = (index: number, field: keyof Invite, value: string) => {
    setInvites((prev) =>
      prev.map((inv, i) => (i === index ? { ...inv, [field]: value } : inv)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validInvites = invites.filter((inv) => inv.email.trim());

    if (validInvites.length === 0) {
      onNext();
      return;
    }

    setLoading(true);

    try {
      await sendInvitesAction({
        accountSlug,
        invites: validInvites,
      });

      onNext();
    } catch {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Heading + description centered outside card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('onboarding.step2Title')}
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-center">
          {t('onboarding.step2Description')}
        </p>
      </motion.div>

      {/* Card with invite rows */}
      <motion.div
        className="border-border/50 bg-card/50 space-y-3 rounded-xl border p-6 md:p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {invites.map((invite, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="email"
              value={invite.email}
              onChange={(e) => updateInvite(index, 'email', e.target.value)}
              placeholder={t('onboarding.step2Placeholder')}
              className="flex-1"
            />
            <Select
              value={invite.role}
              onValueChange={(v) => updateInvite(index, 'role', v)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  {t('onboarding.step2RoleMember')}
                </SelectItem>
                <SelectItem value="owner">
                  {t('onboarding.step2RoleAdmin')}
                </SelectItem>
              </SelectContent>
            </Select>
            {invites.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeInvite(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addInvite}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t('onboarding.step2AddAnother')}
        </Button>
      </motion.div>

      {/* CTA button centered, auto-width */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="rounded-lg px-8"
          size="lg"
        >
          {t('onboarding.next')}
        </Button>

        {/* Skip as text link */}
        <button
          type="button"
          onClick={onNext}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('onboarding.step2Skip')}
        </button>
      </motion.div>
    </form>
  );
}
