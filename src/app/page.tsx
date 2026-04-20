
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { BookingWidget } from '@/components/BookingWidget';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <BookingWidget />
      <Footer />
      
      {/* Interaction Elements */}
      <WhatsAppButton />
      <Toaster />
    </main>
  );
}
