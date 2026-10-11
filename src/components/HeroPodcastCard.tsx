"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ArrowUpRight, 
  ExternalLink, 
  ChevronRight, 
  X, 
  Volume2 
} from 'lucide-react';

import { cn } from '@/lib/utils';

export interface LatestEpisodeData {
  episodeId: string;
  title: string;
  episodeNumber?: string;
  subtitle?: string;
  description?: string;
  spreakerUrl: string;
  spreakerShowUrl: string;
  spotifyShowUrl: string;
  podimoShowUrl?: string;
  imageUrl?: string;
  publishedAt?: string;
  duration?: string;
}

const DEFAULT_EPISODE: LatestEpisodeData = {
  episodeId: "75136124",
  title: "Equidad y Complementariedad Energética",
  episodeNumber: "EPISODIO 03",
  subtitle: "Nuevas miradas para transformar",
  description: "Descubre nuestra conversación más reciente sobre sostenibilidad, innovación y soluciones.",
  spreakerUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122",
  spreakerShowUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122",
  spotifyShowUrl: "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz",
  podimoShowUrl: "https://podimo.com/en/shows/the-other-narrative",
  imageUrl: "https://d3wo5wojvuv7l.cloudfront.net/t_square_limited_160/images.spreaker.com/original/38cb7bb9be1eef3a684443b1042baa38.jpg",
  publishedAt: "15 de septiembre de 2026",
  duration: "33 min",
};

export function HeroPodcastCard({ className }: { className?: string }) {
  const [episode, setEpisode] = useState<LatestEpisodeData>(DEFAULT_EPISODE);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/podcast/latest')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data && data.episodeId) {
          setEpisode(prev => ({ 
            ...prev, 
            ...data,
            // Mantener destino oficial al show de Spreaker según especificación
            spreakerShowUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122"
          }));
        }
      })
      .catch(() => {
        // En caso de fallo de red, conserva DEFAULT_EPISODE comprobado
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div 
      className={cn(
        "w-full bg-[#121212]/90 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 lg:p-6 shadow-2xl space-y-3.5 sm:space-y-4",
        className
      )}
      role="region"
      aria-label="Acceso al último episodio del podcast"
    >
      {/* Cabecera Editorial con Onda Sonora */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Icono de onda sonora en acento amarillo */}
          <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
            <span className="w-0.5 h-2 bg-amber-400 rounded-full" />
            <span className="w-0.5 h-3.5 bg-amber-400 rounded-full" />
            <span className="w-0.5 h-2.5 bg-amber-400 rounded-full" />
            <span className="w-0.5 h-1 bg-amber-400 rounded-full" />
          </div>
          <span className="text-amber-400 font-bold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase">
            PODCAST · NUEVO EPISODIO
          </span>
        </div>

        <span className="bg-white/10 text-white/80 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-xs">
          THE OTHER NARRATIVE
        </span>
      </div>

      {/* Titular y Descripción del Episodio */}
      <div className="space-y-1.5">
        <h3 className="text-lg sm:text-xl font-bold font-headline text-white tracking-tight leading-snug">
          Las ideas que transforman el futuro.
        </h3>
        
        <p className="text-xs sm:text-[13px] text-white/75 font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
          {episode.description}
        </p>

        {/* Identificador real del episodio */}
        <div className="flex items-center gap-2 pt-0.5 text-[11px]">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] shrink-0">
            {episode.episodeNumber || 'EPISODIO 03'}:
          </span>
          <span className="text-white/90 font-medium truncate">
            {episode.title}
          </span>
        </div>
      </div>

      {/* Barra Interactiva de Reproducción y Acceso a Spreaker */}
      <div className="pt-0.5">
        <div className="flex items-center justify-between gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/40 rounded-lg p-2.5 sm:p-3 transition-all duration-300 group">
          
          {/* Botón Circular Amarillo de Play */}
          <button
            type="button"
            onClick={() => setIsPlayerOpen(!isPlayerOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center flex-shrink-0 shadow-md transform group-hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={isPlayerOpen ? "Minimizar reproductor oficial" : "Reproducir último episodio"}
            title={isPlayerOpen ? "Minimizar reproductor" : "Reproducir episodio"}
          >
            {isPlayerOpen ? (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-black text-black ml-0.5" />
            )}
          </button>

          {/* Texto de Acción */}
          <button
            type="button"
            onClick={() => setIsPlayerOpen(!isPlayerOpen)}
            className="flex-1 min-w-0 text-left focus:outline-none"
          >
            <p className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-tight truncate">
              {isPlayerOpen ? "Reproduciendo episodio" : "Escucha el último episodio"}
            </p>
            <p className="text-[10px] sm:text-[11px] text-white/60 font-light truncate mt-0.5">
              {isPlayerOpen ? "Haz clic para cerrar el reproductor" : "Disponible en Spreaker"}
            </p>
          </button>

          {/* Enlace directo oficial al podcast en Spreaker */}
          <a
            href="https://www.spreaker.com/podcast/the-other-narrative--7175122"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors shrink-0"
            title="Abrir página oficial del podcast en Spreaker (abre en ventana nueva)"
            aria-label="Abrir podcast en Spreaker en una nueva pestaña"
          >
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Mini Reproductor Oficial de Spreaker (Opción A Integrada) */}
      {isPlayerOpen && (
        <div className="pt-1.5 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-[10px] text-white/60 px-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <Volume2 className="h-3 w-3 animate-pulse" /> Reproductor Oficial Spreaker
            </span>
            <button
              type="button"
              onClick={() => setIsPlayerOpen(false)}
              className="text-white/60 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 rounded-xs hover:bg-white/10 transition-colors"
            >
              <X className="h-3 w-3" /> Cerrar
            </button>
          </div>

          <div className="w-full h-[120px] rounded-lg overflow-hidden border border-white/15 bg-black/80 shadow-inner">
            <iframe
              src={`https://widget.spreaker.com/player?episode_id=${episode.episodeId}&theme=dark&playlist=false&playlist-continuous=false&chapters-image=true&episode_image_position=left&hide-logo=false&hide-likes=false&hide-comments=false&hide-sharing=false&hide-download=true`}
              width="100%"
              height="120"
              frameBorder="0"
              title={`Reproductor Spreaker: ${episode.title}`}
              loading="lazy"
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Acciones Secundarias de Navegación Editorial */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
        <Link
          href="/multimedia"
          className="text-white/75 hover:text-amber-400 transition-colors inline-flex items-center gap-1 group/link"
        >
          Ver todos los episodios 
          <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex items-center gap-2.5">
          <a
            href={episode.spotifyShowUrl || "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
          >
            Spotify <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-white/20 select-none">·</span>
          <a
            href="https://www.spreaker.com/podcast/the-other-narrative--7175122"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
          >
            Spreaker <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

    </div>
  );
}
