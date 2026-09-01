"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Radio, Mic2, ExternalLink, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ResonanciaPage() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'resonancia-bg');

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[70vh] w-full flex items-end pb-24 overflow-hidden border-b bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_05%20multimedia.png'}
            alt="Laboratorio Editorial"
            fill
            className="object-cover opacity-95 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-foreground">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-8 block animate-in slide-in-from-bottom-4 duration-700">Capítulo 04</span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-8 tracking-tighter text-foreground">
              Laboratorio <br />
              <span className="italic font-normal text-primary">Editorial.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase">04</span>
              </div>
              <h3 className="text-3xl font-bold font-headline tracking-tighter">Formatos y Canales</h3>
              <p className="text-lg font-light text-foreground/60 leading-relaxed italic border-l border-primary/20 pl-8">
                Transformamos conocimiento técnico en productos editoriales de alto impacto que generan comprensión y participación.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-light text-foreground/60 leading-relaxed mt-12">
                <li>• Podcasts</li>
                <li>• Libros digitales</li>
                <li>• Revistas institucionales</li>
                <li>• Newsletters</li>
                <li>• Entrevistas estratégicas</li>
                <li>• Casos de éxito</li>
                <li>• Memorias de proyectos</li>
                <li>• Artículos de liderazgo de pensamiento</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-secondary p-12 text-white space-y-10 rounded-sm shadow-2xl h-fit lg:sticky lg:top-32">
              <div className="flex items-center gap-4">
                <Radio className="h-6 w-6 text-primary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">Planeta Sostenible</h3>
              </div>
              <p className="text-lg font-light opacity-70 leading-relaxed italic">
                Acompañamos organizaciones que buscan fortalecer sus narrativas a través de la escucha profunda y el diálogo técnico en formato audio.
              </p>
              <div className="space-y-4">
                <a 
                  href="https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 border border-white/10 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Mic2 className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">The Other Narrative</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                </a>
                <a 
                  href="https://open.spotify.com/show/4fIwE8OUNlJkszY6XQZcO5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 border border-white/10 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Mic2 className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Planeta Sostenible</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-24 border-t mt-32">
          <Link href="/accion" className="btn-editorial btn-editorial-outline group">
            <ArrowLeft className="mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 03 Proceso
          </Link>
          <Link href="/coherencia" className="btn-editorial btn-editorial-primary">
            05 Coherencia <ArrowRight className="ml-4 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
