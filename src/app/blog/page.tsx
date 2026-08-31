
"use client";

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockArticles = [
  {
    id: 'mock-1',
    slug: 'el-silencio-de-los-datos-esg',
    title: '¿De qué hablamos cuando no hablamos de datos?',
    excerpt: 'Una reflexión sobre por qué la métrica ESG a menudo se queda en la superficie y cómo habitamos la verdad en la cadena de valor.',
    image: 'https://images.pexels.com/photos/1190906/pexels-photo-1190906.jpeg',
    type: 'Reflexión',
    date: '2025-02-19',
    readTime: 10
  },
  {
    id: 'mock-2',
    slug: 'el-lenguaje-del-territorio-cop16',
    title: 'COP16: Lo que el territorio nos gritó al oído',
    excerpt: 'Más allá de las conferencias, la biodiversidad es un diálogo técnico que requiere humildad operativa.',
    image: 'https://images.pexels.com/photos/13730514/pexels-photo-13730514.jpeg',
    type: 'Crónica',
    date: '2025-02-18',
    readTime: 8
  }
];

export default function BlogPage() {
  const firestore = useFirestore();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'bitacora');

  const articlesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'contentItems'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: firestoreArticles, isLoading } = useCollection(articlesQuery);

  const articles = (firestoreArticles && firestoreArticles.length > 0) 
    ? firestoreArticles 
    : mockArticles;

  return (
    <main className="bg-background min-h-screen">
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://images.pexels.com/photos/1190906/pexels-photo-1190906.jpeg'}
            alt="Bitácora Header"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">
            Escrituras Compartidas
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-white">
              Bitácora <br />
              <span className="italic font-normal text-primary">Abierta.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-2xl">
              Un espacio para compartir ideas, investigaciones, entrevistas y aprendizajes sobre comunicación, sostenibilidad, liderazgo y construcción de confianza.
            </p>
          </div>
        </div>
      </section>

      <div className="section-container py-16 sm:py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4 opacity-40">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
            <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Sincronizando Historias</p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {articles.length > 0 && (
              <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                <ArticleCard article={articles[0]} featured={true} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article, index) => (
                <div 
                  key={article.id} 
                  className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                  style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
