
"use client";

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-main')?.imageUrl || 'https://picsum.photos/seed/lumina-main/1920/1080';

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background with subtle scale effect */}
      <div 
        className="absolute inset-0 z-0 opacity-60 brightness-[0.7] scale-105 transition-transform duration-[20000ms] ease-out hover:scale-100"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        data-ai-hint="luxury aesthetic"
      />
      
      {/* Sophisticated Gradient Overlays */}
      <div className="absolute inset-0 z-5 bg-gradient-to-r from-background via-transparent to-transparent opacity-30" />
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-background/10 to-background" />
      
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto space-y-12">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.8em] text-primary font-bold">The Art of Pure Beauty</span>
            <div className="h-px w-12 bg-primary/40" />
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline leading-[0.85] tracking-tighter text-foreground drop-shadow-sm">
            Lumina <br />
            <span className="italic text-primary font-light">Aesthetics</span>
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          Onde a medicina de precisão encontra a estética de luxo para revelar sua melhor versão.
        </p>
        
        <div className="pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button asChild size="lg" className="h-16 px-16 text-[11px] tracking-[0.4em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-2xl transition-all hover:px-20 group">
            <a href="#booking">
              Agendar Experiência
            </a>
          </Button>
        </div>
      </div>
      
      {/* Decorative architectural lines */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-primary/10 hidden lg:block" />
      <div className="absolute right-12 top-0 bottom-0 w-px bg-primary/10 hidden lg:block" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-6 opacity-40">
        <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Scroll</span>
        <div className="h-16 w-px bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
