export interface SalMovimientoFinanciero {
    id: number;
    idCategoriaFinanciera: number | null;
    nombreCategoriaFinanciera: string | null;
    tipoMovimiento: number; // 1: Ingreso - 2: Gasto
    monto: number;
    saldo: number;
    fechaMovimiento: string;
    descripcion: string | null;
}
