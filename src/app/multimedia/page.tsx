
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { spotifyPodcasts, spotifyShows, PodcastEpisode } from '@/data/podcasts';
import { 
  Play, 
  Mic2, 
  Loader2, 
  ChevronRight,
  Video as VideoIcon,
  X,
  Maximize2,
  CalendarDays,
  ExternalLink,
  Radio,
  Sparkles
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const defaultVideos = [
  { 
    id: '0DmyalU2zL4', 
    url: 'https://www.youtube.com/watch?v=0DmyalU2zL4', 
    title: 'HAY FESTIVAL: Diálogos de Cambio', 
    thumbnail: 'https://img.youtube.com/vi/0DmyalU2zL4/hqdefault.jpg' 
  },
  { 
    id: 'VzQC-PPZmKQ', 
    url: 'https://www.youtube.com/watch?v=VzQC-PPZmKQ', 
    title: 'Conferencia: Narrativas que Movilizan', 
    thumbnail: 'https://img.youtube.com/vi/VzQC-PPZmKQ/hqdefault.jpg' 
  },
  { 
    id: 'JhQ_EpuoiOQ', 
    url: 'https://www.youtube.com/watch?v=JhQ_EpuoiOQ', 
    title: 'Estrategia de Comunicación Responsable', 
    thumbnail: 'https://img.youtube.com/vi/JhQ_EpuoiOQ/hqdefault.jpg' 
  }
];

export default function MultimediaPage() {
  const firestore = useFirestore();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'multimedia-bg') || PlaceHolderImages.find(img => img.id === 'resonancia-bg');

  const [activePodcast, setActivePodcast] = useState<PodcastEpisode | any>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [selectedShow, setSelectedShow] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const podcastsQuery = useMemoFirebase(() => query(collection(firestore, 'podcasts'), orderBy('createdAt', 'desc')), [firestore]);
  const videosQuery = useMemoFirebase(() => query(collection(firestore, 'featuredVideos'), orderBy('createdAt', 'desc')), [firestore]);

  const { data: fbPodcasts, isLoading: isPodLoading } = useCollection(podcastsQuery);
  const allPodcasts = [...(fbPodcasts || []), ...spotifyPodcasts.filter(sp => !(fbPodcasts || []).some((fp: any) => fp.url?.includes(sp.id)))];
  
  const filteredPodcasts = selectedShow === 'all' 
    ? allPodcasts 
    : allPodcasts.filter(p => p.showId === selectedShow || p.showName?.toLowerCase().includes(selectedShow.toLowerCase()));

  const { data: fbVideos, isLoading: isVidLoading } = useCollection(videosQuery);
  const videos = (fbVideos && fbVideos.length > 0) ? fbVideos : defaultVideos;

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    if (url.length === 11) return url;
    return null;
  };

  const getSpotifyEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('spotify.com')) {
      return url.replace('spotify.com/', 'spotify.com/embed/');
    }
    return url;
  };

  const defaultPodcastImage = 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/10%20Laboratorio%20Editorial.png';
  const defaultVideoImage = 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/05.png';

  const getVideoThumbnail = (video: any, ytId: string | null) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.image) return video.image;
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return defaultVideoImage;
  };

  const formatPodcastDate = (dateVal: any, defaultText = 'Ecosistema MEDULAR') => {
    if (!dateVal) return defaultText;
    try {
      const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
      if (isNaN(d.getTime())) return defaultText;
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return defaultText;
    }
  };

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <main className="bg-background min-h-screen relative">
      {/* HERO BANNER */}
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_05%20multimedia.png'}
            alt="Multimedia"
            fill
            referrerPolicy="no-referrer"
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">
            Laboratorio Editorial & Sonoro
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-white">
              Multimedia <br />
              <span className="italic font-normal text-primary">& Diálogo.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-20 sm:py-28 space-y-28">
        
        {/* SHOWS DE SPOTIFY DESTACADOS */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-3">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-2">
                <Radio className="h-4 w-4" /> Ecosistema Sonoro en Spotify
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter">Programas & Series</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Explora las narrativas, líderes y aprendizajes que impulsan la transformación y la regeneración en Iberoamérica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spotifyShows.map((show) => (
              <div 
                key={show.id}
                className="group relative flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white border border-border/50 hover:border-primary/50 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative w-full sm:w-40 aspect-square rounded-sm overflow-hidden flex-shrink-0 bg-muted">
                  <Image
                    src={failedImages[`show-${show.id}`] ? defaultPodcastImage : show.image}
                    alt={show.name}
                    fill
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(`show-${show.id}`)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-black/80 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest rounded-xs">
                      SHOW
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">
                      SPOTIFY ORIGINAL / PARTNER
                    </span>
                    <h3 className="text-2xl font-bold font-headline tracking-tight group-hover:text-primary transition-colors">
                      {show.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {show.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedShow(show.id)}
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider h-8 rounded-xs",
                        selectedShow === show.id && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      )}
                    >
                      Ver Episodios
                    </Button>
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-2 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"
                    >
                      Abrir Spotify <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PODCAST EPISODES SECTION */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
            <div className="space-y-3">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-3">
                <Mic2 className="h-4 w-4" /> Archivo de Episodios
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter">
                Episodios Disponibles
              </h2>
            </div>

            {/* FILTROS POR SHOW */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedShow === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedShow('all')}
                className="text-xs font-bold uppercase tracking-wider rounded-xs h-8"
              >
                Todos ({allPodcasts.length})
              </Button>
              <Button
                variant={selectedShow === '033PCu2aysmpjGuazxZ0Oz' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedShow('033PCu2aysmpjGuazxZ0Oz')}
                className="text-xs font-bold uppercase tracking-wider rounded-xs h-8"
              >
                The Other Narrative
              </Button>
              <Button
                variant={selectedShow === '4fIwE8OUNlJkszY6XQZcO5' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedShow('4fIwE8OUNlJkszY6XQZcO5')}
                className="text-xs font-bold uppercase tracking-wider rounded-xs h-8"
              >
                Planeta Sostenible
              </Button>
            </div>
          </div>

          {isPodLoading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : filteredPodcasts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No hay episodios en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPodcasts.map((pod) => {
                const imgSrc = failedImages[`pod-${pod.id}`] ? defaultPodcastImage : (pod.image || defaultPodcastImage);
                return (
                  <div 
                    key={pod.id}
                    onClick={() => {
                      setActivePodcast(pod);
                      setIsPlayerMinimized(false);
                    }}
                    className="group flex flex-col bg-white border border-border/40 hover:border-primary/40 transition-all duration-700 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl h-full cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={imgSrc}
                        alt={pod.title || 'Episodio de podcast'}
                        fill
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(`pod-${pod.id}`)}
                        className="object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                        <span className="bg-primary text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                          {pod.showName || 'PODCAST'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3 text-primary/70" /> {formatPodcastDate(pod.createdAt, pod.showName || 'MEDULAR')}
                          </span>
                          {pod.guest && (
                            <span className="text-primary font-bold truncate max-w-[140px]">
                              {pod.guest}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
                          {pod.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                          {pod.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                         <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary group-hover:gap-3 transition-all flex items-center gap-1.5">
                          ESCUCHAR AHORA <ChevronRight className="h-3 w-3" />
                        </span>
                        <a
                          href={pod.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground/60 hover:text-primary transition-colors p-1"
                          title="Abrir en Spotify"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* VIDEOS SECTION */}
        <section className="space-y-16">
          <div className="flex items-center justify-between border-b pb-8">
            <div className="space-y-4">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-3">
                <VideoIcon className="h-4 w-4" /> Diálogos de Cambio
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter">Videos</h2>
            </div>
          </div>

          {isVidLoading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos?.map((video) => {
                const ytId = getYouTubeId(video.url || video.id);
                const thumbSrc = getVideoThumbnail(video, ytId);
                return (
                  <Dialog key={video.id}>
                    <DialogTrigger asChild>
                      <div className="group flex flex-col bg-white border border-border/40 hover:border-primary/40 transition-all duration-700 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl h-full cursor-pointer">
                        <div className="relative aspect-video overflow-hidden bg-black">
                          <Image
                            src={thumbSrc}
                            alt={video.title}
                            fill
                            referrerPolicy="no-referrer"
                            className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-primary text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                              VIDEO
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                              <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-8">
                          <h3 className="text-xl font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-500 leading-tight">
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl p-0 bg-black aspect-video border-0 shadow-2xl overflow-hidden rounded-sm">
                      <DialogHeader className="sr-only">
                        <DialogTitle>{video.title}</DialogTitle>
                        <DialogDescription>Reproductor de video</DialogDescription>
                      </DialogHeader>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : video.url} 
                        frameBorder="0" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen 
                        title={video.title}
                      />
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* REPRODUCTOR PERSISTENTE COMPACTO (ESTILO SPOTIFY WHITE) */}
      <div 
        className={cn(
          "fixed z-[120] transition-all duration-500 ease-in-out bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-border/20 overflow-hidden",
          !activePodcast && "pointer-events-none opacity-0 translate-y-20",
          activePodcast && !isPlayerMinimized && "bottom-8 right-8 w-[95%] sm:w-[380px] rounded-sm flex flex-col p-6 sm:p-8 h-fit max-h-[90vh]",
          activePodcast && isPlayerMinimized && "bottom-8 right-8 w-72 h-20 rounded-sm"
        )}
      >
        {activePodcast && (
          <div className="w-full h-full flex flex-col">
            
            {/* Header: Controles y Tag (Solo visible en FULL) */}
            <div className={cn("flex justify-between items-center mb-6", isPlayerMinimized && "hidden")}>
               <span className="text-primary font-bold text-[9px] tracking-[0.4em] uppercase flex items-center gap-1.5">
                 <Sparkles className="h-3 w-3" /> {activePodcast.showName || 'LABORATORIO SONORO'}
               </span>
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/40 hover:text-primary" onClick={() => setIsPlayerMinimized(true)}>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/40 hover:text-destructive" onClick={() => setActivePodcast(null)}>
                    <X className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Contenedor de Contenido (Full / Mini) */}
            <div className={cn(
              "flex transition-all duration-500",
              !isPlayerMinimized ? "flex-col" : "flex-row items-center gap-4 p-3 h-full"
            )}>
              
              {/* VISTA FULL: Compacta y Vertical */}
              <div className={cn("w-full flex flex-col", isPlayerMinimized && "hidden")}>
                
                {/* Banner: Imagen + Título Blanco Superpuesto */}
                <div className="relative w-full aspect-square sm:max-h-[220px] overflow-hidden rounded-sm shadow-md mb-6 group">
                  <Image 
                    src={failedImages[`player-${activePodcast.id}`] ? defaultPodcastImage : (activePodcast.image || defaultPodcastImage)} 
                    alt={activePodcast.title} 
                    fill 
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(`player-${activePodcast.id}`)}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Título sobre la imagen en blanco */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-bold font-headline tracking-tighter leading-[1.1] text-white text-base sm:text-lg animate-in fade-in slide-in-from-bottom-2 duration-700">
                      {activePodcast.title}
                    </h3>
                  </div>
                </div>

                {/* Crédito del Invitado o Show */}
                {(activePodcast.guest || activePodcast.showName) && (
                  <div className="w-full border-l-2 border-primary/40 pl-4 py-1 mb-4 flex justify-between items-center">
                    <p className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.3em] uppercase italic opacity-90 leading-relaxed">
                      {activePodcast.guest ? `CON ${activePodcast.guest}` : activePodcast.showName}
                    </p>
                    <a
                      href={activePodcast.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      Spotify <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* VISTA MINIMIZADA */}
              <div className={cn("flex items-center justify-between w-full flex-1", !isPlayerMinimized && "hidden")}>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-sm border flex-shrink-0 shadow-sm">
                    <Image 
                      src={activePodcast.image || defaultPodcastImage} 
                      alt={activePodcast.title} 
                      fill 
                      referrerPolicy="no-referrer" 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col max-w-[120px]">
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest truncate">{activePodcast.title}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 items-center">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:text-primary transition-colors" onClick={() => setIsPlayerMinimized(false)}>
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:text-destructive transition-colors" onClick={() => setActivePodcast(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* EL REPRODUCTOR: PERSISTENTE */}
              <div className={cn(
                "w-full transition-all duration-500",
                isPlayerMinimized ? "h-0 opacity-0 overflow-hidden pointer-events-none" : "h-[152px] mt-2 opacity-100"
              )}>
                <iframe 
                  src={getSpotifyEmbedUrl(activePodcast.url)} 
                  width="100%" 
                  height="152"
                  frameBorder="0" 
                  allow="encrypted-media; autoplay"
                  className="rounded-sm"
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}


