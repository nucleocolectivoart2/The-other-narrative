
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, ArrowRight, ExternalLink, Target } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProyectosPage() {
  const firestore = useFirestore();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'proyectos-bg');

  const projectsQuery = useMemoFirebase(() => query(collection(firestore, 'projects')), [firestore]);
  const { data: projects, isLoading } = useCollection(projectsQuery);

  const mockProjects = [
    {
      id: 'mock-p1',
      title: 'Estrategia COP16: Diálogos de Cambio',
      category: 'Regeneración',
      description: 'Construcción de la narrativa estratégica para el Hub de Comunicación Responsable durante la cumbre de biodiversidad más importante del mundo.',
      image: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/03.png',
      link: '#',
      ods: [16, 17, 10]
    },
    {
      id: 'mock-p2',
      title: 'Narrativas para el Pacto Global',
      category: 'Estrategia',
      description: 'Refinamiento editorial y construcción de mensajes clave para la Red Colombia del Pacto Global de las Naciones Unidas.',
      image: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/05.png',
      link: '#',
      ods: [17, 4, 16]
    }
  ];

  const displayProjects = (projects && projects.length > 0) ? projects : mockProjects;

  return (
    <main className="bg-background min-h-screen">
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_03%20proyectos.png'}
            alt="Proyectos"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">
            Portafolio Técnico
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-white">
              Casos en <br />
              <span className="italic font-normal text-primary">Acción.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-24 sm:py-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 opacity-40">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Portafolio</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24">
            {displayProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="group flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-muted shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={project.image || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/06.png'}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-primary text-white text-[8px] font-bold px-4 py-2 uppercase tracking-[0.2em] shadow-2xl">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-500 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-foreground/60 font-light leading-relaxed text-sm sm:text-base line-clamp-3 italic border-l border-primary/20 pl-6">
                    {project.description}
                  </p>
                  
                  {/* ODS RELACIONADOS */}
                  {project.ods && project.ods.length > 0 && (
                    <div className="pt-4 space-y-4">
                      <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 block">ODS RELACIONADOS</span>
                      <div className="flex flex-wrap gap-4">
                        {project.ods.map((odsNum: number) => (
                          <div key={odsNum} className="w-14 h-14 md:w-16 md:h-16 bg-white border border-border/20 rounded-sm p-1 shadow-lg transition-transform hover:scale-110 cursor-help" title={`Contribuye al ODS ${odsNum}`}>
                            <Image 
                              src={`/ODS/S-WEB-Goal-${odsNum.toString().padStart(2, '0')}.png`}
                              alt={`ODS ${odsNum}`}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 flex items-center gap-6">
                    {project.link && (
                      <Link 
                        href={project.link} 
                        target="_blank" 
                        className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-3 hover:gap-5 transition-all"
                      >
                        VER DETALLES <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-40 p-16 sm:p-24 bg-muted/20 border border-border/40 rounded-sm text-center space-y-12">
           <div className="space-y-4">
             <Target className="h-10 w-10 text-primary mx-auto mb-8" />
             <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter">¿Tienes un reto técnico?</h2>
             <p className="text-foreground/60 font-light max-w-2xl mx-auto italic leading-relaxed">
               Ayudamos a las organizaciones a articular sus realidades más complejas a través de narrativas honestas, estratégicas y alineadas con el impacto global.
             </p>
           </div>
           <Link href="/contacto" className="btn-editorial btn-editorial-primary h-12 px-12">
             Iniciar una conversación <ArrowRight className="ml-4 h-4 w-4" />
           </Link>
        </div>
      </div>
    </main>
  );
}
