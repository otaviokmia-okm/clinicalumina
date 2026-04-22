
"use client";

import { Sparkles, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        <div className="space-y-6">
          <div className="flex flex-col group">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-headline text-2xl tracking-[0.2em] uppercase text-background">Lumina</span>
            </div>
            <span className="text-[8px] uppercase tracking-[0.5em] text-primary mt-1 font-bold">Aesthetics</span>
          </div>
          <p className="text-[11px] md:text-[12px] text-muted-foreground/60 leading-relaxed font-light italic max-w-xs">
            "A essência do luxo reside no silêncio, na precisão e no cuidado impecável."
          </p>
          <div className="flex gap-6">
            <Instagram className="h-4 w-4 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
            <Facebook className="h-4 w-4 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Navegação</h4>
          <ul className="space-y-2 md:space-y-3 text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
            <li><Link href="#services" className="hover:text-background transition-colors">Tratamentos</Link></li>
            <li><Link href="#about" className="hover:text-background transition-colors">O Conceito</Link></li>
            <li><Link href="#booking" className="hover:text-background transition-colors">Agendamento</Link></li>
          </ul>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Atendimento</h4>
          <ul className="space-y-2 md:space-y-3 text-[9px] md:text-[10px] font-medium tracking-widest text-muted-foreground/60">
            <li>Jardins, São Paulo - Brasil</li>
            <li>concierge@luminaestetica.com.br</li>
            <li>+81 090 5452 1904 (Global)</li>
          </ul>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Privilégios</h4>
          <p className="text-[9px] md:text-[10px] text-muted-foreground/60 leading-relaxed">Inscreva-se para receber insights exclusivos.</p>
          <div className="flex gap-4 border-b border-primary/20 pb-2 max-w-xs">
            <input type="email" placeholder="EMAIL" className="bg-transparent border-none outline-none text-[10px] w-full tracking-widest" />
            <button className="text-primary text-[10px] uppercase font-bold tracking-widest">OK</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-10 mt-10 md:mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground/30 text-center md:text-left">
          © 2024 Lumina Aesthetics — Onde a Arte Encontra a Ciência.
        </p>
        <div className="flex gap-6 md:gap-8 text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-muted-foreground/30">
           <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
           <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
