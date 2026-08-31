'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const steps = [
  { id: '01', name: 'Mirada', href: '/conciencia' },
  { id: '02', name: 'Áreas', href: '/experiencia' },
  { id: '03', name: 'Proceso', href: '/accion' },
  { id: '04', name: 'Resonancia', href: '/resonancia' },
  { id: '05', name: 'Coherencia', href: '/coherencia' },
];

export function JourneyTracker() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isChapterPage = steps.some(step => step.href === pathname);
    setIsVisible(isChapterPage);
  }, [pathname]);

  if (!isVisible) return null;

  const currentStepIndex = steps.findIndex(step => step.href === pathname);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <Link
              key={step.id}
              href={step.href}
              className="group relative flex items-center justify-center"
              title={step.name}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-500 border",
                  isActive 
                    ? "bg-primary border-primary scale-150 shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                    : isCompleted 
                      ? "bg-secondary border-secondary" 
                      : "bg-transparent border-foreground/20 hover:border-primary"
                )}
              />
              
              <span className={cn(
                "absolute right-6 px-3 py-1 bg-secondary text-white text-[8px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 transition-all duration-300 pointer-events-none rounded-sm",
                "group-hover:opacity-100 group-hover:-translate-x-2",
                isActive && "opacity-100 -translate-x-2 bg-primary"
              )}>
                {step.id} {step.name}
              </span>

              {index < steps.length - 1 && (
                <div className="absolute top-full w-[1px] h-4 bg-foreground/10" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
