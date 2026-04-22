
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoData = PlaceHolderImages.find(img => img.id === 'main-logo');

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-md py-4 border-b border-primary/10 shadow-lg' 
        : 'bg-foreground/40 backdrop-blur-sm py-6 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="relative flex items-center group">
          <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full border border-primary/30 p-1 bg-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            {logoData && !logoError ? (
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image 
                  src={logoData.imageUrl} 
                  alt="Lumina Aesthetics Logo" 
                  fill 
                  className="object-cover"
                  priority
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <Sparkles className="h-4 w-4 text-primary mb-1" />
                <span className="font-headline text-[10px] md:text-xs tracking-[0.1em] leading-none uppercase text-white font-bold">Lumina</span>
              </div>
            )}
          </div>
          <div className="ml-4 hidden sm:flex flex-col">
            <span className="font-headline text-2xl tracking-[0.2em] uppercase text-white drop-shadow-md">Lumina</span>
            <span className="text-[7px] uppercase tracking-[0.5em] text-primary font-black">Aesthetics</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#services" className="text-[11px] uppercase tracking-[0.3em] font-black text-white hover:text-primary transition-colors drop-shadow-sm">Serviços</Link>
          <Link href="#about" className="text-[11px] uppercase tracking-[0.3em] font-black text-white hover:text-primary transition-colors drop-shadow-sm">O Conceito</Link>
          <Button asChild variant="outline" className="bg-primary/20 border-primary/50 text-white hover:bg-primary hover:text-primary-foreground rounded-none px-10 h-12 text-[10px] uppercase tracking-[0.3em] font-black transition-all backdrop-blur-md">
            <Link href="#booking">Agendar Visita</Link>
          </Button>
          <Link href="/admin/login" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-colors border-l pl-8 border-white/20">
            <Lock className="h-3 w-3" /> Concierge
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-7 w-7 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l-border/30 w-full sm:max-w-md">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu de Navegação</SheetTitle>
                <SheetDescription>Acesse as seções principais do site da Lumina Aesthetics</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full py-20 px-8 text-center space-y-12">
                <Link href="/" className="group flex flex-col items-center">
                   <div className="h-24 w-24 rounded-full border border-primary/20 p-1 mb-6">
                      <div className="h-full w-full rounded-full bg-secondary/20 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                   </div>
                  <span className="font-headline text-5xl tracking-[0.3em] uppercase block text-foreground">Lumina</span>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mt-2 block">Aesthetics</span>
                </Link>
                <div className="h-px w-12 bg-primary/20 mx-auto" />
                <nav className="flex flex-col gap-10">
                  <Link href="#services" className="text-2xl font-headline tracking-widest uppercase hover:text-primary transition-colors">Tratamentos</Link>
                  <Link href="#about" className="text-2xl font-headline tracking-widest uppercase hover:text-primary transition-colors">Manifesto</Link>
                  <Button asChild className="rounded-none h-16 uppercase tracking-[0.4em] text-[10px] bg-primary">
                    <Link href="#booking">Reservar Horário</Link>
                  </Button>
                </nav>
                <div className="mt-auto">
                  <Link href="/admin/login" className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    <Lock className="h-4 w-4" /> Acesso Restrito
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
