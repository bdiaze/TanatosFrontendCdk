export interface DestinatarioNotificacion {
    id: number;
    sub: string;
    idTipoReceptor: number;
    destino: string;
    codigoValidacion: string;
    validado: boolean;
    fechaCreacion: string;
    fechaEliminacion: string | null;
    vigencia: boolean;
}
