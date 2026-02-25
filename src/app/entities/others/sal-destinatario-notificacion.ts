export interface SalDestinatarioNotificacion {
    id: number;
    idTipoReceptor: number;
    nombreTipoReceptor: string | null;
    alias: string | null;
    destino: string;
    validado: boolean;
}
