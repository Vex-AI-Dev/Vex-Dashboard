'use client';

import { Headset } from 'lucide-react';

import { openFeaturebaseMessenger } from './featurebase-messenger';

export function LiveSupportButton() {
  return (
    <button
      onClick={() => openFeaturebaseMessenger()}
      className="text-muted-foreground hover:bg-secondary hover:text-foreground flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors group-data-[minimized=true]/sidebar:justify-center"
    >
      <Headset className="h-5 w-5" />
      <span className="group-data-[minimized=true]/sidebar:hidden">
        Live Support
      </span>
    </button>
  );
}
