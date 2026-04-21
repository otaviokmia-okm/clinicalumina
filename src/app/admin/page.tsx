"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { Check, X, Calendar as CalendarIcon, Sparkles, Wand2, Loader2, Bell } from 'lucide-react';
import { aiPersonalizedConfirmation } from '@/ai/flows/ai-personalized-confirmation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const prevCount = useRef<number>(0);
  
  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
  }, [db, user]);
  
  const { data: appointments, isLoading: isCollectionLoading } = useCollection<Appointment>(appointmentsQuery);

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [aiResult, setAiResult] = useState<{ message: string; guidance: string } | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());
  const [newSlot, setNewSlot] = useState<string>('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (appointments && appointments.length > prevCount.current) {
      if (prevCount.current > 0) {
        toast({
          title: "Novo Agendamento!",
          description: "Uma nova solicitação acaba de chegar no sistema.",
        });
      }
      prevCount.current = appointments.length;
    }
  }, [appointments, toast]);

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    const docRef = doc(db, 'appointments', id);
    updateDocumentNonBlocking(docRef, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: 'Status Atualizado',
      description: `Agendamento marcado como ${newStatus}.`
    });
  };

  const handleReschedule = () => {
    if (!reschedulingAppt || !newDate || !newSlot) return;

    const docRef = doc(db, 'appointments', reschedulingAppt.id);
    updateDocumentNonBlocking(docRef, { 
      date: format(newDate, 'yyyy-MM-dd'),
      timeSlot: newSlot,
      status: 'Remarcado',
      updatedAt: new Date().toISOString()
    });

    toast({
      title: 'Agendamento Remarcado',
      description: `Novo horário: ${format(newDate, 'dd/MM')} às ${newSlot}.`
    });
    setReschedulingAppt(null);
  };

  const generateAIContent = async (appt: Appointment) => {
    setGeneratingAi(true);
    setSelectedAppt(appt);
    try {
      const result = await aiPersonalizedConfirmation({
        clientName: appt.clientName,
        serviceName: appt.serviceName
      });
      setAiResult({
        message: result.confirmationMessage,
        guidance: result.preTreatmentGuidance
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de IA',
        description: 'Não foi possível gerar a confirmação personalizada.'
      });
    } finally {
      setGeneratingAi(false);
    }
  };

  const getBadgeColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Pendente': return 'secondary';
      case 'Confirmado': return 'default';
      case 'Cancelado': return 'destructive';
      case 'Remarcado': return 'outline';
      default: return 'secondary';
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/10 pb-20">
      <Navigation />
      
      <div className="pt-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline">Gestão de Agenda</h1>
            <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Painel Administrativo Lumina Concierge</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-background border border-border shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Novas Solicitações</p>
                <p className="font-headline text-xl text-primary">{appointments?.filter(a => a.status === 'Pendente').length || 0}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className={cn("h-5 w-5 text-primary", appointments?.some(a => a.status === 'Pendente') && "animate-bounce")} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background shadow-xl border border-border/40 overflow-hidden rounded-none">
          {isCollectionLoading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Acessando registros...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="uppercase text-[10px] tracking-widest font-bold">Cliente</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest font-bold">Serviço</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest font-bold">Data/Hora</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments?.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-secondary/5 transition-colors group">
                    <TableCell className="py-6">
                      <p className="font-semibold text-sm">{appt.clientName}</p>
                      <p className="text-[10px] text-muted-foreground font-light">{appt.clientPhone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/20 text-primary font-light text-[10px]">{appt.serviceName}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{format(new Date(appt.date + 'T12:00:00'), "dd/MM/yyyy")}</p>
                      <p className="text-[10px] text-muted-foreground">{appt.timeSlot}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeColor(appt.status)} className="text-[9px] uppercase tracking-widest px-2 py-0">
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => generateAIContent(appt)}
                          className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                          title="Gerar Confirmação IA"
                        >
                          <Wand2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(appt.id, 'Confirmado')}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 p-0"
                          title="Confirmar"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setReschedulingAppt(appt);
                            setNewSlot(appt.timeSlot);
                            setNewDate(new Date(appt.date + 'T12:00:00'));
                          }}
                          className="h-8 w-8 p-0 rounded-none border-border"
                          title="Remarcar"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => updateStatus(appt.id, 'Cancelado')}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          title="Cancelar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {appointments?.length === 0 && !isCollectionLoading && (
            <div className="py-20 text-center space-y-4">
              <Sparkles className="h-12 w-12 text-muted/30 mx-auto" />
              <p className="text-muted-foreground font-light uppercase tracking-widest text-sm">Aguardando primeiras solicitações.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedAppt} onOpenChange={(open) => !open && setSelectedAppt(null)}>
        <DialogContent className="max-w-2xl bg-background border-none shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-primary" /> Confirmação Personalizada
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {generatingAi ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Compondo mensagem de luxo...</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Mensagem</h4>
                  <div className="p-6 bg-secondary/10 border-l-2 border-primary italic font-light leading-relaxed whitespace-pre-line">
                    {aiResult.message}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Orientações</h4>
                  <div className="p-6 bg-secondary/5 text-sm leading-relaxed text-muted-foreground">
                    {aiResult.guidance}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-none uppercase text-xs tracking-widest w-full h-12"
              onClick={() => {
                if (selectedAppt && aiResult) {
                  const text = `${aiResult.message}%0A%0A*Orientações Pre-Tratamento:*%0A${aiResult.guidance}`;
                  window.open(`https://wa.me/${selectedAppt.clientPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
                }
                setSelectedAppt(null);
              }}
            >
              Enviar via WhatsApp para Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reschedulingAppt} onOpenChange={(open) => !open && setReschedulingAppt(null)}>
        <DialogContent className="max-w-3xl bg-background border-none shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline">Reagendar Atendimento</DialogTitle>
            <DialogDescription className="uppercase text-[10px] tracking-widest font-bold">
              Alterando horário para {reschedulingAppt?.clientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
            <div className="bg-secondary/10 p-4 border border-border">
              <CalendarComponent
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                locale={ptBR}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Novos Horários</Label>
              <RadioGroup value={newSlot} onValueChange={setNewSlot} className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((time) => (
                  <div key={time}>
                    <RadioGroupItem value={time} id={`new-${time}`} className="peer sr-only" />
                    <Label
                      htmlFor={`new-${time}`}
                      className="flex items-center justify-center p-3 text-sm border border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer transition-all rounded-none"
                    >
                      {time}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setReschedulingAppt(null)} className="rounded-none uppercase text-xs tracking-widest">Descartar</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-none uppercase text-xs tracking-widest px-8"
              onClick={handleReschedule}
            >
              Salvar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </main>
  );
}