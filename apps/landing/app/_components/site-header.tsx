import Link from 'next/link';

import { AppLogo } from '~/components/app-logo';

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/60 backdrop-blur-xl">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <AppLogo href="/" />

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              How It Works
            </a>
            <a
              href="https://docs.tryvex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/Vex-AI-Dev/Python-SDK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Vex-AI-Dev/Python-SDK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:border-muted-foreground hidden items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] transition-colors lg:flex"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Star
            </a>

            <a
              href="https://cal.com/tryvex/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center rounded-md border border-white/[0.15] bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/[0.25] hover:bg-white/[0.14] hover:text-white md:flex"
            >
              Book a Demo
            </a>

            <Link
              href="https://app.tryvex.dev"
              className="inline-flex h-8 items-center rounded-md bg-white px-3 text-xs font-medium text-black shadow-sm transition-all duration-150 hover:scale-[1.04] hover:bg-white/90 hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
