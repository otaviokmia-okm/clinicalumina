
"use client";

import { useState, useEffect } from 'react';
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
import { Check, X, Calendar, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { aiPersonalizedConfirmation } from '@/ai/flows/ai-personalized-confirmation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    clientName: 'Julianne Moore',
    clientPhone: '(11) 98822-1100',
    clientEmail: 'julianne@example.com',
    serviceId: '1',
    serviceName: 'Harmonização Facial',
    date: '2024-05-20',
    timeSlot: '14:00',
    status: 'Pendente',
    createdAt: '2024-05-15'
  },
  {
    id: '2',
    clientName: 'Ricardo Almeida',
    clientPhone: '(11) 97711-2233',
    clientEmail: 'ricardo@fashion.com',
    serviceId: '3',
    serviceName: 'Tecnologias de Laser',
    date: '2024-05-21',
    timeSlot: '09:00',
    status: 'Pendente',
    createdAt: '2024-05-16'
  }
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [aiResult, setAiResult] = useState<{ message: string; guidance: string } | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulated fetch
    setAppointments(MOCK_APPOINTMENTS);
  }, []);

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast({
      title: 'Status Atualizado',
      description: `Agendamento marcado como ${newStatus}.`
    });
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
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pendente</p>
                <p className="font-headline text-xl">{appointments.filter(a => a.status === 'Pendente').length}</p>
              </div>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-background shadow-xl border border-border/40 overflow-hidden">
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
              {appointments.map((appt) => (
                <TableRow key={appt.id} className="hover:bg-secondary/5 transition-colors">
                  <TableCell className="py-6">
                    <p className="font-semibold">{appt.clientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.clientPhone}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/20 text-primary font-light">{appt.serviceName}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{appt.date}</p>
                    <p className="text-xs text-muted-foreground">{appt.timeSlot}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeColor(appt.status)}>{appt.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => generateAIContent(appt)}
                        className="text-primary hover:bg-primary/10 flex items-center gap-1"
                        title="Gerar Confirmação IA"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold">IA</span>
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
                        onClick={() => updateStatus(appt.id, 'Remarcado')}
                        className="h-8 w-8 p-0"
                        title="Remarcar"
                      >
                        <Calendar className="h-4 w-4" />
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
          
          {appointments.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Sparkles className="h-12 w-12 text-muted/30 mx-auto" />
              <p className="text-muted-foreground font-light uppercase tracking-widest text-sm">Nenhum agendamento encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Content Modal */}
      <Dialog open={!!selectedAppt} onOpenChange={(open) => !open && setSelectedAppt(null)}>
        <DialogContent className="max-w-2xl bg-background border-none shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-primary" /> Confirmação Personalizada
            </DialogTitle>
            <DialogDescription className="uppercase text-[10px] tracking-widest font-bold mt-2">
              Gerado por Lumina Concierge AI para {selectedAppt?.clientName}
            </DialogDescription>
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
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Mensagem de Boas-vindas</h4>
                  <div className="p-6 bg-secondary/10 border-l-2 border-primary italic font-light leading-relaxed">
                    {aiResult.message}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Orientações Pré-Tratamento</h4>
                  <div className="p-6 bg-secondary/5 text-sm leading-relaxed text-muted-foreground">
                    {aiResult.guidance}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedAppt(null)} className="rounded-none uppercase text-xs tracking-widest">Fechar</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-none uppercase text-xs tracking-widest"
              onClick={() => {
                toast({ title: 'Mensagem Enviada', description: 'Conteúdo enviado via WhatsApp para o cliente.' });
                setSelectedAppt(null);
              }}
            >
              Enviar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </main>
  );
}
