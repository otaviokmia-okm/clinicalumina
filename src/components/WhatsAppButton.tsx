
"use client";

import { Phone } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl animate-pulse-slow hover:scale-110 transition-transform active:scale-95"
      aria-label="Contact via WhatsApp"
    >
      <Phone className="h-7 w-7 fill-current" />
    </a>
  );
}
