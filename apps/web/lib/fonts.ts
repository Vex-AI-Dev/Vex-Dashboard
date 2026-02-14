import {
  JetBrains_Mono,
  Playfair_Display,
  Space_Grotesk,
} from 'next/font/google';

import { cn } from '@kit/ui/utils';

/**
 * @sans
 * @description Space Grotesk — product UI (Sentrial design system)
 */
const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-fallback',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * @heading
 * @description Playfair Display — marketing/display headings (Sentrial design system)
 */
const heading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  fallback: ['Georgia', 'serif'],
  preload: true,
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

/**
 * @mono
 * @description JetBrains Mono — code blocks (Sentrial design system)
 */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['Fira Code', 'Cascadia Code', 'monospace'],
  preload: true,
  weight: ['400', '500'],
});

// we export these fonts into the root layout
export { sans, heading, mono };

/**
 * @name getFontsClassName
 * @description Get the class name for the root layout — always dark mode.
 */
export function getFontsClassName(_theme?: string) {
  const font = [sans.variable, heading.variable, mono.variable].reduce<
    string[]
  >((acc, curr) => {
    if (acc.includes(curr)) return acc;
    return [...acc, curr];
  }, []);

  return cn(...font, 'dark');
}
