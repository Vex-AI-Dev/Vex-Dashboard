'use client';

import { useEffect } from 'react';

export function PersistLastAccount({ account }: { account: string }) {
  useEffect(() => {
    document.cookie = `last-account=${encodeURIComponent(account)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, [account]);

  return null;
}
