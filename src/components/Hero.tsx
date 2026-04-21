"use client";

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-spa')?.imageUrl || 'https://picsum.photos/seed/lumina-hero/1920/1080';

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background with subtle parallax simulation */}
      <div 
        className="absolute inset-0 z-0 opacity-50 brightness-[0.6] scale-110 transition-transform duration-[10000ms] ease-out hover:scale-100"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        data-ai-hint="luxury spa"
      />
      
      {/* Golden Overlay Gradient */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-background/10 to-background" />
      
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold">O Refúgio da Beleza Autêntica</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline leading-[0.9] tracking-tighter text-foreground drop-shadow-sm">
            Harmonia <br />
            <span className="italic text-primary font-light">Atemporal</span>
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          Experiências personalizadas em um ambiente de sofisticação inigualável, onde a ciência encontra a arte do bem-estar.
        </p>
        
        <div className="pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button asChild size="lg" className="h-16 px-12 text-[12px] tracking-[0.3em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-2xl transition-all hover:px-16">
            <a href="#booking">Descobrir Lumina</a>
          </Button>
        </div>
      </div>
      
      {/* Decorative vertical lines */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-primary/10 hidden lg:block" />
      <div className="absolute right-10 top-0 bottom-0 w-px bg-primary/10 hidden lg:block" />
    </section>
  );
}
