
"use client";

import { ShieldCheck, Sparkles, Clock, UserCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Tecnologia Segura',
    desc: 'Equipamentos de última geração aprovados pelas maiores agências mundiais.'
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Estética Minimalista',
    desc: 'Buscamos o equilíbrio realçando sua beleza sem excessos artificiais.'
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: 'Exclusividade de Tempo',
    desc: 'Agenda espaçada para garantir privacidade e atenção total do especialista.'
  },
  {
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    title: 'Cuidado Humanizado',
    desc: 'Um olhar integral sobre sua saúde, pele e bem-estar emocional.'
  }
];

export function About() {
  return (
    <section id="about" className="py-24 bg-white border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Nossos Diferenciais</span>
            <h2 className="text-4xl md:text-5xl font-headline leading-tight">Onde a <br /> Ciência Encontra <br /><span className="italic">a Arte da Estética</span></h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Na Lumina Aesthetics, acreditamos que a verdadeira beleza reside na harmonia. Nossa clínica foi concebida para ser um refúgio urbano onde cada detalhe, desde o aroma ambiente até a precisão técnica, é pensado para proporcionar uma jornada transformadora.
            </p>
            <div className="pt-4 border-l-2 border-primary pl-6">
              <p className="font-headline text-xl italic text-foreground/80">
                "Não criamos beleza. Nós a revelamos através da ciência e do cuidado."
              </p>
              <p className="text-xs uppercase tracking-widest mt-2 font-semibold">— Dra. Elena Lumina</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="space-y-4 p-8 bg-secondary/10 hover:bg-secondary/20 transition-colors">
                {f.icon}
                <h4 className="text-xl font-headline">{f.title}</h4>
                <p className="text-sm text-muted-foreground font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
