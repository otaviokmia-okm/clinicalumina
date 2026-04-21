
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export function Services() {
  const SERVICES: Service[] = [
    {
      id: '1',
      name: 'Harmonização Facial',
      description: 'Protocolos minimamente invasivos para realçar seus traços com naturalidade clínica.',
      duration: '60 min',
      imageUrl: PlaceHolderImages.find(i => i.id === 'service-facial')?.imageUrl || 'https://picsum.photos/seed/facial-fallback/800/1000'
    },
    {
      id: '2',
      name: 'Bioestimuladores',
      description: 'Bio-regeneração profunda para firmeza e luminosidade celular duradoura.',
      duration: '45 min',
      imageUrl: PlaceHolderImages.find(i => i.id === 'service-bio')?.imageUrl || 'https://picsum.photos/seed/bio-fallback/800/1000'
    },
    {
      id: '3',
      name: 'Lasers de Elite',
      description: 'Tecnologia de precisão para rejuvenescimento e textura impecável da pele.',
      duration: '30 min',
      imageUrl: PlaceHolderImages.find(i => i.id === 'service-laser')?.imageUrl || 'https://picsum.photos/seed/laser-fallback/800/1000'
    },
    {
      id: '4',
      name: 'Arquitetura Facial',
      description: 'Protocolos avançados de mapeamento e restauração do equilíbrio facial.',
      duration: '90 min',
      imageUrl: PlaceHolderImages.find(i => i.id === 'service-spa')?.imageUrl || 'https://picsum.photos/seed/spa-fallback/800/1000'
    }
  ];

  return (
    <section id="services" className="py-32 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Nossos Tratamentos</span>
            <h2 className="text-5xl md:text-6xl font-headline">Serviços <span className="italic">Exclusivos</span></h2>
          </div>
          <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
            Curadoria de técnicas avançadas para resultados que transcendem o tempo, unindo ciência e arte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <Card key={service.id} className="group border-none bg-background overflow-hidden rounded-none shadow-none hover:shadow-2xl transition-all duration-700">
              <div className="relative h-[500px] overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  data-ai-hint="clinical aesthetic"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-all duration-700" />
              </div>
              <CardContent className="p-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-px w-6 bg-primary/40" />
                   <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">{service.duration}</span>
                </div>
                <h3 className="text-2xl font-headline leading-tight">{service.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-light">{service.description}</p>
                <div className="pt-4">
                   <a href="#booking" className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-primary/20 hover:border-primary transition-all inline-block pb-2">Agendar Experiência</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
