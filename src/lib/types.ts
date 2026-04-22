
export type Service = {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration: string;
  imageUrl: string;
};

export type AppointmentStatus = 'Pendente' | 'Confirmado' | 'Remarcado' | 'Cancelado' | 'Atendido';

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
};
