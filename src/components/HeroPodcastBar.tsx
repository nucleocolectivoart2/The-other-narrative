"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ExternalLink, 
  X, 
  Volume2
} from 'lucide-react';

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
  episodeId: "75793759",
  title: "Sostenibilidad bajo presión: evidencia, justicia climática y liderazgo",
  episodeNumber: "EPISODIO 04",
  subtitle: "Evidencia, justicia climática y liderazgo",
  description: "Tres historias para entender por qué la sostenibilidad necesita hoy menos promesas y más evidencia, responsabilidad y acción.",
  spreakerUrl: "https://www.spreaker.com/episode/4-sostenibilidad-bajo-presion-evidencia-justicia-climatica-y-liderazgo--75793759",
  spreakerShowUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122",
  spotifyShowUrl: "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz",
  podimoShowUrl: "https://podimo.com/en/shows/the-other-narrative",
  imageUrl: "https://d3wo5wojvuv7l.cloudfront.net/t_square_limited_160/images.spreaker.com/original/8fb0620950fd73701fd9d1637a9772d8.jpg",
  publishedAt: "14 de octubre de 2026",
  duration: "27 min",
};

export function HeroPodcastBar() {
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
            title: data.title || prev.title,
            spreakerShowUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122",
            podimoShowUrl: "https://podimo.com/en/shows/the-other-narrative",
          }));
        }
      })
      .catch(() => {
        // En caso de fallo de red, conserva DEFAULT_EPISODE
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside 
      className="w-full bg-[#0d0d0d] border-y border-white/10 text-white relative z-30 transition-all duration-300"
      aria-label="Barra del último episodio de The Other Narrative Podcast"
    >
      <div className="section-container py-3.5 sm:py-4 lg:py-4">
        {/* Fila principal en escritorio (90-120px) / 2 filas ordenadas en móvil */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          
          {/* Bloque Izquierdo + Central */}
          <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
            
            {/* Botón Circular de Play en Amarillo */}
            <button
              type="button"
              onClick={() => setIsPlayerOpen(!isPlayerOpen)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shrink-0 shadow-md transform hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={isPlayerOpen ? "Cerrar reproductor oficial" : "Reproducir último episodio"}
              title={isPlayerOpen ? "Cerrar reproductor" : "Reproducir episodio"}
            >
              {isPlayerOpen ? (
                <Volume2 className="h-5 w-5 text-black" />
              ) : (
                <Play className="h-5 w-5 fill-black text-black ml-0.5" />
              )}
            </button>

            {/* Información Editorial */}
            <div className="space-y-0.5 min-w-0 flex-1">
              
              {/* Etiqueta superior pequeña */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0" aria-hidden="true">
                  <span className="w-0.5 h-2 bg-amber-400 rounded-full" />
                  <span className="w-0.5 h-3 bg-amber-400 rounded-full" />
                  <span className="w-0.5 h-2 bg-amber-400 rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.25em] truncate">
                  THE OTHER NARRATIVE · PODCAST
                </span>
                <span className="text-white/30 text-[9px] uppercase tracking-widest hidden md:inline">
                  · {episode.episodeNumber || 'EPISODIO 03'}
                </span>
              </div>

              {/* Título Principal y Subtítulo con el Nombre del Episodio */}
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0">
                <h3 className="text-sm sm:text-base font-bold font-headline text-white tracking-tight">
                  Escucha el último episodio
                </h3>
                <span className="text-white/40 hidden sm:inline text-xs font-light">—</span>
                <p className="text-xs sm:text-sm text-white/80 font-light truncate max-w-xl">
                  «{episode.title}»
                </p>
              </div>

              {/* Texto secundario */}
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-white/50 pt-0.5">
                <a 
                  href={episode.spreakerShowUrl || "https://www.spreaker.com/podcast/the-other-narrative--7175122"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                  title="Abrir show oficial en Spreaker"
                >
                  Disponible en Spreaker <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
                <span className="text-white/20 select-none">·</span>
                <Link 
                  href="/multimedia" 
                  className="text-amber-400/90 hover:text-amber-300 font-medium transition-colors hover:underline"
                >
                  Ver todos los episodios
                </Link>
              </div>

            </div>
          </div>

          {/* Bloque Derecho: Botón CTA y enlaces secundarios a plataformas */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 lg:gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
            
            {/* Botón Principal: Escuchar Episodio en Spreaker */}
            <a
              href={episode.spreakerUrl || episode.spreakerShowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial bg-amber-400 hover:bg-amber-300 text-black font-bold h-9 sm:h-10 px-5 text-[9px] sm:text-[10px] tracking-[0.2em] rounded-xs shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 group shrink-0"
              title="Escuchar episodio en Spreaker (abre en ventana nueva)"
              aria-label="Escuchar episodio en Spreaker en una nueva pestaña"
            >
              <span>Escuchar episodio</span>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Enlaces Secundarios: Spreaker, Spotify y Podimo */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
              <a
                href={episode.spreakerShowUrl || "https://www.spreaker.com/podcast/the-other-narrative--7175122"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 py-1"
                title="Abrir canal en Spreaker"
              >
                Spreaker <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-white/20 select-none">·</span>
              <a
                href={episode.spotifyShowUrl || "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 py-1"
                title="Abrir show en Spotify"
              >
                Spotify <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-white/20 select-none">·</span>
              <a
                href={episode.podimoShowUrl || "https://podimo.com/en/shows/the-other-narrative"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 py-1"
                title="Abrir show en Podimo"
              >
                Podimo <ExternalLink className="h-3 w-3" />
              </a>
            </div>

          </div>

        </div>

        {/* Reproductor oficial Spreaker expandible (si el usuario pulsa play para escuchar in-situ) */}
        {isPlayerOpen && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-[10px] text-white/60 px-1">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                <Volume2 className="h-3 w-3 animate-pulse" /> Reproductor Oficial Spreaker · «{episode.title}»
              </span>
              <button
                type="button"
                onClick={() => setIsPlayerOpen(false)}
                className="text-white/60 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 rounded-xs hover:bg-white/10 transition-colors"
              >
                <X className="h-3 w-3" /> Cerrar reproductor
              </button>
            </div>

            <div className="w-full h-[110px] rounded-sm overflow-hidden border border-white/15 bg-black">
              <iframe
                src={`https://widget.spreaker.com/player?episode_id=${episode.episodeId}&theme=dark&playlist=false&playlist-continuous=false&chapters-image=true&episode_image_position=left&hide-logo=false&hide-likes=false&hide-comments=false&hide-sharing=false&hide-download=true`}
                width="100%"
                height="110"
                frameBorder="0"
                title={`Reproductor Spreaker: ${episode.title}`}
                loading="lazy"
                className="rounded-sm"
              />
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
