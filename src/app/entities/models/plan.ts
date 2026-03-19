export interface Plan {
    id: number;
    nombre: string;
    precio: number;
    duracionMeses: number;
    suscripcionUnica: boolean;
    flowPlanId: string | null;
    vigencia: boolean;
}
