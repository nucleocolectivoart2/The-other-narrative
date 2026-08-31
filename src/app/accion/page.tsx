"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AccionPage() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'accion-bg');

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[70vh] w-full flex items-end pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/13%20Pensemos%20en%20Regeneracion.png'}
            alt="Proceso y Regeneración"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-8 block animate-in slide-in-from-bottom-4 duration-700">Capítulo 03</span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-8 tracking-tighter text-white">
              Regeneración <br />
              <span className="italic font-normal text-primary">& Proceso.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-32">
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase">Área 05</span>
              </div>
              <h3 className="text-3xl font-bold font-headline tracking-tighter">Comunicación para la Regeneración</h3>
              <p className="text-lg font-light text-foreground/70 leading-relaxed italic">
                Llevamos los compromisos ambientales y sociales al centro de la conversación estratégica, transformando datos en historias de impacto real.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm font-light text-foreground/60 leading-relaxed border-l border-primary/20 pl-8">
                <li>• Narrativas de regeneración</li>
                <li>• Storytelling de impacto</li>
                <li>• Comunicación de programas sociales y ambientales</li>
                <li>• Estrategias de sensibilización</li>
                <li>• Comunicación interna para regeneración</li>
                <li>• Capacitación para equipos y líderes</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-muted/10 p-12 rounded-sm border border-border/50 h-fit">
            <Sparkles className="h-8 w-8 text-primary mb-8" />
            <p className="text-lg font-light text-foreground/70 leading-relaxed italic">
              &ldquo;No creemos en comunicar por comunicar. Creemos en construir conversaciones que ayuden a generar valor para los negocios, la sociedad y el planeta.&rdquo;
            </p>
          </div>
        </div>

        <div className="space-y-16 border-t pt-24">
           <div className="space-y-6">
             <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase">METODOLOGÍA</span>
             <h3 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">Cómo trabajamos</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-4 p-8 border border-border/40 hover:bg-primary/5 transition-all rounded-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">01. Escuchar</h4>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">Comprender el contexto, los desafíos y las prioridades reales de la organización y sus grupos de interés.</p>
              </div>
              <div className="space-y-4 p-8 border border-border/40 hover:bg-primary/5 transition-all rounded-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">02. Priorizar</h4>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">Identificar los temas que realmente generan valor estratégico y permiten construir conversaciones honestas.</p>
              </div>
              <div className="space-y-4 p-8 border border-border/40 hover:bg-primary/5 transition-all rounded-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">03. Diseñar</h4>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">Construir narrativas, herramientas y productos editoriales de alto valor que permitan conectar emocionalmente.</p>
              </div>
              <div className="space-y-4 p-8 border border-border/40 hover:bg-primary/5 transition-all rounded-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">04. Movilizar</h4>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">Generar conversaciones, contenidos y procesos de participación que impulsen la confianza y el impacto social.</p>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-center py-24 border-t mt-32">
          <Link href="/experiencia" className="btn-editorial btn-editorial-outline group">
            <ArrowLeft className="mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 02 Áreas
          </Link>
          <Link href="/resonancia" className="btn-editorial btn-editorial-primary">
            04 Resonancia <ArrowRight className="ml-4 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
