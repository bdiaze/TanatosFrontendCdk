export interface EntNormaSuscritaActualizar {
    id: number;
    idNegocio: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number;
    multa: string | null;
    idCategoriaNorma: number;
    activado: boolean;
    fiscalizadores: EntFiscalizadorNormaSuscritaActualizar[] | null;
    notificaciones: EntNotificacionNormaSuscritaActualizar[] | null;
    proximoVencimiento: string | null;
}

export interface EntFiscalizadorNormaSuscritaActualizar {
    idTipoFiscalizador: number;
}

export interface EntNotificacionNormaSuscritaActualizar {
    idTipoUnidadTiempoAntelacion: number;
    cantAntelacion: number;
}
