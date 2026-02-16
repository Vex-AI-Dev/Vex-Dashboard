'use client';

import { useEffect } from 'react';

import Script from 'next/script';

declare global {
  interface Window {
    Featurebase: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

interface FeaturebaseMessengerProps {
  email?: string;
  userId?: string;
  userName?: string;
}

export function FeaturebaseMessenger({
  email,
  userId,
  userName,
}: FeaturebaseMessengerProps) {
  useEffect(() => {
    const win = window;

    // Initialize Featurebase if it doesn't exist
    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function (...args: unknown[]) {
        (win.Featurebase.q = win.Featurebase.q || []).push(args);
      };
    }

    // Boot Featurebase messenger with configuration
    const config: Record<string, unknown> = {
      appId: '6990d53c69987751d9a17203',
      theme: 'dark',
      hideDefaultLauncher: true,
    };

    if (email) config.email = email;
    if (userId) config.userId = userId;
    if (userName) config.name = userName;

    win.Featurebase('boot', config);
  }, [email, userId, userName]);

  return (
    <Script
      src="https://do.featurebase.app/js/sdk.js"
      id="featurebase-sdk"
      strategy="afterInteractive"
    />
  );
}

// Function to open the messenger programmatically
export function openFeaturebaseMessenger() {
  if (typeof window !== 'undefined' && window.Featurebase) {
    window.Featurebase('show');
  }
}
