export interface DestinatarioNotificacion {
    id: number;
    sub: string;
    idTipoReceptor: number;
    destino: string;
    codigoValidacion: string;
    intentosValidacion: number;
    validado: boolean;
    fechaCreacion: string;
    fechaEliminacion: string;
    vigencia: boolean;
}
