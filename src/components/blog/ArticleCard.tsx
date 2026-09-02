
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  type: string;
  status?: string;
  date: string;
  readTime?: number;
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const defaultImage = PlaceHolderImages.find(img => img.id === 'bitacora')?.imageUrl || '';
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (article.date) {
      setFormattedDate(new Date(article.date).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }));
    }
  }, [article.date]);

  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <div className={cn(
        "flex flex-col bg-white border border-border/40 hover:border-primary/40 transition-all duration-700 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl h-full",
        featured && "lg:flex-row lg:col-span-2"
      )}>
        <div className={cn(
          "relative overflow-hidden bg-black",
          featured ? "lg:w-1/2 aspect-video lg:aspect-square" : "aspect-[16/10]"
        )}>
          <Image
            src={article.image || defaultImage}
            alt={article.title}
            fill
            referrerPolicy="no-referrer"
            className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-110"
          />
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <span className="bg-primary text-white text-[8px] font-bold px-4 py-2 uppercase tracking-[0.2em] shadow-2xl">
              {article.type}
            </span>
            {article.status === 'draft' && (
              <span className="bg-amber-600 text-white text-[8px] font-bold px-3 py-2 uppercase tracking-[0.2em] shadow-2xl">
                Borrador
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        <div className="p-10 md:p-14 space-y-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
              <span className="flex items-center gap-2.5"><CalendarDays className="h-3.5 w-3.5 text-primary/40" /> {formattedDate}</span>
              {article.readTime && <span className="flex items-center gap-2.5"><Clock className="h-3.5 w-3.5 text-primary/40" /> {article.readTime} min</span>}
            </div>
            <h3 className={cn(
              "font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-700 leading-tight",
              featured ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
            )}>
              {article.title}
            </h3>
            <p className={cn(
              "text-foreground/50 font-light leading-relaxed",
              featured ? "text-lg md:text-xl line-clamp-4" : "text-sm md:text-base line-clamp-3"
            )}>
              {article.excerpt}
            </p>
          </div>
          
          <div className="pt-8 flex items-center justify-between mt-auto border-t border-border/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary group-hover:translate-x-3 transition-all duration-700 flex items-center gap-4">
              Leer bitácora <ArrowRight className="h-4 w-4" />
            </span>
            <div className="h-px w-0 bg-primary/20 group-hover:w-24 transition-all duration-1000 hidden md:block" />
          </div>
        </div>
      </div>
    </Link>
  );
}
