"use client";

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Phone, Mail, CheckCircle2, Loader2, CalendarX2, MessageCircle, Sparkles } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFirestore, useAuth, addDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function BookingWidget() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    setDate(new Date());
  }, []);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !date) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    return query(
      collection(db, 'appointments'),
      where('date', '==', dateStr)
    );
  }, [db, date]);

  const { data: existingAppts, isLoading: isLoadingAppts } = useCollection<Appointment>(appointmentsQuery);

  const busySlots = existingAppts
    ?.filter(appt => appt.status === 'Confirmado' || appt.status === 'Remarcado')
    .map(appt => appt.timeSlot) || [];

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!date || !slot) {
      toast({
        variant: 'destructive',
        title: 'Seleção Incompleta',
        description: 'Por favor, selecione uma data e um horário disponível.'
      });
      return;
    }

    setLoading(true);

    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      const formData = new FormData(formElement);
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      
      const appointmentData = {
        clientName: name,
        clientPhone: phone,
        clientEmail: formData.get('email') as string,
        serviceId: '1',
        serviceName: 'Harmonização Facial',
        date: format(date, 'yyyy-MM-dd'),
        timeSlot: slot,
        status: 'Pendente' as const,
        clientId: auth.currentUser?.uid || 'guest',
        createdAt: new Date().toISOString()
      };

      const appointmentsRef = collection(db, 'appointments');
      addDocumentNonBlocking(appointmentsRef, appointmentData);

      setBookingDetails(appointmentData);
      setIsSuccess(true);
      toast({
        title: 'Solicitação Enviada',
        description: 'Recebemos seu pedido. Em breve entraremos em contato.'
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro no Agendamento',
        description: 'Não foi possível salvar seu agendamento.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return startOfDay(date) < today || date.getDay() === 0;
  };

  const getWhatsAppLink = () => {
    if (!bookingDetails) return '#';
    const message = `Olá! Acabei de solicitar um agendamento na Lumina Aesthetics.%0A%0A*Detalhes:*%0A👤 Nome: ${bookingDetails.clientName}%0A📅 Data: ${format(new Date(bookingDetails.date + 'T12:00:00'), "dd/MM/yyyy")}%0A⏰ Horário: ${bookingDetails.timeSlot}%0A✨ Serviço: ${bookingDetails.serviceName}%0A%0AAguardo a confirmação do concierge!`;
    return `https://wa.me/8109054521904?text=${message}`;
  };

  if (isSuccess) {
    return (
      <div className="bg-background p-16 text-center border-2 border-primary/10 animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto my-32 shadow-2xl">
        <div className="mx-auto w-20 h-20 bg-primary/10 flex items-center justify-center rounded-full mb-8">
           <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-4xl font-headline mb-6">Sua Visita Aguarda</h3>
        <p className="text-muted-foreground mb-12 max-w-md mx-auto font-light leading-relaxed">
          Sua solicitação para {bookingDetails && format(new Date(bookingDetails.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })} foi registrada. Nosso concierge entrará em contato em breve.
        </p>
        
        <div className="space-y-6">
          <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-16 rounded-none uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Contatar Concierge via WhatsApp
            </a>
          </Button>
          <Button onClick={() => setIsSuccess(false)} variant="ghost" className="uppercase text-[9px] tracking-[0.3em] font-bold text-muted-foreground hover:text-primary">Novo Agendamento</Button>
        </div>
      </div>
    );
  }

  return (
    <section id="booking" className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-8">
        {/* Intro Text - Now on top */}
        <div className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Reservas</span>
            <h2 className="text-5xl md:text-6xl font-headline leading-tight">Agende sua <br /><span className="text-primary italic">Experiência Lumina</span></h2>
          </div>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Escolha o momento ideal para sua transformação. Cada visita é planejada com exclusividade para atender seus desejos.
          </p>
        </div>

        <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-8 md:p-16 shadow-2xl border border-border/40">
          {/* Column 1: Calendar */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">1</span>
              <Label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Escolha uma Data</Label>
            </div>
            <div className="p-4 bg-secondary/10 border border-primary/5 shadow-inner">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setSlot('');
                }}
                className="w-full"
                locale={ptBR}
                disabled={isDateDisabled}
              />
            </div>
          </div>

          {/* Column 2: Slots & Form */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">2</span>
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Horários do Dia</Label>
                </div>
                {isLoadingAppts && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </div>
              
              <RadioGroup value={slot} onValueChange={setSlot} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TIME_SLOTS.map((time) => {
                  const isBusy = busySlots.includes(time);
                  return (
                    <div key={time} className="relative">
                      <RadioGroupItem 
                        value={time} 
                        id={time} 
                        disabled={isBusy}
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor={time}
                        className={cn(
                          "flex items-center justify-center p-4 text-[11px] font-bold tracking-widest border border-border transition-all duration-300 rounded-none",
                          isBusy 
                            ? "bg-muted text-muted-foreground/40 cursor-not-allowed border-dashed opacity-50" 
                            : "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer"
                        )}
                      >
                        {isBusy ? <CalendarX2 className="h-3 w-3 mr-2 opacity-50" /> : null}
                        {time}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="space-y-8 pt-8 border-t border-border/40">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">3</span>
                <Label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Suas Informações</Label>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                  <Input name="name" id="name" required placeholder="NOME COMPLETO" className="pl-12 h-14 rounded-none bg-secondary/10 border-none placeholder:text-muted-foreground/40 text-xs tracking-widest" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input name="phone" id="phone" required type="tel" placeholder="(00) 00000-0000" className="pl-12 h-14 rounded-none bg-secondary/10 border-none placeholder:text-muted-foreground/40 text-xs tracking-widest" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input name="email" id="email" required type="email" placeholder="EMAIL" className="pl-12 h-14 rounded-none bg-secondary/10 border-none placeholder:text-muted-foreground/40 text-xs tracking-widest" />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !date || !slot || busySlots.includes(slot)} 
                className="w-full h-16 text-[11px] uppercase tracking-[0.4em] bg-primary hover:bg-primary/90 text-primary-foreground transition-all rounded-none shadow-xl"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirmar Solicitação"}
              </Button>
              
              <div className="flex items-center justify-center gap-3 opacity-50">
                 <Sparkles className="h-3 w-3 text-primary" />
                 <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.3em]">
                   Atendimento exclusivo mediante agendamento.
                 </p>
                 <Sparkles className="h-3 w-3 text-primary" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
