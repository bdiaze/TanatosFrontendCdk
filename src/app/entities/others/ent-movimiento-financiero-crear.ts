export interface EntMovimientoFinancieroCrear {
    idCuentaFinanciera: number;
    idCategoriaFinanciera: number | null;
    tipoMovimiento: number;
    monto: number;
    fechaMovimientoUtc: string;
    descripcion: string | null;
    estado: number; // 0: Preliminar - 1: Confirmado
}
