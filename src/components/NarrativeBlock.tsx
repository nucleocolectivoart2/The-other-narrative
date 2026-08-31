import React from 'react';
import { cn } from '@/lib/utils';

interface NarrativeBlockProps {
  children: React.ReactNode;
  className?: string;
  quote?: boolean;
}

export function NarrativeBlock({ children, className, quote = false }: NarrativeBlockProps) {
  return (
    <div 
      className={cn(
        "max-w-4xl mx-auto py-16 px-6 transition-all duration-1000",
        quote 
          ? "border-l border-primary/30 pl-10 md:pl-16 my-16 bg-muted/20" 
          : "text-left",
        className
      )}
    >
      <div className={cn(
        "space-y-10 leading-relaxed",
        quote 
          ? "text-3xl md:text-5xl font-headline italic tracking-tighter text-foreground" 
          : "text-xl md:text-2xl font-light text-foreground/70"
      )}>
        {children}
      </div>
    </div>
  );
}