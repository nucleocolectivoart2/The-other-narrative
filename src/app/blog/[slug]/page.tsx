
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, ArrowLeft, Loader2, User, MessageCircleQuestion, AlertCircle, Edit3 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const firestore = useFirestore();
  const { user } = useUser();
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

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

  const articleQuery = useMemoFirebase(() => {
    if (!slug) return null;
    return query(
      collection(firestore, 'contentItems'), 
      where('slug', '==', slug),
      limit(1)
    );
  }, [firestore, slug]);

  const { data: firestoreArticles, isLoading } = useCollection(articleQuery);
  
  const article = firestoreArticles?.[0];
  
  const defaultImage = PlaceHolderImages.find(img => img.id === 'bitacora')?.imageUrl || '';

  useEffect(() => {
    if (article?.date) {
      setFormattedDate(new Date(article.date).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }));
    }
  }, [article?.date]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">Esta historia aún no ha sido escrita</h1>
        <Link href="/blog" className="btn-editorial btn-editorial-primary">Volver a la Bitácora</Link>
      </div>
    );
  }

  // If article is draft and viewer is not admin, show respectful draft message
  if (article.status === 'draft' && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mb-2">
          <AlertCircle className="h-7 w-7" />
        </div>
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">Edición en Curso</span>
        <h1 className="text-2xl sm:text-4xl font-bold font-headline">Esta crónica se encuentra en preparación</h1>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          El equipo editorial está trabajando en esta investigación. Pronto estará disponible en la bitácora abierta.
        </p>
        <Link href="/blog" className="btn-editorial btn-editorial-primary mt-4">Volver a la Bitácora</Link>
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen pb-24 sm:pb-32">
      {/* Banner de Borrador para Administradores */}
      {article.status === 'draft' && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span><strong>Modo Borrador:</strong> Esta crónica no es visible públicamente en la bitácora.</span>
          </div>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-1.5 bg-white text-amber-900 px-3 py-1 rounded text-[11px] font-bold hover:bg-white/90 transition-colors shrink-0"
          >
            <Edit3 className="h-3 w-3" /> Editar en CMS
          </Link>
        </div>
      )}

      <section className="relative h-[70vh] sm:h-[80vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden bg-white border-b">
        <div className="absolute inset-0 z-0">
          <Image
            src={article?.image || defaultImage}
            alt={article?.title || ''}
            fill
            className="object-cover opacity-90 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-foreground">
          <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div>
              <span className="bg-primary text-white text-[8px] sm:text-[9px] font-bold px-3 sm:px-4 py-2 uppercase tracking-[0.4em] inline-block shadow-md">
                {article?.type}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] tracking-tighter text-foreground">
              {article?.title}
            </h1>
            <div className="flex flex-wrap gap-4 sm:gap-8 pt-4 text-foreground/75 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
               <div className="flex items-center gap-3">
                 <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> 
                 <div className="flex flex-col">
                   <span>{article?.authorName || 'Ángela Gómez'}</span>
                   <span className="opacity-60 text-[7px] sm:text-[8px] tracking-widest lowercase italic">{article?.authorTitle || 'Periodista en Regeneración'}</span>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> 
                 {formattedDate}
               </div>
               <div className="flex items-center gap-3"><Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> {article?.readTime || 8} min de lectura</div>
            </div>
          </div>
        </div>
      </section>

      <article className="section-container py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-10 sm:space-y-12">
            <div className="relative border-l-4 border-primary/20 pl-6 sm:pl-10">
              <p className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-foreground/70 italic">
                {article?.excerpt}
              </p>
            </div>

            <div 
              className="prose prose-sm sm:prose-lg prose-neutral dark:prose-invert max-w-none 
                prose-headings:font-headline prose-headings:tracking-tighter prose-headings:font-bold
                prose-p:font-light prose-p:leading-relaxed prose-p:text-foreground/80
                prose-strong:text-primary prose-strong:font-bold
                prose-blockquote:border-primary/30 prose-blockquote:bg-muted/30 prose-blockquote:px-6 sm:prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-sm
                prose-hr:border-primary/20 prose-hr:my-8 sm:prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: article?.body || '' }}
            />

            <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8">
              <Link href="/blog" className="btn-editorial btn-editorial-outline group w-full sm:w-auto">
                <ArrowLeft className="mr-3 sm:mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a la Bitácora
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8 sm:space-y-12 h-fit lg:sticky lg:top-32 order-last lg:order-none">
            <div className="bg-muted/30 p-8 sm:p-10 rounded-sm space-y-6 border border-border/40">
              <div className="flex items-center gap-3 text-primary mb-4">
                <MessageCircleQuestion className="h-5 w-5" />
                <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em]">Hablemos de esto</h4>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-foreground/60 italic">
                ¿Qué opinas sobre este desafío? Me encantaría conocer cómo habitas tú la verdad en tu organización.
              </p>
              <Link href="/contacto" className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary hover:underline block pt-2">
                Iniciar conversación →
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
