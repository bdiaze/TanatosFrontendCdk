export interface SalCuentaFinanciera {
    id: number;
    nombre: string;
    idTipoCuentaFinanciera: number | null;
    nombreTipoCuentaFinanciera: string | null;
    saldoActual: number;
}
