import type { Metadata } from 'next';

import { cn } from '@kit/ui/utils';

import { getFontsClassName } from '~/lib/fonts';

import '../styles/globals.css';

/*
 * Tessellating chevron / V pattern — echoes the Vex logo shape.
 * Tile: 80×48 — two nested V strokes for depth.
 */
const CHEVRON_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48'%3E%3Cpath d='M0 0 L40 32 L80 0' fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='1'/%3E%3Cpath d='M0 16 L40 48 L80 16' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`;

export const metadata: Metadata = {
  title: 'Vex — Runtime reliability for AI agents',
  description:
    "Vex is the open-source runtime reliability layer that detects when your AI agent's behavior silently changes in production. Before your customers notice.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Vex — Runtime reliability for AI agents',
    description:
      "Detect when your AI agent's behavior silently changes in production. Before your customers notice.",
    images: [{ url: '/images/og-image.png', width: 800, height: 800 }],
    siteName: 'Vex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vex — Runtime reliability for AI agents',
    description:
      "Detect when your AI agent's behavior silently changes in production.",
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const className = cn(
    'bg-background min-h-screen antialiased',
    getFontsClassName(),
  );

  return (
    <html lang="en" className={cn(className, 'overflow-x-hidden')}>
      <body className="relative overflow-x-hidden">
        {/* Chevron V-pattern background — full page */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: CHEVRON_TILE,
            backgroundSize: '80px 48px',
          }}
        />

        {/* Radial vignette — pattern fades toward edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 30%, transparent 0%, hsl(0 0% 3%) 100%)',
          }}
        />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
