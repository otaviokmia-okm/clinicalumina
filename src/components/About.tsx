
"use client";

import { ShieldCheck, Sparkles, Clock, UserCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: 'TECNOLOGIA AVANÇADA',
    desc: 'Protocolos globais de segurança e precisão técnica.'
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: 'ESTÉTICA REFINADA',
    desc: 'Resultados naturais que preservam sua identidade.'
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: 'EXCLUSIVIDADE',
    desc: 'Atendimento com tempo dedicado e privacidade total.'
  },
  {
    icon: <UserCheck className="h-6 w-6 text-primary" />,
    title: 'CUIDADO INTEGRAL',
    desc: 'Foco na sua saúde, pele e equilíbrio emocional.'
  }
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5 space-y-8 md:space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Manifesto</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline leading-[1.1]">Onde a Ciência <br className="hidden md:block" />Encontra a <br className="hidden md:block" /><span className="italic text-primary">Obra de Arte</span></h2>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Na Lumina, não seguimos tendências passageiras. Criamos jornadas de transformação baseadas na harmonia e na longevidade, em um refúgio desenhado para os sentidos.
            </p>

            <div className="pt-8 md:pt-10 border-t border-border">
              <p className="font-headline text-xl md:text-2xl italic text-foreground/70 leading-relaxed">
                "Beleza não é sobre mudar quem você é, mas sobre revelar sua luz mais pura."
              </p>
              <div className="flex items-center gap-4 mt-6 md:mt-8">
                 <div className="h-px w-10 md:w-12 bg-primary" />
                 <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold">Dra. Elena Lumina</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-8 md:p-12 bg-secondary/20 border border-transparent hover:border-primary/10 transition-all duration-700">
                <div className="mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold mb-3 md:mb-4">{f.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
