
"use client";

import Link from 'next/link';
import { Sparkles, Menu, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary text-primary-foreground rounded-sm transition-transform group-hover:rotate-12">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-headline text-2xl tracking-wide uppercase">Lumina</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="#services" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">Serviços</Link>
          <Link href="#about" className="text-sm uppercase tracking-widest hover:text-primary transition-colors">Diferenciais</Link>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="#booking">Agendar Experiência</Link>
          </Button>
          <Link href="/admin/login" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-l pl-6 border-border">
            <Lock className="h-3 w-3" /> Acesso Restrito
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <div className="flex flex-col gap-8 mt-12">
                <Link href="/" className="text-xl font-headline tracking-widest">Início</Link>
                <Link href="#services" className="text-xl font-headline tracking-widest">Serviços</Link>
                <Link href="#about" className="text-xl font-headline tracking-widest">Diferenciais</Link>
                <Link href="#booking" className="text-xl font-headline tracking-widest">Agendar</Link>
                <div className="mt-auto pt-8 border-t">
                  <Link href="/admin/login" className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                    <Lock className="h-4 w-4" /> Acesso Administrativo
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
