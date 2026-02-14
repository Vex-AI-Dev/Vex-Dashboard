'use client';

import { useEffect } from 'react';

import Script from 'next/script';

import { useUser } from '@kit/supabase/hooks/use-user';

declare global {
  interface Window {
    Featurebase: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

const FEATUREBASE_APP_ID = '6990d53c69987751d9a17203';

export function FeaturebaseMessenger() {
  const user = useUser();
  const userData = user.data;

  useEffect(() => {
    const win = window;

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function (...args: unknown[]) {
        (win.Featurebase.q = win.Featurebase.q || []).push(args);
      };
    }

    win.Featurebase('boot', {
      appId: FEATUREBASE_APP_ID,
      ...(userData?.email ? { email: userData.email } : {}),
      ...(userData?.id ? { userId: userData.id } : {}),
      theme: 'dark',
      language: 'en',
      hideDefaultLauncher: true,
    });
  }, [userData]);

  return (
    <Script
      src="https://do.featurebase.app/js/sdk.js"
      id="featurebase-sdk"
      strategy="afterInteractive"
    />
  );
}
