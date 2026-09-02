
"use client";

import React, { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Loader2, FileEdit, Eye, Sparkles, Search, X, SlidersHorizontal, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockArticles = [
  {
    id: 'mock-1',
    slug: 'el-silencio-de-los-datos-esg',
    title: '¿De qué hablamos cuando no hablamos de datos?',
    excerpt: 'Una reflexión sobre por qué la métrica ESG a menudo se queda en la superficie y cómo habitamos la verdad en la cadena de valor.',
    image: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/11%20Laboratorio%20Editorial.png',
    type: 'Reflexión',
    status: 'published',
    date: '2025-02-19',
    readTime: 10
  },
  {
    id: 'mock-2',
    slug: 'el-lenguaje-del-territorio-cop16',
    title: 'COP16: Lo que el territorio nos gritó al oído',
    excerpt: 'Más allá de las conferencias, la biodiversidad es un diálogo técnico que requiere humildad operativa.',
    image: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/07.png',
    type: 'Crónica',
    status: 'published',
    date: '2025-02-18',
    readTime: 8
  }
];

export default function BlogPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'bitacora');

  const [isAdmin, setIsAdmin] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const articlesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'contentItems'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: firestoreArticles, isLoading } = useCollection(articlesQuery);

  const allArticles = firestoreArticles || [];
  const publishedArticles = allArticles.filter(item => item.status !== 'draft');
  const draftArticles = allArticles.filter(item => item.status === 'draft');

  // Decide base pool of articles
  const baseArticles = (() => {
    if (allArticles.length === 0) {
      return mockArticles;
    }
    if (showDrafts && isAdmin) {
      return allArticles;
    }
    return publishedArticles.length > 0 ? publishedArticles : [];
  })();

  // Extract unique categories from pool
  const categories = Array.from(new Set([
    'Reflexión',
    'Crónica',
    'Entrevista',
    'Investigación',
    ...baseArticles.map(a => a.type).filter(Boolean)
  ]));

  // Filter by category and search
  const filteredArticles = baseArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.type?.toLowerCase() === selectedCategory.toLowerCase();
    const queryTerm = searchQuery.trim().toLowerCase();
    const matchesQuery = !queryTerm || 
      (article.title && article.title.toLowerCase().includes(queryTerm)) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(queryTerm)) ||
      (article.type && article.type.toLowerCase().includes(queryTerm));
    return matchesCategory && matchesQuery;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <main className="bg-background min-h-screen">
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_04%20blog.png'}
            alt="Bitácora Header"
            fill
            className="object-cover opacity-95 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-foreground">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">
            Escrituras Compartidas
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-foreground">
              Bitácora <br />
              <span className="italic font-normal text-primary">Abierta.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-foreground/80 leading-relaxed max-w-2xl">
              Un espacio para compartir ideas, investigaciones, entrevistas y aprendizajes sobre comunicación, regeneración, liderazgo y construcción de confianza.
            </p>
          </div>
        </div>
      </section>

      {/* Barra de control para administradores */}
      {isAdmin && (
        <div className="bg-muted/40 border-b border-border/60 py-3.5 px-4 sm:px-8">
          <div className="section-container flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">Panel de Edición Activo:</span>
              <span>{publishedArticles.length} crónicas publicadas</span>
              {draftArticles.length > 0 && (
                <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
                  {draftArticles.length} en borrador
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {draftArticles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDrafts(!showDrafts)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    showDrafts
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-border text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{showDrafts ? 'Ocultar Borradores' : 'Previsualizar Borradores'}</span>
                </button>
              )}
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <FileEdit className="h-3.5 w-3.5" />
                <span>Gestionar en CMS</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="section-container py-12 sm:py-16">
        {/* Barra interactiva de Búsqueda y Filtros por Categoría */}
        <div className="mb-12 sm:mb-16 space-y-6 pb-8 border-b border-border/60">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Buscador de texto en tiempo real */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tema, palabra clave o título..."
                className="w-full pl-10 pr-10 py-2.5 bg-muted/20 hover:bg-muted/30 focus:bg-background border border-border/70 rounded-full text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/60"
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

            {/* Contador de resultados */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>
                Mostrando <strong className="text-foreground">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'crónica' : 'crónicas'}
                {selectedCategory !== 'all' && <span> en <strong className="text-primary">{selectedCategory}</strong></span>}
                {searchQuery.trim() && <span> para &ldquo;{searchQuery}&rdquo;</span>}
              </span>
            </div>
          </div>

          {/* Categorías / Tipos de Artículo */}
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
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
              }`}
            >
              Todas ({baseArticles.length})
            </button>
            {categories.map((cat) => {
              const count = baseArticles.filter(a => a.type?.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all flex-shrink-0 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}

            {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary font-medium hover:underline ml-auto flex-shrink-0 pl-3 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4 opacity-40">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
            <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Sincronizando Historias</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-24 space-y-4 border border-dashed rounded-lg p-12 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold font-headline">No se encontraron crónicas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {searchQuery.trim() || selectedCategory !== 'all'
                ? 'No hay publicaciones que coincidan con los criterios de búsqueda o categoría seleccionados.'
                : 'Actualmente estamos preparando nuevos textos e investigaciones. Vuelve pronto para leer nuestras reflexiones.'}
            </p>
            {(searchQuery.trim() || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
              >
                <X className="h-3.5 w-3.5" /> Restablecer Búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {filteredArticles.length > 0 && (
              <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <ArticleCard article={filteredArticles[0]} featured={true} />
              </div>
            )}

            {filteredArticles.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.slice(1).map((article, index) => (
                  <div 
                    key={article.id} 
                    className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                    style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
