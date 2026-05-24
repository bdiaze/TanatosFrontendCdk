export interface EntNormaSuscritaCrear {
    idNegocio: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    multa: string | null;
    idCategoriaNorma: number | null;
    idCargo: number | null;
    activado: boolean;
    fiscalizadores: EntFiscalizadorNormaSuscritaCrear[] | null;
    notificaciones: EntNotificacionNormaSuscritaCrear[] | null;
    proximoVencimiento: string | null;
}

export interface EntFiscalizadorNormaSuscritaCrear {
    idTipoFiscalizador: number;
}

export interface EntNotificacionNormaSuscritaCrear {
    idTipoUnidadTiempoAntelacion: number;
    cantAntelacion: number;
}
