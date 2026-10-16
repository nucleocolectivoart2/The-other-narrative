"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { spotifyPodcasts, spotifyShows, PodcastEpisode, SpotifyShow } from '@/data/podcasts';
import { 
  Play, 
  Mic2, 
  Loader2, 
  ChevronRight,
  Video as VideoIcon,
  X,
  Maximize2,
  CalendarDays,
  Clock,
  ExternalLink,
  Radio,
  Archive,
  ArrowRight,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

// Piezas audiovisuales documentadas con Pacto Global Red Colombia
const officialVideos = [
  { 
    id: '0DmyalU2zL4', 
    url: 'https://www.youtube.com/watch?v=0DmyalU2zL4', 
    title: 'HAY FESTIVAL: Diálogos de Cambio', 
    subtitle: 'Conversaciones sobre cultura, sostenibilidad y pensamiento crítico',
    description: 'Encuentro desarrollado en el marco del Hay Festival sobre los desafíos de transformar el pensamiento contemporáneo y articular nuevas narrativas para el desarrollo sostenible.',
    role: 'Conducción y diálogo editorial',
    institution: 'Pacto Global Red Colombia',
    thumbnail: 'https://img.youtube.com/vi/0DmyalU2zL4/hqdefault.jpg' 
  },
  { 
    id: 'VzQC-PPZmKQ', 
    url: 'https://www.youtube.com/watch?v=VzQC-PPZmKQ', 
    title: 'Conferencia: Narrativas que Movilizan', 
    subtitle: 'Comunicación estratégica y liderazgo para el cambio',
    description: 'Presentación sobre el poder de las narrativas en la construcción de confianza pública, cohesión comunitaria y movilización de actores hacia la acción climática y social.',
    role: 'Conferencista y moderadora',
    institution: 'Pacto Global Red Colombia',
    thumbnail: 'https://img.youtube.com/vi/VzQC-PPZmKQ/hqdefault.jpg' 
  },
  { 
    id: 'JhQ_EpuoiOQ', 
    url: 'https://www.youtube.com/watch?v=JhQ_EpuoiOQ', 
    title: 'Estrategia de Comunicación Responsable', 
    subtitle: 'Transparencia, reporte y diálogo con grupos de interés',
    description: 'Sesión técnica enfocada en buenas prácticas de comunicación responsable, estándares de divulgación y el rol de las organizaciones en la generación de valor compartido.',
    role: 'Facilitación y dirección de contenidos',
    institution: 'Pacto Global Red Colombia',
    thumbnail: 'https://img.youtube.com/vi/JhQ_EpuoiOQ/hqdefault.jpg' 
  }
];

export default function MultimediaPage() {
  const firestore = useFirestore();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'multimedia-bg') || PlaceHolderImages.find(img => img.id === 'resonancia-bg');

  const [activePodcast, setActivePodcast] = useState<PodcastEpisode | null>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [searchArchive, setSearchArchive] = useState<string>('');

  // Shows principales
  const mainShow: SpotifyShow = spotifyShows.find(s => s.id === '033PCu2aysmpjGuazxZ0Oz') || spotifyShows[0];
  const archiveShow: SpotifyShow = spotifyShows.find(s => s.id === '4fIwE8OUNlJkszY6XQZcO5') || spotifyShows[1];

  // Consultas Firestore
  const podcastsQuery = useMemoFirebase(() => query(collection(firestore, 'podcasts'), orderBy('createdAt', 'desc')), [firestore]);
  const videosQuery = useMemoFirebase(() => query(collection(firestore, 'featuredVideos'), orderBy('createdAt', 'desc')), [firestore]);

  const { data: fbPodcasts, isLoading: isPodLoading } = useCollection(podcastsQuery);
  const publishedFbPodcasts = useMemo(() => {
    return (fbPodcasts || []).filter((p: any) => p.status !== 'draft');
  }, [fbPodcasts]);

  // Episodios de The Other Narrative (combinando estáticos y Firestore si son de TON)
  const theOtherNarrativeEpisodes = useMemo(() => {
    const staticTON = spotifyPodcasts.filter(p => p.showId === '033PCu2aysmpjGuazxZ0Oz' || p.category === 'The Other Narrative');
    const customTON = publishedFbPodcasts
      .filter((fp: any) => !fp.showId || fp.showId === '033PCu2aysmpjGuazxZ0Oz' || fp.category === 'The Other Narrative')
      .map((fp: any) => ({
        id: fp.id,
        episodeNumber: fp.episodeNumber || 'EPISODIO',
        showId: '033PCu2aysmpjGuazxZ0Oz',
        showName: 'The Other Narrative',
        title: fp.title,
        description: fp.description,
        url: fp.url,
        image: fp.image || mainShow.image,
        guest: fp.guest,
        category: 'The Other Narrative',
        date: fp.date || 'Reciente',
        duration: fp.duration || '30 min',
        featured: true,
        spreakerUrl: fp.spreakerUrl
      }));

    // Combinar sin duplicados por URL o ID
    const merged = [...customTON, ...staticTON.filter(st => !customTON.some(c => c.url === st.url || c.id === st.id))];
    return merged;
  }, [publishedFbPodcasts, mainShow.image]);

  // Episodios del archivo Planeta Sostenible
  const planetaSostenibleEpisodes = useMemo(() => {
    return spotifyPodcasts.filter(p => p.showId === '4fIwE8OUNlJkszY6XQZcO5');
  }, []);

  const filteredArchiveEpisodes = useMemo(() => {
    if (!searchArchive.trim()) return planetaSostenibleEpisodes;
    const q = searchArchive.toLowerCase();
    return planetaSostenibleEpisodes.filter(ep => 
      ep.title.toLowerCase().includes(q) || 
      ep.description.toLowerCase().includes(q) ||
      ep.guest?.toLowerCase().includes(q)
    );
  }, [planetaSostenibleEpisodes, searchArchive]);

  // Videos
  const { data: fbVideos, isLoading: isVidLoading } = useCollection(videosQuery);
  const publishedFbVideos = useMemo(() => {
    return (fbVideos || []).filter((v: any) => v.status !== 'draft');
  }, [fbVideos]);

  const videos = useMemo(() => {
    if (publishedFbVideos && publishedFbVideos.length > 0) {
      return publishedFbVideos.map((v: any) => ({
        ...v,
        role: v.role || 'Participación profesional',
        institution: v.institution || 'Pacto Global Red Colombia',
        subtitle: v.subtitle || 'Proyecto audiovisual institucional'
      }));
    }
    return officialVideos;
  }, [publishedFbVideos]);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    if (url.length === 11) return url;
    return null;
  };

  const getAudioEmbedUrl = (url?: string, spreakerUrl?: string) => {
    if (url) {
      if (url.includes('spotify.com/episode/')) {
        return url.replace('spotify.com/episode/', 'spotify.com/embed/episode/');
      }
      if (url.includes('spotify.com/show/')) {
        return url.replace('spotify.com/show/', 'spotify.com/embed/show/');
      }
    }
    const targetSpreaker = spreakerUrl || (url && url.includes('spreaker.com') ? url : '');
    if (targetSpreaker) {
      const match = targetSpreaker.match(/--(\d+)/);
      if (match && match[1]) {
        return `https://widget.spreaker.com/player?episode_id=${match[1]}&theme=light&playlist=false&playlist-continuous=false&chapters-image=true&episode_image_position=left&hide-logo=false&hide-likes=false&hide-comments=false&hide-sharing=false&hide-download=false`;
      }
    }
    return url || '';
  };

  const defaultPodcastImage = mainShow.image;

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-background min-h-screen relative selection:bg-primary/20">
      
      {/* =========================================================================
          SECCIÓN A. HERO EDITORIAL
         ========================================================================= */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-stone-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_05%20multimedia.png'}
            alt="Multimedia · Ideas que conectan"
            fill
            referrerPolicy="no-referrer"
            className="object-cover opacity-60 brightness-90 transition-all duration-[4000ms] scale-100 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </div>

        <div className="section-container relative z-10 w-full">
          <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] sm:text-[11px] block">
              ECOSISTEMA SONORO & AUDIOVISUAL
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.95] tracking-tighter text-white">
              Multimedia · <br />
              <span className="italic font-normal text-primary">Ideas que conectan.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 leading-relaxed max-w-2xl font-headline italic">
              Voces, historias y soluciones para imaginar otros futuros.
            </p>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl border-l-2 border-primary/40 pl-4 py-1">
              Un ecosistema de podcasts, conversaciones y producciones audiovisuales que explora cómo las ideas, la colaboración y la innovación pueden transformar empresas, comunidades y territorios.
            </p>

            {/* Llamadas a la acción (CTAs) */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToSection('podcast-principal')}
                className="btn-editorial bg-primary text-white hover:bg-white hover:text-black h-12 px-8 text-[10px] tracking-[0.25em] font-bold shadow-lg transition-all"
              >
                Escuchar The Other Narrative
              </button>
              
              <button
                onClick={() => scrollToSection('archivo-planeta-sostenible')}
                className="btn-editorial border-white/30 text-white hover:bg-white/10 h-12 px-8 text-[10px] tracking-[0.25em] font-bold transition-all"
              >
                Explorar el archivo editorial
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container py-20 sm:py-28 space-y-32">

        {/* =========================================================================
            SECCIÓN B. PODCAST PRINCIPAL: THE OTHER NARRATIVE
           ========================================================================= */}
        <section id="podcast-principal" className="scroll-mt-28 space-y-12">
          
          {/* Header del Bloque */}
          <div className="border-b border-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase inline-flex items-center gap-2">
                <Radio className="h-4 w-4" /> {mainShow.badge || 'PODCAST · PERIODISMO DE SOLUCIONES'}
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold font-headline tracking-tighter text-foreground">
                {mainShow.name}
              </h2>
              <p className="text-lg font-headline italic text-primary">
                Narrativas que generan confianza.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={mainShow.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial btn-editorial-primary h-11 px-6 text-[10px] tracking-[0.2em] font-bold inline-flex items-center gap-2 shadow-sm"
              >
                Escuchar en Spotify <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {mainShow.podimoUrl && (
                <a
                  href={mainShow.podimoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-editorial-outline h-11 px-6 text-[10px] tracking-[0.2em] font-bold inline-flex items-center gap-2"
                >
                  Escuchar en Podimo <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {mainShow.spreakerUrl && (
                <a
                  href={mainShow.spreakerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-editorial-outline h-11 px-6 text-[10px] tracking-[0.2em] font-bold inline-flex items-center gap-2"
                >
                  Escuchar en Spreaker <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Tarjeta Destacada del Podcast Protagonista */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-card border border-border/60 rounded-sm p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Portada Oficial */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-6">
              <div className="relative w-full max-w-[340px] aspect-square rounded-sm overflow-hidden bg-muted shadow-2xl border border-border/40 group">
                <Image
                  src={failedImages['main-show'] ? defaultPodcastImage : mainShow.image}
                  alt={mainShow.name}
                  fill
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError('main-show')}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 uppercase tracking-[0.25em] shadow-md">
                    PRODUCCIÓN PROPIA
                  </span>
                </div>
              </div>

              {/* Atribución / Crédito */}
              <div className="space-y-1 text-left w-full max-w-[340px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  {mainShow.credits || 'Creado y dirigido por Ángela María Gómez'}
                </p>
                <p className="text-xs text-muted-foreground font-light">
                  Investigación, narración y entrevistas sobre regeneración e innovación.
                </p>
              </div>
            </div>

            {/* Descripción Editorial y Enlaces */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80">
                    DECLARACIÓN EDITORIAL
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-foreground leading-snug">
                    Conversaciones que transforman preguntas en acción colectiva.
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-foreground/80 font-light leading-relaxed">
                  {mainShow.description}
                </p>

                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  A través de entrevistas a profundidad, análisis de casos reales y noticias basadas en evidencia, investigamos cómo la regeneración, la innovación, el liderazgo y la colaboración pueden transformar empresas, comunidades y territorios en Iberoamérica.
                </p>
              </div>

              <div className="pt-6 border-t border-border/40 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => {
                    const firstEp = theOtherNarrativeEpisodes[0];
                    if (firstEp) {
                      setActivePodcast(firstEp);
                      setIsPlayerMinimized(false);
                    }
                  }}
                  className="h-12 px-8 bg-secondary text-white hover:bg-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm gap-2"
                >
                  <Play className="h-4 w-4 fill-current" /> Reproducir Episodio Más Reciente
                </Button>

                <button
                  onClick={() => scrollToSection('episodios-destacados')}
                  className="text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors inline-flex items-center gap-2 py-3"
                >
                  Ver todos los episodios <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              BLOQUE: DISTRIBUCIÓN MULTIPLATAFORMA (OFICIAL THE OTHER NARRATIVE)
             ========================================================================= */}
          <div className="bg-card border border-border/70 rounded-sm p-8 sm:p-10 lg:p-12 shadow-sm space-y-8">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.4em] uppercase">
                <Radio className="h-3.5 w-3.5" />
                <span>DISTRIBUCIÓN MULTIPLATAFORMA</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline tracking-tight text-foreground">
                Escucha The Other Narrative
              </h3>
              
              <p className="text-base sm:text-lg text-foreground/80 font-light leading-relaxed">
                Encuentra nuestras conversaciones, entrevistas y episodios sobre periodismo de soluciones, sostenibilidad, innovación y transformación en tu plataforma de escucha preferida.
              </p>
            </div>

            {/* Tres tarjetas / botones en una sola fila en escritorio, adaptadas en dispositivos móviles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 pt-2">
              
              {/* Spotify */}
              <a
                href="https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 sm:p-7 bg-background border border-border/70 hover:border-primary rounded-sm transition-all duration-300 hover:shadow-lg space-y-6"
                aria-label="Escuchar The Other Narrative en Spotify (abre en ventana nueva)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                      CANAL OFICIAL
                    </span>
                    <span className="h-6 px-2.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider rounded-xs flex items-center">
                      Audio HD
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold font-headline tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      Spotify
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all text-primary" />
                    </h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Reproduce todos los episodios, sigue el show y activa notificaciones de nuevas publicaciones.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>Abrir en Spotify</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Podimo */}
              <a
                href="https://podimo.com/en/shows/the-other-narrative"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 sm:p-7 bg-background border border-border/70 hover:border-primary rounded-sm transition-all duration-300 hover:shadow-lg space-y-6"
                aria-label="Escuchar The Other Narrative en Podimo (abre en ventana nueva)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                      PLATAFORMA ASOCIADA
                    </span>
                    <span className="h-6 px-2.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider rounded-xs flex items-center">
                      Podcast
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold font-headline tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      Podimo
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all text-primary" />
                    </h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Escucha el catálogo editorial de The Other Narrative desde la web o la aplicación oficial de Podimo.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>Abrir en Podimo</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Spreaker */}
              <a
                href="https://www.spreaker.com/podcast/the-other-narrative--7175122"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 sm:p-7 bg-background border border-border/70 hover:border-primary rounded-sm transition-all duration-300 hover:shadow-lg space-y-6"
                aria-label="Escuchar The Other Narrative en Spreaker (abre en ventana nueva)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                      RED DE DISTRIBUCIÓN
                    </span>
                    <span className="h-6 px-2.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider rounded-xs flex items-center">
                      Feed RSS
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold font-headline tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      Spreaker
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all text-primary" />
                    </h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Accede a la redifusión, sindicación y canal oficial de transmisión y podcast en Spreaker.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>Abrir en Spreaker</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN C. EPISODIOS DESTACADOS (THE OTHER NARRATIVE)
           ========================================================================= */}
        <section id="episodios-destacados" className="scroll-mt-28 space-y-12">
          
          <div className="border-b border-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> EPISODIOS DEL PODCAST
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter text-foreground">
                Conversaciones que abren posibilidades
              </h2>
              <p className="text-muted-foreground text-sm font-light">
                Ideas, experiencias y soluciones para comprender los desafíos de nuestro tiempo.
              </p>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {theOtherNarrativeEpisodes.length} episodios publicados
            </span>
          </div>

          {/* Grid de Episodios Destacados */}
          {isPodLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {theOtherNarrativeEpisodes.map((ep, idx) => {
                const epKey = `ton-${ep.id || idx}`;
                const imgSrc = failedImages[epKey] ? defaultPodcastImage : (ep.image || defaultPodcastImage);
                const isPlayingThis = activePodcast?.id === ep.id;

                return (
                  <article 
                    key={epKey}
                    className={cn(
                      "group flex flex-col bg-card border rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500",
                      isPlayingThis ? "border-primary ring-1 ring-primary" : "border-border/60 hover:border-primary/50"
                    )}
                  >
                    {/* Header visual con portada */}
                    <div 
                      className="relative aspect-video sm:aspect-[16/10] overflow-hidden bg-stone-900 cursor-pointer"
                      onClick={() => {
                        setActivePodcast(ep);
                        setIsPlayerMinimized(false);
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={ep.title}
                        fill
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(epKey)}
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      
                      {/* Badge con número de episodio */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-black/85 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-bold px-3 py-1.5 uppercase tracking-[0.25em]">
                          {ep.episodeNumber || `EPISODIO 0${3 - idx}`}
                        </span>
                      </div>

                      {/* Botón flotante de reproducción */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Contenido Editorial */}
                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        
                        {/* Metadatos: Fecha & Duración */}
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border/40 pb-3">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3 text-primary" /> {ep.date || '2026'}
                          </span>
                          {ep.duration && (
                            <span className="flex items-center gap-1.5 text-primary">
                              <Clock className="h-3 w-3" /> {ep.duration}
                            </span>
                          )}
                        </div>

                        {/* Título */}
                        <h3 
                          onClick={() => {
                            setActivePodcast(ep);
                            setIsPlayerMinimized(false);
                          }}
                          className="text-xl sm:text-2xl font-bold font-headline tracking-tight text-foreground group-hover:text-primary transition-colors cursor-pointer leading-tight"
                        >
                          {ep.title}
                        </h3>

                        {/* Invitados */}
                        {ep.guest && (
                          <p className="text-[11px] font-bold uppercase tracking-wider text-primary/90">
                            Con: {ep.guest}
                          </p>
                        )}

                        {/* Descripción breve */}
                        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-4">
                          {ep.description}
                        </p>
                      </div>

                      {/* Acciones de la Tarjeta */}
                      <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setActivePodcast(ep);
                            setIsPlayerMinimized(false);
                          }}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] h-9 px-4 rounded-xs gap-2"
                        >
                          <Play className="h-3 w-3 fill-current" /> Escuchar episodio
                        </Button>

                        <div className="flex items-center gap-2">
                          {ep.spreakerUrl && (
                            <a
                              href={ep.spreakerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 py-1 px-1.5"
                              title="Abrir en Spreaker"
                            >
                              Spreaker <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <a
                            href={ep.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 py-1 px-1.5"
                            title="Abrir en Spotify"
                          >
                            Spotify <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECCIÓN D. ARCHIVO EDITORIAL: PLANETA SOSTENIBLE
           ========================================================================= */}
        <section id="archivo-planeta-sostenible" className="scroll-mt-28 space-y-12">
          
          {/* Bloque de transición editorial */}
          <div className="bg-muted/30 border border-border/60 p-8 sm:p-12 rounded-sm space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-2">
              <Archive className="h-3.5 w-3.5" /> ARCHIVO HISTÓRICO · TRAYECTORIA EDITORIAL
            </span>
            <p className="text-lg sm:text-xl font-headline italic text-foreground/90 max-w-4xl leading-relaxed">
              «Antes de The Other Narrative, otras conversaciones ya estaban explorando el papel de las empresas, las instituciones y las comunidades en la construcción de un futuro sostenible».
            </p>
          </div>

          {/* Header y Presentación de Planeta Sostenible */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-card border border-border/50 rounded-sm p-8 sm:p-10">
            
            {/* Portada Histórica */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-4">
              <div className="relative w-full max-w-[280px] aspect-square rounded-sm overflow-hidden bg-muted border shadow-md">
                <Image
                  src={failedImages['archive-show'] ? defaultPodcastImage : archiveShow.image}
                  alt={archiveShow.name}
                  fill
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError('archive-show')}
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-stone-900/90 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-widest">
                    ARCHIVO 2023 - 2025
                  </span>
                </div>
              </div>

              <div className="space-y-1 max-w-[280px]">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Créditos institucionales:
                </p>
                <p className="text-[11px] text-foreground/80 font-light leading-relaxed">
                  Iniciativa vinculada a Pacto Global Red Colombia y URosario Radio. Trayectoria editorial y conducción de Ángela María Gómez.
                </p>
              </div>
            </div>

            {/* Contexto del Archivo */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase">
                  {archiveShow.badge || 'PROYECTO ANTERIOR'}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter text-foreground">
                  {archiveShow.name}
                </h3>
                <p className="text-base font-headline italic text-muted-foreground">
                  Una trayectoria de conversaciones sobre empresa, sostenibilidad y transformación.
                </p>
              </div>

              <p className="text-sm text-foreground/75 font-light leading-relaxed">
                {archiveShow.description} A lo largo de su trayectoria, el espacio reunió a líderes empresariales, especialistas y organizaciones para explorar los desafíos sociales, ambientales y económicos de Colombia, desde la licencia social hasta la biodiversidad y la regeneración.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={archiveShow.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-editorial-outline h-10 px-6 text-[10px] tracking-[0.2em] font-bold inline-flex items-center gap-2"
                >
                  Abrir Show en Spotify <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {/* Buscador de episodios en archivo */}
                <div className="relative flex-1 min-w-[240px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchArchive}
                    onChange={(e) => setSearchArchive(e.target.value)}
                    placeholder="Buscar en el archivo histórico..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border/80 rounded-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {searchArchive && (
                    <button
                      onClick={() => setSearchArchive('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Listado de Episodios del Archivo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground border-b pb-3">
              <span>Episodios de Planeta Sostenible ({filteredArchiveEpisodes.length})</span>
              <span>Audio & Spotify Embed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArchiveEpisodes.map((ep) => {
                const epKey = `ps-${ep.id}`;
                const isPlayingThis = activePodcast?.id === ep.id;

                return (
                  <div
                    key={epKey}
                    onClick={() => {
                      setActivePodcast(ep);
                      setIsPlayerMinimized(false);
                    }}
                    className={cn(
                      "flex items-start gap-4 p-5 bg-card border rounded-sm transition-all cursor-pointer hover:border-primary/50 hover:shadow-md",
                      isPlayingThis ? "border-primary bg-primary/[0.03]" : "border-border/60"
                    )}
                  >
                    <div className="relative w-16 h-16 rounded-xs overflow-hidden flex-shrink-0 bg-muted border">
                      <Image
                        src={ep.image || archiveShow.image}
                        alt={ep.title}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary truncate">
                          {ep.guest || 'Planeta Sostenible'}
                        </span>
                        <a
                          href={ep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary p-1"
                          title="Abrir en Spotify"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <h4 className="text-sm font-bold font-headline tracking-tight text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {ep.title}
                      </h4>

                      <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* =========================================================================
            SECCIÓN E. PROYECTOS AUDIOVISUALES Y CONVERSACIONES
           ========================================================================= */}
        <section id="proyectos-audiovisuales" className="scroll-mt-28 space-y-12">
          
          <div className="border-b border-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase inline-flex items-center gap-2">
                <VideoIcon className="h-4 w-4" /> PRODUCCIÓN INSTITUCIONAL
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter text-foreground">
                Proyectos audiovisuales y diálogos
              </h2>
              <p className="text-muted-foreground text-sm font-light">
                Una selección de entrevistas, encuentros y producciones desarrolladas en contextos institucionales y profesionales.
              </p>
            </div>

            <div className="bg-muted/40 border border-border/60 p-4 rounded-sm text-xs text-muted-foreground max-w-sm space-y-1">
              <p className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 text-[10px]">
                <Info className="h-3.5 w-3.5 text-primary" /> Crédito y Derechos
              </p>
              <p className="text-[11px] leading-relaxed">
                Proyectos realizados en el marco de la colaboración con Pacto Global Red Colombia. Los derechos patrimoniales corresponden a sus respectivos titulares.
              </p>
            </div>
          </div>

          {/* Grid de Videos */}
          {isVidLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((vid: any) => {
                const ytId = getYouTubeId(vid.url || vid.id);
                const thumbSrc = vid.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/05.png');

                return (
                  <article key={vid.id} className="group flex flex-col bg-card border border-border/60 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    
                    {/* Trigger para Modal Dialog con reproductor autorizado */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative aspect-video overflow-hidden bg-black cursor-pointer">
                          <Image
                            src={thumbSrc}
                            alt={vid.title}
                            fill
                            referrerPolicy="no-referrer"
                            className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-primary text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] shadow-md">
                              VIDEO
                            </span>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>

                      <DialogContent className="max-w-5xl p-0 bg-black aspect-video border-0 shadow-2xl overflow-hidden rounded-sm">
                        <DialogHeader className="sr-only">
                          <DialogTitle>{vid.title}</DialogTitle>
                          <DialogDescription>Reproductor de video oficial de YouTube</DialogDescription>
                        </DialogHeader>
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1` : vid.url} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen 
                          title={vid.title}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Descripción y Créditos */}
                    <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary block">
                          {vid.institution || 'Pacto Global Red Colombia'}
                        </span>

                        <h3 className="text-xl sm:text-2xl font-bold font-headline tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
                          {vid.title}
                        </h3>

                        {vid.subtitle && (
                          <p className="text-xs font-headline italic text-muted-foreground">
                            {vid.subtitle}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {vid.description}
                        </p>
                      </div>

                      {/* Pie de tarjeta con rol profesional y enlace original */}
                      <div className="pt-4 border-t border-border/40 space-y-3">
                        <p className="text-[10px] text-muted-foreground font-medium">
                          <span className="font-bold text-foreground">Participación:</span> {vid.role || 'Conducción y diálogo editorial de Ángela María Gómez'}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground inline-flex items-center gap-1.5">
                                Ver video <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl p-0 bg-black aspect-video border-0 shadow-2xl overflow-hidden rounded-sm">
                              <DialogHeader className="sr-only">
                                <DialogTitle>{vid.title}</DialogTitle>
                                <DialogDescription>Reproductor de video oficial</DialogDescription>
                              </DialogHeader>
                              <iframe 
                                width="100%" 
                                height="100%" 
                                src={ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1` : vid.url} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                                title={vid.title}
                              />
                            </DialogContent>
                          </Dialog>

                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                            title="Ver en canal oficial de YouTube"
                          >
                            YouTube Oficial <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}

          {/* Nota de Derechos Patrimoniales */}
          <div className="text-center p-6 bg-muted/20 border border-border/40 rounded-sm">
            <p className="text-xs text-muted-foreground font-light max-w-3xl mx-auto">
              Videos publicados originalmente en el canal oficial de Pacto Global Red Colombia. Esta muestra representa la trayectoria profesional y editorial de Ángela María Gómez Duque; los derechos patrimoniales corresponden a sus respectivos titulares conforme a los acuerdos institucionales aplicables.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN F. CIERRE EDITORIAL
           ========================================================================= */}
        <section className="py-16 sm:py-24 border-t border-border/60 bg-gradient-to-b from-transparent to-muted/20 text-center space-y-8 rounded-sm">
          <div className="max-w-3xl mx-auto space-y-4 px-4">
            <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase block">
              HORIZONTE EDITORIAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter text-foreground">
              Las historias también construyen futuro.
            </h2>
            <p className="text-base sm:text-lg font-light text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Seguimos explorando las ideas, las personas y las iniciativas que transforman la manera en que entendemos el mundo y actuamos sobre él.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 px-4">
            <button
              onClick={() => scrollToSection('podcast-principal')}
              className="btn-editorial bg-primary text-white hover:bg-secondary h-12 px-8 text-[10px] tracking-[0.25em] font-bold shadow-md transition-all"
            >
              Escuchar The Other Narrative
            </button>

            <button
              onClick={() => scrollToSection('episodios-destacados')}
              className="btn-editorial btn-editorial-outline h-12 px-8 text-[10px] tracking-[0.25em] font-bold transition-all"
            >
              Explorar las conversaciones
            </button>

            <Link
              href="/conciencia"
              className="btn-editorial border-border text-foreground hover:bg-muted/40 h-12 px-8 text-[10px] tracking-[0.25em] font-bold inline-flex items-center gap-2 transition-all"
            >
              Conocer The Other Narrative <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

      </div>

      {/* =========================================================================
          REPRODUCTOR PERSISTENTE COMPACTO (SPOTIFY WHITE EDITORIAL)
         ========================================================================= */}
      <div 
        className={cn(
          "fixed z-[120] transition-all duration-500 ease-in-out bg-white dark:bg-stone-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-border/40 overflow-hidden",
          !activePodcast && "pointer-events-none opacity-0 translate-y-20",
          activePodcast && !isPlayerMinimized && "bottom-6 right-6 w-[94%] sm:w-[400px] rounded-sm flex flex-col p-6 h-fit max-h-[90vh]",
          activePodcast && isPlayerMinimized && "bottom-6 right-6 w-80 h-20 rounded-sm"
        )}
        role="region"
        aria-label="Reproductor de audio integrado"
      >
        {activePodcast && (
          <div className="w-full h-full flex flex-col">
            
            {/* Header: Controles y Tag (Solo visible en FULL) */}
            <div className={cn("flex justify-between items-center mb-4 pb-2 border-b border-border/30", isPlayerMinimized && "hidden")}>
               <span className="text-primary font-bold text-[9px] tracking-[0.3em] uppercase flex items-center gap-1.5 truncate max-w-[240px]">
                 <Sparkles className="h-3 w-3 text-primary flex-shrink-0" /> {activePodcast.showName || 'THE OTHER NARRATIVE'}
               </span>
               <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-foreground/50 hover:text-foreground" 
                    onClick={() => setIsPlayerMinimized(true)}
                    title="Minimizar reproductor"
                    aria-label="Minimizar reproductor"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-foreground/50 hover:text-destructive" 
                    onClick={() => setActivePodcast(null)}
                    title="Cerrar reproductor"
                    aria-label="Cerrar reproductor"
                  >
                    <X className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Vista Mini / Full */}
            <div className={cn("flex transition-all duration-500", !isPlayerMinimized ? "flex-col" : "flex-row items-center gap-4 p-3 h-full")}>
              
              {/* Información expandida */}
              <div className={cn("w-full space-y-2 mb-3", isPlayerMinimized && "hidden")}>
                <h4 className="font-bold font-headline text-base text-foreground leading-snug line-clamp-2">
                  {activePodcast.title}
                </h4>
                {activePodcast.guest && (
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Con {activePodcast.guest}
                  </p>
                )}
              </div>

              {/* Vista Minimizada */}
              <div className={cn("flex items-center justify-between w-full flex-1", !isPlayerMinimized && "hidden")}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 rounded-xs overflow-hidden border flex-shrink-0 bg-muted">
                    <Image 
                      src={activePodcast.image || defaultPodcastImage} 
                      alt={activePodcast.title} 
                      fill 
                      referrerPolicy="no-referrer" 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-foreground truncate max-w-[140px]">{activePodcast.title}</span>
                    <span className="text-[9px] text-primary uppercase font-bold tracking-wider truncate">{activePodcast.showName}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-foreground hover:text-primary" 
                    onClick={() => setIsPlayerMinimized(false)}
                    aria-label="Expandir reproductor"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-foreground hover:text-destructive" 
                    onClick={() => setActivePodcast(null)}
                    aria-label="Cerrar reproductor"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* El Reproductor Spotify Iframe */}
              <div className={cn(
                "w-full transition-all duration-500",
                isPlayerMinimized ? "h-0 opacity-0 overflow-hidden pointer-events-none" : "h-[152px] opacity-100"
              )}>
                <iframe 
                  src={getAudioEmbedUrl(activePodcast.url, activePodcast.spreakerUrl)} 
                  width="100%" 
                  height="152"
                  frameBorder="0" 
                  allow="encrypted-media; autoplay; clipboard-write"
                  className="rounded-sm"
                  title={`Reproduciendo: ${activePodcast.title}`}
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        )}
      </div>

    </main>
  );
}
