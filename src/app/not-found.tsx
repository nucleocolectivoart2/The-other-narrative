import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs">Error 404</span>
        <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight text-foreground">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground font-light leading-relaxed">
          El contenido que buscas no está disponible o ha cambiado de ruta en el ecosistema.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
