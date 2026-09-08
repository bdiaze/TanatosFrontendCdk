import { ProcesoAutomatico } from '../models/proceso-automatico';

export interface SalProcesoAutomaticoObtenerPorPaginacion {
    items: ProcesoAutomatico[];
    siguienteId: number | null;
}
