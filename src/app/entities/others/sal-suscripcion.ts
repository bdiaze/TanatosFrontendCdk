export interface SalSuscripcion {
    id: number;
    idPlan: number;
    nombrePlan: string;
    precioPlan: number;
    duracionMesesPlan: number;
    fechaInicio: string | null;
    fechaExpiracion: string | null;
    fechaCancelacion: string | null;
    estado: number; // 1: Activa - 2: Cancelada - 3: Expirada - 4: Pago Pendiente.
    tieneFlowSubscriptionId: boolean;
}
