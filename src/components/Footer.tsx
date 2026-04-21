"use client";

import { Sparkles, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-32">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="space-y-8">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-headline text-3xl tracking-[0.2em] uppercase text-background">Lumina</span>
            </div>
            <span className="text-[8px] uppercase tracking-[0.5em] text-primary mt-1 font-bold">Aesthetics</span>
          </Link>
          <p className="text-sm text-muted-foreground/60 leading-relaxed font-light italic">
            "A essência do luxo reside no silêncio, na precisão e no cuidado impecável."
          </p>
          <div className="flex gap-6">
            <Instagram className="h-5 w-5 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
            <Facebook className="h-5 w-5 cursor-pointer hover:text-primary transition-colors text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Navegação</h4>
          <ul className="space-y-5 text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
            <li><Link href="#services" className="hover:text-background transition-colors">Tratamentos</Link></li>
            <li><Link href="#about" className="hover:text-background transition-colors">O Conceito</Link></li>
            <li><Link href="#booking" className="hover:text-background transition-colors">Agendamento</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Atendimento</h4>
          <ul className="space-y-5 text-[11px] font-medium tracking-widest text-muted-foreground/60">
            <li>Jardins, São Paulo - Brasil</li>
            <li>concierge@luminaestetica.com.br</li>
            <li>+81 090 5452 1904 (Global)</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Privilégios</h4>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">Inscreva-se para receber convites e insights exclusivos.</p>
          <div className="flex gap-4 border-b border-primary/20 pb-4">
            <input type="email" placeholder="EMAIL" className="bg-transparent border-none outline-none text-[10px] w-full tracking-widest" />
            <button className="text-primary text-[10px] uppercase font-bold tracking-widest">Enviar</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30">
          © 2024 Lumina Aesthetics — Onde a Arte Encontra a Ciência.
        </p>
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] text-muted-foreground/30">
           <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
           <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
