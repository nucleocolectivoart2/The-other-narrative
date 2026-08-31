
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronDown, 
  Play, 
  Loader2,
  Target,
  Workflow
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import Image from 'next/image';

const featuredVideos = [
  { id: '0DmyalU2zL4', title: 'HAY FESTIVAL: Diálogos de Cambio', thumbnail: 'https://img.youtube.com/vi/0DmyalU2zL4/hqdefault.jpg' },
  { id: 'VzQC-PPZmKQ', title: 'Conferencia: Narrativas que Movilizan', thumbnail: 'https://img.youtube.com/vi/VzQC-PPZmKQ/hqdefault.jpg' },
  { id: 'JhQ_EpuoiOQ', title: 'Estrategia de Comunicación Responsable', thumbnail: 'https://img.youtube.com/vi/JhQ_EpuoiOQ/hqdefault.jpg' }
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              width: '100vw',
              height: '56.25vw', 
              minHeight: '100vh',
              minWidth: '177.77vh',
              transform: `translate(-50%, calc(-50% + ${scrollY * 0.05}px))` 
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/0DmyalU2zL4?autoplay=1&mute=1&controls=0&loop=1&playlist=0DmyalU2zL4&start=12&end=114&background=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1"
              className="absolute top-0 left-0 w-full h-full object-cover brightness-[0.35] grayscale-[0.2]"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              title="Editorial Background Video"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
        </div>

        <div className="section-container relative z-20 w-full">
          <div className="max-w-5xl">
            
            {/* Logo Arquitectónico Estable */}
            <div className="flex flex-col items-start mb-10 transition-all duration-1000">
              <div className="flex flex-col -space-y-2 md:-space-y-4">
                <h1 className="text-6xl sm:text-8xl md:text-[110px] lg:text-[140px] font-bold font-headline leading-[0.85] text-white tracking-tighter lowercase">
                  the
                </h1>
                <h1 className="text-6xl sm:text-8xl md:text-[110px] lg:text-[140px] font-bold font-headline leading-[0.85] text-white tracking-tighter lowercase">
                  other
                </h1>
                <h1 className="text-6xl sm:text-8xl md:text-[110px] lg:text-[140px] font-normal font-headline leading-[0.85] text-primary italic tracking-tighter lowercase">
                  narrative.
                </h1>
              </div>
            </div>

            {/* Editorial Label Refinado */}
            <div className="mb-12 transition-all duration-1000 delay-300">
              <div className="inline-flex items-center gap-4 py-2 border-y border-white/10">
                <span className="text-primary font-bold text-[9px] sm:text-[10px] tracking-[0.4em] uppercase">
                  Laboratorio Estratégico y Editorial
                </span>
                <div className="h-px w-12 bg-primary/40 hidden sm:block" />
              </div>
            </div>

            {/* Mensajes de Valor */}
            <div className="space-y-8 max-w-4xl transition-all duration-1000 delay-500">
              <div className="flex flex-col gap-2">
                <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-tight uppercase leading-none">
                  Narrativas que generan <span className="text-primary italic font-headline lowercase">confianza.</span>
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-tight uppercase leading-none">
                  Estrategias que movilizan <span className="text-primary italic font-headline lowercase">personas.</span>
                </p>
              </div>

              {/* Bloque de Propósito Editorial */}
              <div className="border-l-2 border-primary/40 max-w-2xl mt-12 pl-8 py-2">
                <p className="text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed">
                  En un entorno saturado, ayudamos a organizaciones a transformar conocimiento, propósito y estrategia en narrativas capaces de generar comprensión, participación y acción.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar Inferior - Equilibrada */}
        <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md border-t border-white/5 py-6 sm:py-8 z-40 transition-all duration-1000 delay-700">
          <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex gap-4">
              <Link 
                href="/blog" 
                className="btn-editorial bg-primary text-white hover:bg-white hover:text-primary h-10 px-8 text-[9px] tracking-[0.3em] font-bold transition-all duration-500"
              >
                INSIGHTS
              </Link>
              <button 
                onClick={() => scrollToSection('mission')} 
                className="btn-editorial border-white/20 text-white hover:bg-white/10 h-10 px-8 text-[9px] tracking-[0.3em] font-bold group"
              >
                NUESTRA MIRADA <ArrowRight className="ml-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <button 
              onClick={() => scrollToSection('mission')}
              className="text-white/60 hover:text-primary transition-all animate-bounce hidden sm:block"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Misión con Profundidad Visual */}
      <section id="mission" className="relative py-24 sm:py-32 overflow-hidden bg-background">
        {/* Marca de agua tipográfica para profundidad */}
        <div className="absolute top-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.03] -translate-y-1/4 translate-x-1/4">
          <span className="text-[300px] font-bold font-headline leading-none text-foreground whitespace-nowrap">
            narrativa
          </span>
        </div>

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl bg-muted group">
                <Image
                  src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/01_articular_realidades.png"
                  alt="Articulación de Realidades"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-[3000ms]"
                />
                <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">
              <div className="space-y-6">
                <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-4">
                  <div className="h-px w-8 bg-primary/40" /> EL DESAFÍO
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline leading-[1.1] tracking-tighter text-foreground">
                  Articular <br />
                  <span className="italic font-normal text-primary">Realidades.</span>
                </h2>
              </div>
              
              <div className="space-y-8 max-w-2xl">
                <p className="text-lg sm:text-xl text-foreground/80 font-light leading-relaxed">
                  Las organizaciones enfrentan un desafío cada vez mayor: comunicar en medio de la saturación informativa, construir confianza en entornos complejos y conectar sus objetivos de negocio con las expectativas de una sociedad que exige coherencia, transparencia e impacto.
                </p>
                
                <div className="relative pl-10 py-4">
                  <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                  <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed italic">
                    &ldquo;No creemos en comunicar por comunicar. Creemos en construir conversaciones que ayuden a generar valor para los negocios, la sociedad y el planeta.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Trabajo */}
      <section id="areas" className="section-container py-24 sm:py-32 border-t"> 
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-8">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase">ÁREAS DE TRABAJO</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tighter">Impacto <br /><span className="italic font-normal text-primary">Estratégico.</span></h2>
              <p className="text-lg font-light text-muted-foreground leading-relaxed max-w-md">
                Nuestra visión integrada conecta la estrategia de impacto con la cultura organizacional y el liderazgo, transformando los conceptos en prácticas que generan valor para las organizaciones, la sociedad y su entorno.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {[
                { title: 'Estrategia', icon: <Target className="h-5 w-5" />, text: 'Alineación de negocio y hojas de ruta.' },
                { title: 'Engagement', icon: <Workflow className="h-5 w-5" />, text: 'Estrategias para organizaciones de membresía.' },
              ].map((item, idx) => (
                <div key={idx} className="p-8 border bg-white rounded-sm hover:border-primary transition-all duration-500 group">
                  <div className="h-10 w-10 bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">{item.icon}</div>
                  <h4 className="text-xl font-bold font-headline mb-4">{item.title}</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* Metodología */}
      <section id="proceso" className="section-container py-24 border-t">
         <div className="w-full space-y-16">
            <div className="space-y-6">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase">METODOLOGÍA</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tighter">Escuchar. Priorizar. <br /><span className="italic font-normal text-primary">Movilizar.</span></h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { step: '01', title: 'Escuchar', desc: 'Comprender el contexto, los desafíos y las prioridades de la organización.' },
                 { step: '02', title: 'Priorizar', desc: 'Identificar los temas que realmente generan valor para la estrategia y los grupos de interés.' },
                 { step: '03', title: 'Diseñar', desc: 'Construir narrativas, herramientas y productos que permitan conectar con las personas.' },
                 { step: '04', title: 'Movilizar', desc: 'Generar conversaciones, contenidos y procesos que impulsen participación y confianza.' },
               ].map((item, idx) => (
                 <div key={idx} className="space-y-6 p-8 border border-border/40 rounded-sm hover:bg-muted/10 transition-all">
                    <span className="text-4xl font-headline italic text-primary/20 font-bold block">{item.step}</span>
                    <h4 className="text-xl font-bold font-headline border-b pb-4">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Multimedia */}
      <section className="py-24 sm:py-32 bg-black text-white overflow-hidden">
        <div className="section-container mb-24">
          <div className="space-y-6">
            <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase">DIÁLOGOS TÉCNICOS</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tighter">Multimedia.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-black border-t border-l border-white/5">
          {featuredVideos.map((video) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <div className="group relative bg-black aspect-square overflow-hidden cursor-pointer border-r border-b border-white/5">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover grayscale brightness-[0.5] group-hover:brightness-[0.8] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-10 p-10 flex flex-col justify-between">
                    <div className="space-y-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 block">VIDEO</span>
                      <h3 className="text-2xl font-bold font-headline tracking-tighter leading-tight group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">REPRODUCIR</span>
                      <div className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-2xl">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-6xl p-0 bg-black aspect-video border-0 shadow-2xl overflow-hidden rounded-sm">
                <DialogHeader>
                  <DialogTitle className="sr-only">{video.title}</DialogTitle>
                  <DialogDescription className="sr-only">Reproductor de video para {video.title}</DialogDescription>
                </DialogHeader>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  title={video.title}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}
