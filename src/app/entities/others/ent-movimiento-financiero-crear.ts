export interface EntMovimientoFinancieroCrear {
    idCuentaFinanciera: number;
    idCategoriaFinanciera: number | null;
    tipoMovimiento: number;
    monto: number;
    fechaMovimientoUtc: string;
    descripcion: string | null;
}
