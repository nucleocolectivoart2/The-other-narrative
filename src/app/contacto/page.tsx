
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Send, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const phoneNumber = "573162809797";
  const waMessage = encodeURIComponent("Hola Ángela, vi tu bitácora y me gustaría conversar sobre sostenibilidad y comunicación.");
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
      <section className="relative h-[60vh] w-full flex items-end pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={image?.imageUrl || 'https://images.pexels.com/photos/2635817/pexels-photo-2635817.jpeg'}
            alt="Contacto Header"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[10px] mb-8 block animate-in slide-in-from-bottom-4 duration-700">Contacto</span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-8 tracking-tighter text-white">
              Conversemos.
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-2xl">
              Si tu organización necesita fortalecer su narrativa, conectar mejor con sus grupos de interés o transformar conocimiento en productos de alto valor, estaremos encantados de conversar.
            </p>
          </div>
        </div>
      </section>

      <div className="section-container py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold font-headline tracking-tighter">Canales Directos</h2>
              <p className="text-foreground/60 font-light leading-relaxed text-lg">
                Si buscas un acompañamiento técnico y honesto para construir comunicación con propósito, estaré encantada de escucharte.
              </p>
            </div>

            <div className="space-y-6">
              <a href="mailto:angelamgomez@gmail.com" className="group flex items-center justify-between p-10 border border-border/50 hover:border-primary transition-all duration-500 bg-white shadow-sm">
                <div className="flex items-center gap-6">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Email</span>
                </div>
                <span className="text-xs font-medium opacity-40 group-hover:opacity-100 transition-opacity">angelamgomez@gmail.com</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-10 border border-border/50 hover:border-primary transition-all duration-500 bg-white shadow-sm">
                <div className="flex items-center gap-6">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">WhatsApp</span>
                </div>
                <span className="text-xs font-medium opacity-40 group-hover:opacity-100 transition-opacity">+57 316 2809797</span>
              </a>
              <a href="https://www.linkedin.com/in/angelamgomezd" target="_blank" className="group flex items-center justify-between p-10 border border-border/50 hover:border-primary transition-all duration-500 bg-white shadow-sm">
                <div className="flex items-center gap-6">
                  <Linkedin className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">LinkedIn</span>
                </div>
                <span className="text-xs font-medium opacity-40 group-hover:opacity-100 transition-opacity">Ver Perfil</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="bg-white p-24 border border-border/50 rounded-sm text-center space-y-8 shadow-xl animate-in zoom-in duration-700">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-3xl font-bold font-headline tracking-tighter">Mensaje Enviado</h3>
                <p className="text-foreground/60 font-light leading-relaxed">
                  Gracias por iniciar esta conversación. Estaremos en contacto pronto para habitar juntos la verdad de tu organización.
                </p>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="btn-editorial h-12">Enviar otro mensaje</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-12 border border-border/50 rounded-sm space-y-10 shadow-xl animate-in slide-in-from-right-12 duration-1000">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Nombre</Label>
                    <Input 
                      id="nombre" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre..." 
                      className="rounded-sm border-border h-12 bg-background/30 focus:bg-white transition-all text-sm" 
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="ejemplo@dominio.com" 
                      className="rounded-sm border-border h-12 bg-background/30 focus:bg-white transition-all text-sm" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="mensaje" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Mensaje</Label>
                  <Textarea 
                    id="mensaje" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="¿Cómo puedo ayudarte?" 
                    rows={6} 
                    className="rounded-sm border-border bg-background/30 focus:bg-white transition-all resize-none text-sm" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-editorial btn-editorial-primary w-full h-12 bg-secondary text-white hover:bg-primary border-0 rounded-sm"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <>Enviar Mensaje <Send className="ml-4 h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="flex justify-center py-32 border-t mt-32">
          <Link href="/" className="btn-editorial btn-editorial-outline group">
            <ArrowLeft className="mr-4 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
