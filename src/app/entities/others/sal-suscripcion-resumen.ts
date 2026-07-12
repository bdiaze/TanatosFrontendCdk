export interface SalSuscripcionResumen {
    nombrePlanEnCurso: string | null;
    precioPlanEnCurso: number | null;
    nombrePlanPagoEnCurso: string | null;
    precioPlanPagoEnCurso: number | null;
    fechaExpiracion: string | null;
    fechaProximoCobro: string | null;
    renovacionAutomatica: boolean;
}
