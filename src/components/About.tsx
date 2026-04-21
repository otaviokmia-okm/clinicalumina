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
    <section id="about" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Manifesto</span>
              <h2 className="text-5xl md:text-6xl font-headline leading-[1.1]">Onde a Ciência <br />Encontra a <br /><span className="italic text-primary">Obra de Arte</span></h2>
            </div>
            
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Na Lumina, não seguimos tendências passageiras. Criamos jornadas de transformação baseadas na harmonia e na longevidade, em um refúgio desenhado para os sentidos.
            </p>

            <div className="pt-10 border-t border-border">
              <p className="font-headline text-2xl italic text-foreground/70 leading-relaxed">
                "Beleza não é sobre mudar quem você é, mas sobre revelar sua luz mais pura."
              </p>
              <div className="flex items-center gap-4 mt-8">
                 <div className="h-px w-12 bg-primary" />
                 <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Dra. Elena Lumina</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-12 bg-secondary/20 border border-transparent hover:border-primary/10 transition-all duration-700">
                <div className="mb-8 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-4">{f.title}</h4>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
