
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Users, 
  Leaf, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ExperienciaPage() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'experiencia-bg');
  const estrategiaImg = "https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/08%20comunicacion_organizaciona_y_narrativa.png";
  const membresiaImg = "https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/09%20comunicacion_y_comunidades.png";
  const editorialImg = "https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/10%20Laboratorio%20Editorial.png";
  const formacionImg = "https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/12%20formacion_y_capacitacion.png";
  const regeneracionImg = "https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/13%20Pensemos%20en%20Regeneracion.png";

  const phoneNumber = "573162809797";

  const getWhatsAppUrl = (message: string) => {
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Banner Principal */}
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || estrategiaImg}
            alt="Áreas de Trabajo"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">Capítulo 02</span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-white">
              Áreas de <br />
              <span className="italic font-normal text-primary">Trabajo.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-2xl italic">
              Transformamos conocimiento, propósito y estrategia en productos de valor.
            </p>
          </div>
        </div>
      </section>

      <div className="section-container py-16 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          
          {/* 01. Estrategia y Priorización */}
          <div className="group bg-white rounded-sm border border-border/60 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col">
            <div className="relative h-40 sm:h-48 w-full flex items-center justify-center overflow-hidden">
              <Image src={estrategiaImg} alt="Estrategia" fill className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 text-center px-6 sm:px-8">
                <div className="flex justify-center mb-3 sm:mb-4"><Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /></div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline tracking-tighter text-white uppercase">Comunicación organizacional y narrativa estratégica</h3>
                <span className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase mt-2 block">Área 01</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-light text-foreground/70 italic leading-relaxed">
                  Alineamos el propósito y la estrategia de tu negocio con conversaciones y narrativas que movilizan. No comunicamos por comunicar: identificamos qué necesita comunicar la organización, con quién necesita conversar y dónde puede generar mayor valor.
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest">
                  Para pymes y empresas medianas
                </p>
              </div>
              <ul className="space-y-3 sm:space-y-4 text-[12px] sm:text-[13px] font-light text-foreground/60 leading-relaxed border-l border-primary/20 pl-6">
                <li>• Alineación entre estrategia de negocio y grupos de interés</li>
                <li>• Mapeo y priorización de grupos de interés</li>
                <li>• Identificación de prioridades y oportunidades de comunicación</li>
                <li>• Diseño de la estrategia de comunicación organizacional</li>
                <li>• Diseño de la plataforma de comunicación</li>
                <li>• Construcción de narrativas institucionales y estratégicas</li>
                <li>• Comunicación para procesos de cambio y transformación</li>
                <li>• Acompañamiento a líderes y equipos</li>
              </ul>
              <p className="text-[11px] sm:text-xs font-medium text-foreground/80 leading-relaxed italic border-t pt-4">
                El resultado: una comunicación menos reactiva y más estratégica, conectada con los objetivos del negocio, su cultura y las relaciones que necesita construir.
              </p>
              <a 
                href={getWhatsAppUrl("Hola Ángela, me gustaría diseñar mi estrategia con The Other Narrative.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all pt-2"
              >
                DISEÑAR MI ESTRATEGIA <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 02. Comunicación para Organizaciones de Membresía */}
          <div className="group bg-white rounded-sm border border-border/60 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col">
            <div className="relative h-40 sm:h-48 w-full flex items-center justify-center overflow-hidden">
              <Image src={membresiaImg} alt="Membresía" fill className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 text-center px-6 sm:px-8">
                <div className="flex justify-center mb-3 sm:mb-4"><Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /></div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline tracking-tighter text-white uppercase">Comunicación y Comunidades</h3>
                <span className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase mt-2 block">Área 02</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm font-light text-foreground/70 italic leading-relaxed">
                Transformamos la comunicación de gremios, asociaciones y cooperativas en una herramienta para fortalecer el sentido de pertenencia, generar participación y hacer visible el valor de ser parte de una comunidad.
              </p>
              <ul className="space-y-3 sm:space-y-4 text-[12px] sm:text-[13px] font-light text-foreground/60 leading-relaxed border-l border-primary/20 pl-6">
                <li>• Estrategias de comunicación para gremios, asociaciones y cooperativas</li>
                <li>• Estrategias de relacionamiento y engagement con afiliados</li>
                <li>• Construcción y fortalecimiento de comunidades</li>
                <li>• Identidad y narrativa colectiva</li>
                <li>• Estrategias de contenidos y boletines para afiliados</li>
                <li>• Activación de la participación de los miembros</li>
                <li>• Comunicación de la propuesta de valor de la organización</li>
              </ul>
              <a 
                href={getWhatsAppUrl("Hola Ángela, me gustaría fortalecer mi comunidad con The Other Narrative.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all pt-4"
              >
                FORTALECER MI COMUNIDAD <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 03. Laboratorio Editorial */}
          <div className="group bg-white rounded-sm border border-border/60 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col">
            <div className="relative h-40 sm:h-48 w-full flex items-center justify-center overflow-hidden">
              <Image src={editorialImg} alt="Editorial" fill className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 text-center px-6 sm:px-8">
                <div className="flex justify-center mb-3 sm:mb-4"><BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /></div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline tracking-tighter text-white uppercase">Laboratorio Editorial</h3>
                <span className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase mt-2 block">Área 03</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm font-light text-foreground/70 italic leading-relaxed">
                Transformamos el conocimiento técnico en productos editoriales de alto impacto. Creamos piezas que no solo informan, sino que perduran.
              </p>
              <ul className="grid grid-cols-1 gap-3 sm:gap-4 text-[12px] sm:text-[13px] font-light text-foreground/60 leading-relaxed border-l border-primary/20 pl-6">
                <li>• Podcasts & Audio Digital</li>
                <li>• Libros digitales & Revistas</li>
                <li>• Newsletters Estratégicos</li>
                <li>• Entrevistas de Liderazgo</li>
                <li>• Casos de Éxito & Memorias</li>
                <li>• Artículos de Pensamiento</li>
              </ul>
              <a 
                href={getWhatsAppUrl("Hola Ángela, me gustaría crear un producto editorial con The Other Narrative.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all pt-4"
              >
                CREAR MI PRODUCTO EDITORIAL <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 04. Formación y Capacitación */}
          <div className="group bg-white rounded-sm border border-border/60 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col">
            <div className="relative h-40 sm:h-48 w-full flex items-center justify-center overflow-hidden">
              <Image src={formacionImg} alt="Formación" fill className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 text-center px-6 sm:px-8">
                <div className="flex justify-center mb-3 sm:mb-4"><GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /></div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline tracking-tighter text-white uppercase">Formación y Capacitación</h3>
                <span className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase mt-2 block">Área 04</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm font-light text-foreground/70 italic leading-relaxed">
                Capacitamos líderes y equipos para que habiten la verdad organizacional. Talleres y conferencias que transforman la mirada técnica en humana.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2 sm:pt-4">
                <div className="space-y-3">
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Conferencias</h4>
                  <ul className="space-y-2 text-[11px] sm:text-xs font-light text-foreground/50">
                    <li>• Comunicar la regeneración</li>
                    <li>• Periodismo de soluciones</li>
                    <li>• Narrativas de confianza</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Talleres</h4>
                  <ul className="space-y-2 text-[11px] sm:text-xs font-light text-foreground/50">
                    <li>• Diseño de narrativas</li>
                    <li>• Escritura estratégica</li>
                    <li>• Storytelling organizacional</li>
                  </ul>
                </div>
              </div>
              <a 
                href={getWhatsAppUrl("Hola Ángela, me gustaría solicitar una capacitación con The Other Narrative.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all pt-4"
              >
                SOLICITAR CAPACITACIÓN <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 05. Comunicación para la Regeneración (Destacado) */}
          <div className="group bg-muted/20 rounded-sm border border-primary/20 hover:border-primary transition-all duration-700 shadow-xl md:col-span-2 overflow-hidden flex flex-col lg:flex-row">
            <div className="relative lg:w-2/5 min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
              <Image src={regeneracionImg} alt="Regeneración" fill className="object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="relative z-10 text-center px-8 sm:px-10">
                <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold font-headline tracking-tighter text-white uppercase">Pensemos en Regeneración</h3>
                <span className="text-primary font-bold text-[9px] sm:text-[10px] tracking-[0.6em] uppercase mt-4 block">Área 05</span>
              </div>
            </div>
            <div className="lg:w-3/5 p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6 sm:space-y-8 bg-white/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-primary">Economía Circular e Innovación Social</h4>
                  <p className="text-base sm:text-lg md:text-xl font-light text-foreground/70 italic leading-relaxed">
                    Diseñamos estrategias que ayudan a las organizaciones a repensar sus modelos, aprovechar mejor los recursos y construir soluciones con impacto social.
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-3 sm:gap-y-4 text-[12px] sm:text-[13px] font-light text-foreground/60 leading-relaxed border-l border-primary/20 pl-6">
                  <li>• Narrativas de regeneración</li>
                  <li>• Storytelling de impacto real</li>
                  <li>• Comunicación de programas</li>
                  <li>• Estrategias de sensibilización</li>
                  <li>• Comunicación interna técnica</li>
                  <li>• Capacitación para líderes</li>
                </ul>
                <Button asChild className="w-full bg-secondary text-white hover:bg-primary transition-all h-12 sm:h-14 rounded-sm text-[9px] sm:text-[10px] tracking-[0.2em] font-bold border-0 shadow-lg mt-6">
                  <a 
                    href={getWhatsAppUrl("Hola Ángela, me gustaría conversar sobre regeneración con The Other Narrative.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CONVERSAR SOBRE REGENERACIÓN
                  </a>
                </Button>
            </div>
          </div>
        </div>

        {/* Gran CTA Final */}
        <div className="mt-24 sm:mt-40 p-10 sm:p-16 md:p-32 bg-secondary text-white rounded-sm relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] sm:blur-[120px] group-hover:bg-primary/30 transition-all duration-[2000ms]" />
          <div className="relative z-10 max-w-4xl space-y-8 sm:space-y-12">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold font-headline tracking-tighter leading-[0.9]">
              ¿Listo para transformar <br />
              <span className="italic font-normal text-primary">tu narrativa organizacional?</span>
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-3xl">
              Si tu organización necesita fortalecer su impacto, conectar con sus grupos de interés o transformar conocimiento en valor real, estaremos encantados de diseñar esa ruta contigo.
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-4 sm:pt-6">
              <Button asChild className="bg-primary text-white hover:bg-white hover:text-primary transition-all duration-500 h-14 sm:h-16 px-10 sm:px-16 text-[9px] sm:text-[10px] tracking-[0.4em] font-bold border-0 shadow-2xl w-full sm:w-auto">
                <a 
                  href={getWhatsAppUrl("Hola Ángela, me gustaría iniciar una conversación con The Other Narrative.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  INICIAR CONVERSACIÓN
                </a>
              </Button>
              <Button asChild variant="outline" className="bg-white text-secondary hover:bg-primary hover:text-white transition-all duration-500 h-14 sm:h-16 px-10 sm:px-16 text-[9px] sm:text-[10px] tracking-[0.4em] font-bold border-0 shadow-lg w-full sm:w-auto">
                <Link href="/blog">VER NUESTRA BITÁCORA</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-16 sm:py-24 border-t mt-24 sm:mt-32">
          <Link href="/conciencia" className="btn-editorial btn-editorial-outline group">
            <ArrowLeft className="mr-3 sm:mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 01 Mirada
          </Link>
          <Link href="/accion" className="btn-editorial btn-editorial-primary">
            03 Proceso <ArrowRight className="ml-3 sm:ml-4 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
