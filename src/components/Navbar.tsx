"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Mirada', href: '/conciencia' },
  { name: 'Áreas', href: '/experiencia' },
  { name: 'Proyectos', href: '/proyectos' },
  { name: 'Insights', href: '/blog' },
  { name: 'Multimedia', href: '/multimedia' },
  { name: 'Contacto', href: '/contacto' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const isLightNav = scrolled || isOpen || !isHomePage;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out px-4 sm:px-6 md:px-12",
        scrolled 
          ? "bg-background/95 backdrop-blur-md border-b py-3 shadow-sm" 
          : "bg-transparent py-4 sm:py-6"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="relative z-[70] flex items-center h-8 sm:h-9 w-36 sm:w-48 transition-all duration-500 hover:opacity-90"
          >
            <Image
              src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/para%20fondo%20negro/Recurso%2021.png"
              alt="The Other Narrative"
              fill
              priority
              className={cn(
                "object-contain object-left transition-all duration-500",
                isLightNav ? "invert brightness-0" : "brightness-100"
              )}
            />
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-8">
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-10">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:text-primary",
                        isLightNav ? "text-foreground/75 hover:text-primary" : "text-white/80 hover:text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 z-[70] group focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between items-end">
                <span className={cn(
                  "h-[1.5px] transition-all duration-500 ease-in-out",
                  isOpen ? "w-5 absolute top-1/2 -rotate-45 bg-foreground" : cn("w-5", isLightNav ? "bg-foreground" : "bg-white")
                )} />
                <span className={cn(
                  "h-[1.5px] transition-all duration-300 ease-in-out",
                  isOpen ? "opacity-0 w-0 bg-foreground" : cn("w-3", isLightNav ? "bg-foreground" : "bg-white")
                )} />
                <span className={cn(
                  "h-[1.5px] transition-all duration-500 ease-in-out",
                  isOpen ? "w-5 absolute top-1/2 rotate-45 bg-foreground" : cn("w-1", isLightNav ? "bg-foreground" : "bg-white")
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[55] bg-background transition-all duration-700 ease-in-out flex flex-col items-center justify-center overflow-y-auto px-6 py-20",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <nav className="w-full max-w-2xl text-center">
          <ul className="flex flex-col items-center gap-6 md:gap-8">
            {navLinks.map((link, i) => (
              <li 
                key={link.href}
                className={cn(
                  "transition-all duration-700",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter hover:text-primary transition-all duration-500 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
