import {
  JetBrains_Mono,
  Playfair_Display,
  Space_Grotesk,
} from 'next/font/google';

import { cn } from '@kit/ui/utils';

const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-fallback',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

const heading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  fallback: ['Georgia', 'serif'],
  preload: true,
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['Fira Code', 'Cascadia Code', 'monospace'],
  preload: true,
  weight: ['400', '500'],
});

export function getFontsClassName() {
  return cn(sans.variable, heading.variable, mono.variable, 'dark');
}
