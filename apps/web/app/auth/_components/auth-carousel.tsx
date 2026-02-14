'use client';

import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    muted: 'See drift.',
    bold: 'Fix it before it ships.',
    description:
      'Real-time observability and auto-correction for all your AI agents.',
  },
  {
    muted: 'Every agent call.',
    bold: 'Observed and logged.',
    description:
      'Full trace of tool calls, user comms, and session context — searchable in seconds.',
  },
  {
    muted: 'Hallucinations detected.',
    bold: 'Automatically corrected.',
    description:
      'Three layers of correction cascade bring your agent back on track before users notice.',
  },
];

const INTERVAL = 5000;

export function AuthCarousel() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[active]!;

  return (
    <div className="relative z-10 flex max-w-md flex-col items-center px-12 text-center">
      {/* Slide content with crossfade */}
      <div className="min-h-[160px]">
        <p
          key={`muted-${active}`}
          className="text-muted-foreground animate-in fade-in duration-500 text-3xl font-light leading-snug"
        >
          {slide.muted}
        </p>
        <p
          key={`bold-${active}`}
          className="text-foreground animate-in fade-in duration-500 mt-1 text-3xl font-semibold leading-snug"
        >
          {slide.bold}
        </p>
        <p
          key={`desc-${active}`}
          className="text-muted-foreground animate-in fade-in duration-500 mt-6 text-base leading-relaxed"
        >
          {slide.description}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="mt-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? 'bg-foreground w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
