
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Harmonização Facial',
    description: 'Realce sua beleza natural com protocolos exclusivos e minimamente invasivos.',
    duration: '60 min',
    imageUrl: PlaceHolderImages.find(i => i.id === 'service-facial')?.imageUrl || ''
  },
  {
    id: '2',
    name: 'Bioestimuladores',
    description: 'Tratamentos regenerativos para uma pele firme, luminosa e jovial de dentro para fora.',
    duration: '45 min',
    imageUrl: PlaceHolderImages.find(i => i.id === 'service-bio')?.imageUrl || ''
  },
  {
    id: '3',
    name: 'Tecnologias de Laser',
    description: 'O que há de mais moderno no mundo para rejuvenescimento e textura da pele.',
    duration: '30 min',
    imageUrl: PlaceHolderImages.find(i => i.id === 'service-laser')?.imageUrl || ''
  },
  {
    id: '4',
    name: 'Protocolos de SPA',
    description: 'Experiências sensoriais completas para relaxamento profundo e renovação celular.',
    duration: '90 min',
    imageUrl: PlaceHolderImages.find(i => i.id === 'service-spa')?.imageUrl || ''
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline">Nossos Serviços</h2>
          <div className="w-12 h-1 bg-primary mx-auto" />
          <p className="text-muted-foreground max-w-xl mx-auto">Excelência técnica em cada detalhe, desenhada para superar as expectativas mais exigentes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <Card key={service.id} className="group border-none bg-secondary/30 overflow-hidden shadow-none hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint="beauty service"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <CardContent className="p-8 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">{service.duration}</span>
                <h3 className="text-2xl font-headline group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-light">{service.description}</p>
                <div className="pt-4">
                   <a href="#booking" className="text-xs uppercase tracking-widest font-semibold border-b border-primary/20 hover:border-primary transition-colors inline-block pb-1">Agendar</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
