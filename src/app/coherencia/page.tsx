"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Award, GraduationCap, ShieldCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CoherenciaPage() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'coherencia-bg');

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[70vh] w-full flex items-end pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://images.pexels.com/photos/927414/pexels-photo-927414.jpeg'}
            alt="Formación y Propósito"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-8 block animate-in slide-in-from-bottom-4 duration-700">Capítulo 05</span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-8 tracking-tighter text-white">
              Integridad & <br />
              <span className="italic font-normal text-primary">Coherencia.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-24">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase">05</span>
              </div>
              <h3 className="text-3xl font-bold font-headline tracking-tighter">Maquillaje o Verdad</h3>
              <p className="text-xl font-light text-foreground/70 leading-relaxed italic">
                La integridad organizacional no es una opción estética, es el único valor innegociable que garantiza la sostenibilidad a largo plazo.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Conferencias</h4>
                  <ul className="space-y-3 text-sm font-light text-foreground/60 italic leading-relaxed">
                    <li>• Cómo comunicar la sostenibilidad</li>
                    <li>• Periodismo de soluciones</li>
                    <li>• Narrativas que generan confianza</li>
                    <li>• Comunicación responsable</li>
                    <li>• Liderazgo y comunicación</li>
                    <li>• Storytelling organizacional</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Talleres</h4>
                  <ul className="space-y-3 text-sm font-light text-foreground/60 italic leading-relaxed">
                    <li>• Diseño de narrativas</li>
                    <li>• Comunicación interna</li>
                    <li>• Escritura estratégica</li>
                    <li>• Storytelling para organizaciones</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-24 border-t space-y-12">
              <h3 className="text-3xl font-bold font-headline tracking-tighter">Cierre de la Bitácora</h3>
              <p className="text-lg font-light text-foreground/70 leading-relaxed max-w-2xl">
                The Other Narrative cierra este recorrido recordando que la comunicación no es el punto de llegada, sino el puente constante entre lo que somos y lo que hacemos. Nuestra misión es habitar esa verdad junto a las organizaciones que deciden ser coherentes.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 p-10 bg-muted/20 border border-border/50 rounded-sm space-y-8">
              <Award className="h-6 w-6 text-primary" />
              <h4 className="text-sm font-bold uppercase tracking-widest">Impacto</h4>
              <p className="text-xs font-light text-muted-foreground leading-relaxed">
                Transformamos la teoría en práctica operativa a través de la formación estratégica y el acompañamiento técnico.
              </p>
              <Link href="/contacto" className="btn-editorial w-full bg-secondary text-white hover:bg-primary border-0 h-10">
                Finalizar Recorrido <ArrowRight className="ml-3 h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>

        <div className="flex justify-between items-center py-24 border-t mt-32">
          <Link href="/resonancia" className="btn-editorial btn-editorial-outline group">
            <ArrowLeft className="mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 04 Resonancia
          </Link>
          <Link href="/blog" className="btn-editorial btn-editorial-primary">
            Bitácora Abierta <ArrowRight className="ml-4 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
