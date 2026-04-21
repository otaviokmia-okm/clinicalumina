
"use client";

import { Sparkles, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-headline text-3xl tracking-widest uppercase">Lumina</span>
          </Link>
          <p className="text-sm text-muted-foreground/60 leading-relaxed font-light">
            Especialistas em beleza autêntica e longevidade. O refúgio perfeito para quem busca resultados excepcionais em um ambiente exclusivo.
          </p>
          <div className="flex gap-4">
            <Instagram className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
            <Facebook className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-widest font-bold text-primary">Navegação</h4>
          <ul className="space-y-4 text-sm font-light text-muted-foreground/60">
            <li><Link href="#services" className="hover:text-background transition-colors">Tratamentos</Link></li>
            <li><Link href="#about" className="hover:text-background transition-colors">A Clínica</Link></li>
            <li><Link href="#booking" className="hover:text-background transition-colors">Agendamento</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-widest font-bold text-primary">Contato</h4>
          <ul className="space-y-4 text-sm font-light text-muted-foreground/60">
            <li>Rua da Elegância, 1000 - Jardins, SP</li>
            <li>contato@luminaestetica.com.br</li>
            <li>+81 090 5452 1904</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-widest font-bold text-primary">Newsletter</h4>
          <p className="text-xs text-muted-foreground/60">Receba insights sobre beleza e bem-estar.</p>
          <div className="flex gap-2 border-b border-primary/20 pb-2">
            <input type="email" placeholder="Seu melhor e-mail" className="bg-transparent border-none outline-none text-xs w-full" />
            <button className="text-primary text-xs uppercase font-bold tracking-widest">OK</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-white/5 text-[10px] text-center uppercase tracking-[0.3em] text-muted-foreground/40">
        © 2024 Lumina Aesthetics — All rights reserved.
      </div>
    </footer>
  );
}
