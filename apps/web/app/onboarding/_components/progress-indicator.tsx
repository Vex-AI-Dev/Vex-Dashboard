'use client';

import { cn } from '@kit/ui/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="fixed right-0 bottom-8 left-0 z-50 flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <div
            key={i}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-300',
              isCurrent && 'bg-foreground',
              isCompleted && 'bg-muted-foreground/50',
              !isCurrent && !isCompleted && 'bg-muted-foreground/30',
            )}
            aria-label={`Step ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
