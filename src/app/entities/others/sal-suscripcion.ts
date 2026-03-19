export interface SalSuscripcion {
    id: number;
    idPlan: number;
    nombrePlan: string;
    precioPlan: number;
    duracionMesesPlan: number;
    fechaInicio: string | null;
    fechaExpiracion: string | null;
    fechaCancelacion: string | null;
    estado: number;
}
