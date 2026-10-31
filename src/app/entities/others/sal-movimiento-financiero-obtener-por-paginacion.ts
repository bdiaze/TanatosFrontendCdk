import { SalMovimientoFinanciero } from './sal-movimiento-financiero';

export interface SalMovimientoFinancieroObtenerPorPaginacion {
    items: SalMovimientoFinanciero[];
    siguienteFecha: string | null;
    siguienteId: number | null;
}
