
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Send, ArrowLeft, Loader2, CheckCircle2, MessageCircle, Sparkles, ArrowUpRight, User, BookOpen, Quote, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const image = PlaceHolderImages.find(img => img.id === 'contacto-bg');
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const phoneNumber = "573162809797";
  const waMessage = encodeURIComponent("Hola Ángela, vi tu bitácora y me gustaría conversar sobre regeneración y comunicación.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ variant: "destructive", title: "Error", description: "Todos los campos son obligatorios." });
      return;
    }

    setIsSubmitting(true);
    
    try {
      addDocumentNonBlocking(collection(firestore, 'messages'), {
        ...formData,
        read: false,
        createdAt: serverTimestamp()
      });
      
      setIsSubmitted(true);
      toast({ title: "Mensaje enviado", description: "Gracias por contactarnos. Te responderemos pronto." });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo enviar el mensaje." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Hero Section */}
      <section className="relative h-[55vh] md:h-[60vh] w-full flex items-end pb-20 md:pb-24 overflow-hidden border-b bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={image?.imageUrl || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_06%20contacto.png'}
            alt="Contacto Header"
            fill
            className="object-cover opacity-95 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-foreground">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[10px] mb-6 block animate-in slide-in-from-bottom-4 duration-700">
            Diálogos & Conexión
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 tracking-tighter text-foreground">
              Conversemos.
            </h1>
            <p className="text-xl md:text-2xl font-light text-foreground/80 leading-relaxed max-w-2xl">
              Si tu organización necesita fortalecer su narrativa, conectar mejor con sus grupos de interés o transformar conocimiento en productos de alto valor, estaremos encantados de conversar.
            </p>
          </div>
        </div>
      </section>

      {/* Banner Editorial Perfil Ángela Gómez Duque - Diseño Panorámico y Alta Legibilidad */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[620px] relative">
            {/* Background Image Layer for Wide Viewports */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
              <Image
                src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/perfil.png"
                alt="Ángela María Gómez Duque - Dirección Editorial y Estrategia Narrativa"
                fill
                className="object-cover object-[92%_center] lg:object-[95%_center] xl:object-right"
                priority
              />
              {/* Solid high-contrast white backing on the left 52%, feathering smoothly toward the photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white via-50% md:via-white/95 md:via-58% to-transparent md:w-[75%] lg:w-[65%]" />
            </div>

            {/* Mobile Image Layer */}
            <div className="relative h-80 w-full md:hidden z-0 overflow-hidden bg-zinc-100">
              <Image
                src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/perfil.png"
                alt="Ángela María Gómez Duque"
                fill
                className="object-cover object-[80%_top]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
            </div>

            {/* Left Content Area - Editorial Text */}
            <div className="relative z-10 lg:col-span-6 xl:col-span-6 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between space-y-8 bg-white/95 md:bg-transparent">
              <div className="space-y-6 max-w-xl">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.25em]">
                  <Sparkles className="h-3 w-3" />
                  <span>Dirección Editorial & Estrategia Narrativa</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold font-headline tracking-tighter text-foreground leading-[1.08]">
                    Ángela María Gómez Duque
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-primary tracking-wider uppercase">
                    Comunicación Estratégica · Redes de Aprendizaje · Regeneración & Impacto
                  </p>
                </div>

                <blockquote className="border-l-2 border-primary/70 pl-5 my-3 text-base sm:text-lg italic text-foreground/90 leading-relaxed font-serif bg-primary/[0.03] py-2.5 pr-4 rounded-r-sm">
                  &ldquo;La comunicación no es solo transmitir información: es crear el tejido donde las organizaciones, las personas y los territorios se reconocen para transformar realidades.&rdquo;
                </blockquote>

                <p className="text-sm sm:text-base font-light text-foreground/80 leading-relaxed">
                  Acompaño a organizaciones, colectivos y líderes a articular historias honestas, trascendentes y conectadas con la verdad de sus proyectos. Te invito a abrir un espacio de diálogo para explorar cómo tejer juntos narrativas que inspiren a la acción.
                </p>
              </div>

              {/* Action Links & Direct Triggers */}
              <div className="pt-4 border-t border-border/50 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-foreground text-background hover:bg-foreground/90 text-xs font-bold uppercase tracking-wider transition-all shadow-md group cursor-pointer"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span>Quién soy</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md group"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Conversar con Ángela</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="mailto:angelamgomez@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border/80 bg-white hover:border-primary text-foreground text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Escribir Correo</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/angelamgomezd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm border border-border/60 hover:border-primary bg-white text-foreground/80 hover:text-foreground text-xs font-medium transition-all"
                >
                  <Linkedin className="h-4 w-4 text-primary" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Editorial: Quién soy */}
        <Dialog open={isAboutModalOpen} onOpenChange={setIsAboutModalOpen}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl max-h-[92vh] flex flex-col">
            {/* Banner Visual Superior con Arte Editorial */}
            <div className="relative w-full h-44 sm:h-60 md:h-64 bg-zinc-950 flex-shrink-0 overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/logo-13.png"
                alt="Quién soy - The Other Narrative"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/40 pointer-events-none" />
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/95 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/15 shadow-sm">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Manifiesto & Trayectoria
                </span>
              </div>
            </div>

            {/* Contenido Editorial con Scroll Fluido */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-foreground">
              <div className="space-y-2 border-b border-border/60 pb-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">
                  Quién soy
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                  Ángela María Gómez Duque · Dirección Editorial & Estrategia Narrativa
                </p>
              </div>

              <div className="space-y-5 text-sm sm:text-base leading-relaxed text-foreground/85 font-light">
                <p className="text-base sm:text-lg text-foreground font-normal leading-relaxed">
                  Soy una mujer curiosa, creadora y profundamente inquieta. Me gusta hacer preguntas, conectar mundos que normalmente no conversan y encontrar maneras diferentes de hacer las cosas.
                </p>

                {/* Destacado Editorial */}
                <div className="my-5 p-5 sm:p-6 rounded-lg bg-primary/5 border-l-4 border-primary shadow-xs">
                  <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-foreground font-medium leading-snug">
                    &ldquo;No me interesa copiar modelos. Me interesa crearlos.&rdquo;
                  </p>
                </div>

                <p>
                  Soy comunicadora y estratega, y durante mi carrera he convertido ideas en áreas, estrategias, plataformas, contenidos y comunidades alrededor de la comunicación, la innovación social, la economía circular y la regeneración.
                </p>

                <p>
                  He trabajado en escenarios complejos —desde la construcción de paz hasta los desafíos empresariales y ambientales— y eso me ha enseñado que transformar también implica cambiar las historias que contamos y la manera como las contamos.
                </p>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <p className="text-foreground/90 font-medium">
                    Hoy sigo creando, investigando, enseñando y haciendo preguntas.
                  </p>
                  <p className="text-base sm:text-lg text-primary font-headline font-semibold italic">
                    Porque creo que otras narrativas pueden abrir otras posibilidades.
                  </p>
                </div>
              </div>

              {/* Botones de Acción dentro del Modal */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Conversar por WhatsApp</span>
                  </a>
                  <a
                    href="mailto:angelamgomez@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-border bg-background hover:border-primary text-foreground text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Escribir Correo</span>
                  </a>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAboutModalOpen(false)}
                  className="text-xs uppercase font-medium tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Canales Directos y Formulario de Contacto */}
      <div className="section-container pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Columna Izquierda: Canales Directos */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block">
                Atención Personalizada
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                Canales Directos
              </h2>
              <p className="text-foreground/75 font-light leading-relaxed text-base md:text-lg">
                Si buscas un acompañamiento técnico y honesto para construir comunicación con propósito, estaré encantada de escucharte.
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="mailto:angelamgomez@gmail.com" 
                className="group flex items-center justify-between p-6 sm:p-7 border border-border/60 hover:border-primary hover:shadow-md transition-all duration-300 bg-white rounded-sm shadow-xs"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50 block">Correo Electrónico</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">angelamgomez@gmail.com</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center justify-between p-6 sm:p-7 border border-border/60 hover:border-primary hover:shadow-md transition-all duration-300 bg-white rounded-sm shadow-xs"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50 block">WhatsApp Directo</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">+57 316 280 9797</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>

              <a 
                href="https://www.linkedin.com/in/angelamgomezd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center justify-between p-6 sm:p-7 border border-border/60 hover:border-primary hover:shadow-md transition-all duration-300 bg-white rounded-sm shadow-xs"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50 block">Red Profesional</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">LinkedIn / Ángela Gómez</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="bg-white p-12 md:p-16 border border-border/60 rounded-sm text-center space-y-6 shadow-xl animate-in zoom-in duration-700">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-3xl font-bold font-headline tracking-tighter">Mensaje Enviado con Éxito</h3>
                <p className="text-foreground/70 font-light leading-relaxed max-w-md mx-auto">
                  Gracias por iniciar esta conversación. Leeremos tu mensaje y te responderemos a la mayor brevedad para habitar juntos la narrativa de tu proyecto.
                </p>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="btn-editorial h-12 mt-4">
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 border border-border/60 rounded-sm space-y-8 shadow-xl animate-in slide-in-from-right-12 duration-1000">
                <div className="space-y-2 border-b border-border/40 pb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary block">Buzón de Ideas & Proyectos</span>
                  <h3 className="text-2xl font-bold font-headline tracking-tight">Envíanos un mensaje</h3>
                  <p className="text-xs text-foreground/60">Cuéntanos sobre tu iniciativa, territorio u objetivo de comunicación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                      Nombre Completo *
                    </Label>
                    <Input 
                      id="nombre" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre o el de tu organización..." 
                      className="rounded-sm border-border h-12 bg-background/30 focus:bg-white transition-all text-sm" 
                      required 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                      Correo Electrónico *
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="ejemplo@organizacion.org" 
                      className="rounded-sm border-border h-12 bg-background/30 focus:bg-white transition-all text-sm" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="mensaje" className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                    Mensaje / Desafío Narrativo *
                  </Label>
                  <Textarea 
                    id="mensaje" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="¿En qué consiste tu proyecto y cómo podemos colaborar?" 
                    rows={5} 
                    className="rounded-sm border-border bg-background/30 focus:bg-white transition-all resize-none text-sm" 
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-editorial btn-editorial-primary w-full h-12 bg-primary text-white hover:bg-primary/90 border-0 rounded-sm font-bold text-xs uppercase tracking-widest transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" /> Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Enviar Mensaje <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation Back to Home */}
      <div className="section-container pb-20">
        <div className="flex justify-center pt-12 border-t border-border/50">
          <Link href="/" className="btn-editorial btn-editorial-outline group inline-flex items-center gap-4">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
