
"use client";

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-spa');

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with subtle parallax simulation */}
      <div 
        className="absolute inset-0 z-0 parallax-container opacity-40 brightness-75 scale-105"
        style={{ backgroundImage: `url(${heroImage?.imageUrl})` }}
        data-ai-hint="luxury spa"
      />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline leading-tight tracking-tight text-foreground/90">
          A Essência do <br />
          <span className="italic text-primary">Luxo Silencioso</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
          Descubra a harmonia perfeita entre tecnologia de ponta e o bem-estar absoluto em um ambiente de sofisticação inigualável.
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="h-14 px-10 text-lg tracking-widest uppercase bg-primary hover:bg-primary/90 rounded-none shadow-xl transition-all hover:translate-y-[-2px]">
            <a href="#booking">Agendar Experiência</a>
          </Button>
        </div>
      </div>
      
      {/* Aesthetic bottom shadow fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
}
