
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Lock } from 'lucide-react';
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

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoImage = PlaceHolderImages.find(img => img.id === 'main-logo')?.imageUrl;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-md py-4 border-b' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="relative h-12 w-48 transition-transform hover:scale-105">
          {logoImage ? (
            <Image 
              src={logoImage} 
              alt="Lumina Aesthetics Logo" 
              fill 
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-headline text-3xl tracking-[0.2em] uppercase">Lumina</span>
              <span className="text-[8px] uppercase tracking-[0.5em] text-muted-foreground font-bold">Aesthetics</span>
            </div>
          )}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="#services" className="text-[10px] uppercase tracking-[0.3em] font-semibold hover:text-primary transition-colors">Serviços</Link>
          <Link href="#about" className="text-[10px] uppercase tracking-[0.3em] font-semibold hover:text-primary transition-colors">O Conceito</Link>
          <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-8 text-[10px] uppercase tracking-[0.2em]">
            <Link href="#booking">Agendar Visita</Link>
          </Button>
          <Link href="/admin/login" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors border-l pl-8 border-border">
            <Lock className="h-3 w-3" /> Acesso
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l-border">
                <div className="flex flex-col gap-10 mt-16 text-center">
                  <Link href="/" className="text-2xl font-headline tracking-widest uppercase">Início</Link>
                  <Link href="#services" className="text-2xl font-headline tracking-widest uppercase">Serviços</Link>
                  <Link href="#about" className="text-2xl font-headline tracking-widest uppercase">O Conceito</Link>
                  <Button asChild className="rounded-none h-14 uppercase tracking-widest">
                    <Link href="#booking">Agendar Agora</Link>
                  </Button>
                  <div className="mt-auto pb-8">
                    <Link href="/admin/login" className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Lock className="h-4 w-4" /> Concierge Login
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
