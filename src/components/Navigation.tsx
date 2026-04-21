
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
        : 'bg-foreground/20 backdrop-blur-sm py-6 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="relative flex items-center group">
          {logoData && !logoError ? (
            <div className="relative h-14 w-56 transition-transform group-hover:scale-105">
              <Image 
                src={logoData.imageUrl} 
                alt="Lumina Aesthetics Logo" 
                fill 
                className="object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center transition-transform group-hover:scale-105">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-headline text-3xl tracking-[0.25em] uppercase text-white">Lumina</span>
              </div>
              <span className="text-[8px] uppercase tracking-[0.6em] text-primary mt-1 font-bold ml-4">Aesthetics</span>
            </div>
          )}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="#services" className="text-[11px] uppercase tracking-[0.3em] font-black text-white hover:text-primary transition-colors drop-shadow-sm">Serviços</Link>
          <Link href="#about" className="text-[11px] uppercase tracking-[0.3em] font-black text-white hover:text-primary transition-colors drop-shadow-sm">O Conceito</Link>
          <Button asChild variant="outline" className="bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-10 h-12 text-[10px] uppercase tracking-[0.3em] font-black transition-all">
            <Link href="#booking">Agendar Visita</Link>
          </Button>
          <Link href="/admin/login" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-colors border-l pl-8 border-white/20">
            <Lock className="h-3 w-3" /> Concierge
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-7 w-7 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l-border/30 w-full sm:max-w-md">
              <div className="flex flex-col h-full py-20 px-8 text-center space-y-12">
                <Link href="/" className="group">
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
