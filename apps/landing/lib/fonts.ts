import { Inter, JetBrains_Mono } from 'next/font/google';

import { cn } from '@kit/ui/utils';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-fallback',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['Fira Code', 'Cascadia Code', 'monospace'],
  preload: true,
  weight: ['400', '500'],
});

export function getFontsClassName() {
  return cn(sans.variable, mono.variable, 'dark');
}
