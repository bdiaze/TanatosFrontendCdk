export interface SalDestinatarioNotificacion {
    id: number;
    idTipoReceptor: number;
    nombreTipoReceptor: string | null;
    destino: string;
    validado: boolean;
}
