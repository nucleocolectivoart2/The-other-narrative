"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { 
  FileDown, 
  BookOpen, 
  Layers, 
  Search, 
  X, 
  SlidersHorizontal, 
  ExternalLink, 
  Sparkles, 
  FileEdit, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  format?: string;
  pages?: string;
  downloadUrl: string;
  coverImage?: string;
  downloadsCount?: number;
  featured?: boolean;
  createdAt?: string;
}

const defaultResources: ResourceItem[] = [
  {
    id: 'rec-1',
    title: 'Manifiesto de Comunicación Regenerativa',
    description: 'Principios y brújula ética para diseñar relatos que transforman la relación entre organizaciones, comunidades y ecosistemas vivos.',
    category: 'Manifiesto',
    format: 'PDF Editorial',
    pages: '16 páginas',
    downloadUrl: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/11%20Laboratorio%20Editorial.png',
    coverImage: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/11%20Laboratorio%20Editorial.png',
    downloadsCount: 142,
    featured: true
  },
  {
    id: 'rec-2',
    title: 'Toolkit: Cartografía de Confianza Territorial',
    description: 'Herramientas de diagnóstico y facilitación para mapear percepciones, narrativas latentes y brechas de legitimidad en territorio.',
    category: 'Toolkit',
    format: 'Guía de Facilitación',
    pages: '28 páginas • Metodología',
    downloadUrl: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/07.png',
    coverImage: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/07.png',
    downloadsCount: 98,
    featured: false
  },
  {
    id: 'rec-3',
    title: 'Guía Metodológica: Diálogo Sincero vs. Greenwashing',
    description: 'Marco reflexivo y operacional para equipos de sostenibilidad que buscan trascender el reporte cuantitativo hacia compromisos verificables.',
    category: 'Guía Metodológica',
    format: 'Framework de Trabajo',
    pages: '14 páginas',
    downloadUrl: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/09.png',
    coverImage: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/09.png',
    downloadsCount: 215,
    featured: false
  }
];

export default function RecursosPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'experiencia');

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem('medular_admin_session');
      if (session || user) {
        setIsAdmin(true);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const resourcesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'resources'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: firestoreResources, isLoading } = useCollection(resourcesQuery);

  const rawResources: ResourceItem[] = (firestoreResources && firestoreResources.length > 0)
    ? firestoreResources as unknown as ResourceItem[]
    : defaultResources;

  const categories = Array.from(new Set([
    'Toolkit',
    'Guía Metodológica',
    'Manifiesto',
    'Investigación',
    ...rawResources.map(r => r.category).filter(Boolean)
  ]));

  const filteredResources = rawResources.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesQ = !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  const handleDownload = async (resource: ResourceItem) => {
    setDownloadingId(resource.id);
    try {
      // Intentar actualizar el contador si existe en Firestore
      if (firestore && resource.id && !resource.id.startsWith('rec-')) {
        const resourceRef = doc(firestore, 'resources', resource.id);
        await updateDoc(resourceRef, {
          downloadsCount: increment(1)
        });
      }
    } catch (e) {
      console.warn('No se pudo incrementar el contador:', e);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
        if (resource.downloadUrl) {
          window.open(resource.downloadUrl, '_blank', 'noopener,noreferrer');
        }
      }, 400);
    }
  };

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Banner */}
      <section className="relative h-[55vh] sm:h-[65vh] w-full flex items-end pb-16 sm:pb-20 overflow-hidden border-b bg-stone-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_02%20experiencia.png'}
            alt="Biblioteca de Recursos"
            fill
            className="object-cover opacity-30 transition-all duration-[4000ms]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <div className="section-container relative z-10 w-full text-foreground">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[9px] sm:text-[10px] mb-4 sm:mb-6 block animate-in slide-in-from-bottom-4 duration-700">
            Conocimiento Libre & Prácticas Vivas
          </span>
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-headline leading-[0.95] mb-6 tracking-tight">
              Biblioteca de <br />
              <span className="italic font-normal text-primary">Recursos.</span>
            </h1>
            <p className="text-base sm:text-xl font-light text-foreground/80 leading-relaxed max-w-2xl">
              Toolkits, marcos de facilitación, manifiestos y guías metodológicas para transformar la comunicación organizacional en un puente de confianza con los territorios.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Quick Action Bar */}
      {isAdmin && (
        <div className="bg-muted/40 border-b border-border/60 py-3.5 px-4 sm:px-8">
          <div className="section-container flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">Gestión de Biblioteca:</span>
              <span>{rawResources.length} materiales disponibles</span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>Administrar en CMS</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filters and List */}
      <div className="section-container py-12 sm:py-16">
        {/* Controls */}
        <div className="mb-12 space-y-6 pb-8 border-b border-border/60">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, temática o formato..."
                className="w-full pl-10 pr-10 py-2.5 bg-muted/20 hover:bg-muted/30 focus:bg-background border border-border/70 rounded-full text-sm outline-none focus:border-primary transition-all placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Borrar búsqueda"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Contador */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>
                Mostrando <strong className="text-foreground">{filteredResources.length}</strong> {filteredResources.length === 1 ? 'recurso' : 'recursos'}
                {selectedCategory !== 'all' && <span> en <strong className="text-primary">{selectedCategory}</strong></span>}
              </span>
            </div>
          </div>

          {/* Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1 mr-2 flex-shrink-0">
              <SlidersHorizontal className="h-3 w-3" /> Categoría:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              Todos ({rawResources.length})
            </button>
            {categories.map((cat) => {
              const count = rawResources.filter(r => r.category?.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all flex-shrink-0 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}

            {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-primary font-medium hover:underline ml-auto flex-shrink-0 pl-3 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 opacity-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Cargando Biblioteca</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-24 space-y-4 border border-dashed rounded-lg p-12 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold font-headline">No se encontraron materiales</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No hay recursos que coincidan con los filtros seleccionados. Puedes restablecer los criterios o explorar otras categorías.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
            >
              <X className="h-3.5 w-3.5" /> Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all duration-300 p-6 sm:p-8 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/10 text-primary">
                      {resource.category}
                    </span>
                    {resource.pages && (
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {resource.pages}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-headline leading-snug mb-3 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h2>

                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/50 flex items-center justify-between gap-4">
                  <div className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground font-semibold">{resource.downloadsCount || 0}</strong> descargas
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(resource)}
                    disabled={downloadingId === resource.id}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
                  >
                    {downloadingId === resource.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Abriendo...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="h-3.5 w-3.5" />
                        <span>Descargar</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Banner de Solicitud de Materiales Personalizados */}
        <div className="mt-20 p-8 sm:p-12 rounded-2xl border border-border/80 bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
              Co-Creación Metodológica
            </span>
            <h3 className="text-2xl sm:text-3xl font-headline font-bold">
              ¿Requieres un marco metodológico adaptado a tu territorio u organización?
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Diseñamos guías, protocolos de escucha y narrativas de confianza a la medida de desafíos corporativos, comunitarios y ambientales complejos.
            </p>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex-shrink-0"
          >
            <span>Solicitar Acompañamiento</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
