
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Radio } from 'lucide-react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-white py-12 md:py-16 border-t border-white/5">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-12 md:mb-16">
          <div className="md:col-span-5 space-y-6">
            <Link 
              href="/" 
              className="relative block h-10 sm:h-12 w-48 sm:w-60 hover:opacity-90 transition-opacity"
            >
              <Image
                src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/para%20fondo%20negro/Recurso%2021.png"
                alt="The Other Narrative"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary">
              Narrativas. Confianza. Participación. Impacto.
            </p>
            <p className="text-base font-light text-white/40 leading-relaxed max-w-sm">
              Laboratorio estratégico y editorial que ayuda a transformar conocimiento, propósito y estrategia en narrativas capaces de generar comprensión y acción.
            </p>
            <div className="flex gap-6 pt-2">
              <a href="https://www.linkedin.com/in/angelamgomezd/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="h-10 w-10 border border-white/10 flex items-center justify-center hover:bg-primary transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://open.spotify.com/show/4fIwE8OUNlJkszY6XQZcO5" target="_blank" rel="noopener noreferrer" className="h-10 w-10 border border-white/10 flex items-center justify-center hover:bg-primary transition-all">
                <Radio className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Navegación</span>
              <ul className="space-y-4 text-sm font-medium uppercase tracking-widest text-white/60">
                <li><Link href="/conciencia" className="hover:text-primary transition-colors">Mirada</Link></li>
                <li><Link href="/experiencia" className="hover:text-primary transition-colors">Áreas</Link></li>
                <li><Link href="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Insights</Link></li>
                <li><Link href="/multimedia" className="hover:text-primary transition-colors">Multimedia</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Contacto</span>
              <ul className="space-y-4 text-sm font-medium uppercase tracking-widest text-white/60">
                <li><Link href="/contacto" className="hover:text-primary transition-colors">Conversemos</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Editor Access</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            © {year || ''} THE OTHER NARRATIVE | NARRATIVAS QUE GENERAN CONFIANZA.
          </p>
        </div>
      </div>
    </footer>
  );
}
