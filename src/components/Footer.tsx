
"use client";

import { Sparkles, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex flex-col group">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-headline text-xl tracking-[0.2em] uppercase text-background">Lumina</span>
            </div>
            <span className="text-[7px] uppercase tracking-[0.5em] text-primary mt-1 font-bold">Aesthetics</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-light italic max-w-xs">
            "A essência do luxo reside no silêncio, na precisão e no cuidado impecável."
          </p>
          <div className="flex gap-4">
            <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
            <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[8px] uppercase tracking-[0.3em] font-bold text-primary">Navegação</h4>
          <ul className="space-y-2 text-[8px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
            <li><Link href="#services" className="hover:text-background transition-colors">Tratamentos</Link></li>
            <li><Link href="#about" className="hover:text-background transition-colors">O Conceito</Link></li>
            <li><Link href="#booking" className="hover:text-background transition-colors">Agendamento</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[8px] uppercase tracking-[0.3em] font-bold text-primary">Atendimento</h4>
          <ul className="space-y-2 text-[8px] font-medium tracking-widest text-muted-foreground/60">
            <li>Jardins, São Paulo - Brasil</li>
            <li>concierge@luminaestetica.com.br</li>
            <li>+81 090 5452 1904 (Global)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[8px] uppercase tracking-[0.3em] font-bold text-primary">Insights</h4>
          <p className="text-[8px] text-muted-foreground/60 leading-relaxed">Assine para receber convites exclusivos.</p>
          <div className="flex gap-4 border-b border-primary/20 pb-1 max-w-xs">
            <input type="email" placeholder="EMAIL" className="bg-transparent border-none outline-none text-[9px] w-full tracking-widest text-background" />
            <button className="text-primary text-[9px] uppercase font-bold tracking-widest">OK</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6 mt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[6px] md:text-[7px] uppercase tracking-[0.3em] text-muted-foreground/30">
          © 2024 Lumina Aesthetics — Onde a Arte Encontra a Ciência.
        </p>
        <div className="flex gap-4 text-[6px] md:text-[7px] uppercase tracking-[0.3em] text-muted-foreground/30">
           <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
           <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
