'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Global error boundary component for the Angela Gomez Portfolio.
 * Catches client-side exceptions and displays a narrative-aligned error screen.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for development diagnosis
    console.error('Next.js Global Error Boundary:', error);
  }, [error]);

  const errorMessage = error?.message || '';
  const isPermissionError = errorMessage.toLowerCase().includes('permission') || 
                           errorMessage.toLowerCase().includes('insufficient');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full space-y-10 text-center bg-white p-12 md:p-16 border border-border/60 rounded-sm shadow-sm">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter uppercase leading-tight">
            Fricción en la <br />
            <span className="italic font-normal text-primary">Narrativa.</span>
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
            {isPermissionError 
              ? 'Parece que hay un ajuste pendiente en las reglas de acceso para mostrar esta crónica. Estamos habitando la verdad técnica para resolverlo.' 
              : 'Hemos encontrado un obstáculo inesperado al cargar la bitácora. La tecnología también tiene sus momentos de vulnerabilidad.'}
          </p>

          <div className="p-6 bg-muted/30 rounded-sm text-[10px] font-mono text-left overflow-auto max-h-40 border border-border/40">
            <span className="text-primary font-bold uppercase block mb-2">Error log:</span>
            {errorMessage || 'Error desconocido o nulo'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()} 
            className="h-12 px-8 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] bg-secondary text-white hover:bg-primary transition-all shadow-md"
          >
            <RefreshCcw className="mr-3 h-4 w-4" /> Reintentar Carga
          </Button>
          <Button 
            variant="outline" 
            asChild
            className="h-12 px-8 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] border-border hover:border-primary transition-all"
          >
            <Link href="/">
              <Home className="mr-3 h-4 w-4" /> Volver al Inicio
            </Link>
          </Button>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 pt-4">
          Bitácora de Sostenibilidad | Ángela Gómez
        </p>
      </div>
    </div>
  );
}
