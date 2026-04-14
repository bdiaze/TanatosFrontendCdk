export interface SalDestinatarioNotificacion {
    id: number;
    idTipoReceptor: number;
    nombreTipoReceptor: string | null;
    requierePlanEmpresa: boolean | null;
    alias: string | null;
    destino: string;
    validado: boolean;
}
