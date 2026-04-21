
"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Phone, Mail, CheckCircle2, Loader2, CalendarX2 } from 'lucide-react';
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slot, setSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();

  // Consulta agendamentos existentes para a data selecionada para bloquear horários ocupados
  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !date) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    return query(
      collection(db, 'appointments'),
      where('date', '==', dateStr)
    );
  }, [db, date]);

  const { data: existingAppts, isLoading: isLoadingAppts } = useCollection<Appointment>(appointmentsQuery);

  // Define quais horários estão ocupados (Confirmados ou Remarcados)
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

    if (busySlots.includes(slot)) {
      toast({
        variant: 'destructive',
        title: 'Horário Indisponível',
        description: 'Este horário acabou de ser reservado. Por favor, escolha outro.'
      });
      return;
    }

    setLoading(true);

    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      const formData = new FormData(formElement);
      const appointmentData = {
        clientName: formData.get('name') as string,
        clientPhone: formData.get('phone') as string,
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

      setIsSuccess(true);
      toast({
        title: 'Solicitação Enviada',
        description: 'Recebemos seu pedido. Em breve entraremos em contato para confirmar.'
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro no Agendamento',
        description: 'Não foi possível salvar seu agendamento. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return startOfDay(date) < today || date.getDay() === 0;
  };

  if (isSuccess) {
    return (
      <div className="bg-secondary/40 p-12 text-center rounded-sm border border-primary/20 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto my-24">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h3 className="text-3xl font-headline mb-4">Experiência Solicitada</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Sua solicitação de agendamento para {date && format(date, "dd 'de' MMMM", { locale: ptBR })} às {slot} foi registrada com sucesso.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-primary text-primary">Voltar</Button>
      </div>
    );
  }

  return (
    <section id="booking" className="py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-headline">Reserve sua <br /><span className="text-primary italic">Lumina Experience</span></h2>
            <p className="text-muted-foreground font-light leading-relaxed">
              Selecione o melhor momento para sua visita. Nosso concierge entrará em contato em até 24 horas para personalizar seu atendimento.
            </p>
            
            <div className="bg-background p-6 shadow-sm border border-border/40 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setSlot(''); // Reseta o horário ao mudar a data
                }}
                className="rounded-md border-none w-full"
                locale={ptBR}
                disabled={isDateDisabled}
              />
            </div>
          </div>

          <form onSubmit={handleBooking} className="bg-background p-10 shadow-xl space-y-8 border border-border/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Horários Disponíveis</Label>
                {isLoadingAppts && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
              </div>
              
              <RadioGroup value={slot} onValueChange={setSlot} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          "flex items-center justify-center p-3 text-sm border border-border transition-all rounded-none",
                          isBusy 
                            ? "bg-secondary/50 text-muted-foreground cursor-not-allowed border-dashed opacity-50" 
                            : "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer"
                        )}
                      >
                        {isBusy ? <CalendarX2 className="h-3 w-3 mr-1 opacity-50" /> : null}
                        {time}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {busySlots.length === TIME_SLOTS.length && (
                <p className="text-[10px] text-destructive uppercase tracking-widest font-bold text-center mt-2">
                  Lamentamos, mas todos os horários para este dia estão reservados.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input name="name" id="name" required placeholder="Ex: Maria Silva" className="pl-10 rounded-none bg-secondary/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="phone" id="phone" required type="tel" placeholder="(11) 99999-9999" className="pl-10 rounded-none bg-secondary/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="email" id="email" required type="email" placeholder="contato@exemplo.com" className="pl-10 rounded-none bg-secondary/10" />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !date || !slot || busySlots.includes(slot)} 
              className="w-full h-14 text-lg uppercase tracking-widest bg-primary hover:bg-primary/90 transition-all"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Solicitar Agendamento"}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
              Ao agendar, você concorda com nossos termos de privacidade e serviço.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
