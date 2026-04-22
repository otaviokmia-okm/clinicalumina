
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, AppointmentStatus } from '@/lib/types';
import { Check, X, Calendar as CalendarIcon, Sparkles, Wand2, Loader2, Bell, Mail, Send, History, Filter, CheckCircle2 } from 'lucide-react';
import { aiPersonalizedConfirmation } from '@/ai/flows/ai-personalized-confirmation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { format, isBefore, startOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("active");

  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'appointments'), orderBy('date', 'asc'), orderBy('timeSlot', 'asc'));
  }, [db, user]);
  
  const { data: appointments, isLoading: isCollectionLoading } = useCollection<Appointment>(appointmentsQuery);

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [aiResult, setAiResult] = useState<{ message: string; guidance: string; emailSubject?: string; emailBody?: string } | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newSlot, setNewSlot] = useState<string>('');

  // Auto-Mark as Attended for past dates
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const today = startOfDay(new Date());
      appointments.forEach(appt => {
        const apptDate = startOfDay(parseISO(appt.date));
        if (isBefore(apptDate, today) && (appt.status === 'Confirmado' || appt.status === 'Remarcado')) {
          const docRef = doc(db, 'appointments', appt.id);
          updateDocumentNonBlocking(docRef, { 
            status: 'Atendido',
            updatedAt: new Date().toISOString()
          });
        }
      });
    }
  }, [appointments, db]);

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

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    
    let filtered = appointments;

    // Filter by Date if selected
    if (filterDate) {
      const dateStr = format(filterDate, 'yyyy-MM-dd');
      filtered = filtered.filter(a => a.date === dateStr);
    }

    // Filter by Tab
    if (activeTab === "active") {
      filtered = filtered.filter(a => a.status === 'Pendente' || a.status === 'Confirmado' || a.status === 'Remarcado');
    } else if (activeTab === "history") {
      filtered = filtered.filter(a => a.status === 'Atendido' || a.status === 'Cancelado');
    }

    return filtered;
  }, [appointments, filterDate, activeTab]);

  const generateAIContent = async (appt: Appointment) => {
    setGeneratingAi(true);
    setSelectedAppt(appt);
    setAiResult(null);
    try {
      const result = await aiPersonalizedConfirmation({
        clientName: appt.clientName,
        serviceName: appt.serviceName
      });
      setAiResult({
        message: result.confirmationMessage,
        guidance: result.preTreatmentGuidance,
        emailSubject: result.emailSubject,
        emailBody: result.emailBody
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

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    const docRef = doc(db, 'appointments', id);
    updateDocumentNonBlocking(docRef, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: 'Status Atualizado',
      description: `Agendamento marcado como ${newStatus}.`
    });

    if (newStatus === 'Confirmado') {
      const appt = appointments?.find(a => a.id === id);
      if (appt) {
        generateAIContent(appt);
      }
    }
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

  const getBadgeColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Pendente': return 'secondary';
      case 'Confirmado': return 'default';
      case 'Cancelado': return 'destructive';
      case 'Remarcado': return 'outline';
      case 'Atendido': return 'outline'; // Estilo específico de sucesso silencioso
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
          <div className="flex flex-wrap gap-4 items-center">
            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("rounded-none border-border bg-background uppercase text-[10px] tracking-widest h-11 px-6", filterDate && "border-primary text-primary")}>
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  {filterDate ? format(filterDate, "dd 'de' MMM", { locale: ptBR }) : "Filtrar por Data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-none" align="end">
                <CalendarComponent
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                />
                {filterDate && (
                  <div className="p-3 border-t border-border flex justify-center">
                    <Button variant="ghost" size="sm" onClick={() => setFilterDate(undefined)} className="text-[10px] uppercase tracking-widest">Limpar Filtro</Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <div className="px-4 py-2 bg-background border border-border shadow-sm flex items-center gap-4 h-11">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Novas Solicitações</p>
                <p className="font-headline text-lg text-primary">{appointments?.filter(a => a.status === 'Pendente').length || 0}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className={cn("h-4 w-4 text-primary", appointments?.some(a => a.status === 'Pendente') && "animate-bounce")} />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-background border border-border rounded-none h-12 p-1">
              <TabsTrigger value="active" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-[10px] tracking-widest px-6 h-full">Agenda Ativa</TabsTrigger>
              <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-[10px] tracking-widest px-6 h-full">Histórico</TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-background shadow-xl border border-border/40 overflow-hidden rounded-none">
            {isCollectionLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Acessando registros...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nenhum agendamento encontrado para este filtro.</p>
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
                  {filteredAppointments.map((appt) => (
                    <TableRow key={appt.id} className="hover:bg-secondary/5 transition-colors group">
                      <TableCell className="py-6">
                        <p className="font-semibold text-sm">{appt.clientName}</p>
                        <p className="text-[10px] text-muted-foreground font-light">{appt.clientPhone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary font-light text-[10px]">{appt.serviceName}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">{appt.date ? format(new Date(appt.date + 'T12:00:00'), "dd/MM/yyyy") : '-'}</p>
                        <p className="text-[10px] text-muted-foreground">{appt.timeSlot}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeColor(appt.status)} className={cn("text-[9px] uppercase tracking-widest px-2 py-0", appt.status === 'Atendido' && "bg-green-50 text-green-700 border-green-200")}>
                          {appt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {appt.status !== 'Atendido' && appt.status !== 'Cancelado' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => generateAIContent(appt)}
                                className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                                title="Gerar Confirmação IA"
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                              </Button>
                              {appt.status !== 'Confirmado' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateStatus(appt.id, 'Confirmado')}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 p-0"
                                  title="Confirmar"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              {appt.status === 'Confirmado' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateStatus(appt.id, 'Atendido')}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"
                                  title="Marcar como Atendido"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
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
                            </>
                          )}
                          {(appt.status === 'Atendido' || appt.status === 'Cancelado') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                setSelectedAppt(appt);
                                setGeneratingAi(false);
                                setAiResult(null); // Visualização simples no histórico
                              }}
                              className="text-muted-foreground h-8 w-8 p-0"
                              title="Ver Detalhes"
                            >
                              <Filter className="h-3.5 w-3.5 rotate-90" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Tabs>
      </div>

      {/* Dialogs remain similar but with updated text */}
      <Dialog open={!!selectedAppt} onOpenChange={(open) => !open && setSelectedAppt(null)}>
        <DialogContent className="max-w-2xl bg-background border-none shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline flex items-center gap-3">
              {selectedAppt?.status === 'Atendido' ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Wand2 className="h-6 w-6 text-primary" />} 
              {selectedAppt?.status === 'Atendido' ? 'Histórico do Cliente' : 'Confirmar Atendimento'}
            </DialogTitle>
            <DialogDescription className="uppercase text-[10px] tracking-widest font-bold">
              {selectedAppt?.clientName} • {selectedAppt?.serviceName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6 max-h-[60vh] overflow-y-auto pr-2">
            {generatingAi ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Compondo mensagem de luxo...</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-none flex items-start gap-4">
                   <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">E-mail de Confirmação Pronto</p>
                      <p className="text-[10px] text-muted-foreground italic mb-2">(Destinatário: {selectedAppt?.clientEmail})</p>
                      <p className="text-sm font-semibold mb-2">Assunto: {aiResult.emailSubject}</p>
                      <div className="text-[11px] text-muted-foreground opacity-80 border-t border-primary/10 pt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: aiResult.emailBody || '' }} />
                   </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Mensagem de Confirmação</h4>
                  <div className="p-6 bg-secondary/10 border-l-2 border-primary italic font-light leading-relaxed whitespace-pre-line text-sm">
                    {aiResult.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/10">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Data Original</p>
                    <p className="text-sm font-bold">{selectedAppt?.date ? format(new Date(selectedAppt.date + 'T12:00:00'), "dd/MM/yyyy") : '-'}</p>
                  </div>
                  <div className="p-4 bg-secondary/10">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Status Final</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">{selectedAppt?.status}</p>
                  </div>
                </div>
                <div className="p-4 border border-border">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Registro do Sistema</p>
                  <p className="text-xs leading-relaxed italic">Atendimento arquivado no histórico de {selectedAppt?.clientName} para consultas futuras.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between gap-4">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest max-w-[200px] leading-tight">
              {selectedAppt?.status === 'Atendido' ? 'Registro de histórico bloqueado para edições.' : 'Utilize o WhatsApp para contato imediato.'}
            </p>
            {aiResult && (
              <Button 
                className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-none uppercase text-xs tracking-widest px-8 h-12 flex items-center gap-2"
                onClick={() => {
                  if (selectedAppt && aiResult) {
                    const text = `${aiResult.message}%0A%0A*Orientações:*%0A${aiResult.guidance}`;
                    window.open(`https://wa.me/${selectedAppt.clientPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
                  }
                }}
              >
                <Send className="h-4 w-4" /> Enviar via WhatsApp
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reschedulingAppt} onOpenChange={(open) => !open && setReschedulingAppt(null)}>
        <DialogContent className="max-w-3xl bg-background border-none shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline">Reagendar Atendimento</DialogTitle>
            <DialogDescription className="sr-only">Selecione uma nova data e horário.</DialogDescription>
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
            <Button className="bg-primary hover:bg-primary/90 rounded-none uppercase text-xs tracking-widest px-8" onClick={handleReschedule}>
              Salvar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </main>
  );
}
