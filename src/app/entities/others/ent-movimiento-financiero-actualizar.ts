export interface EntMovimientoFinancieroActualizar {
    idNegocio: number;
    idCuentaFinanciera: number;
    idMovimientoFinanciero: number;
    idCategoriaFinanciera: number | null;
    tipoMovimiento: number;
    monto: number;
    fechaMovimiento: string;
    descripcion: string | null;
    estado: number; // 0: Preliminar - 1: Confirmado
}
