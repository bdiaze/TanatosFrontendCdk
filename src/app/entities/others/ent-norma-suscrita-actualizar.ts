export interface EntNormaSuscritaActualizar {
    id: number;
    idNegocio: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    multa: string | null;
    idCategoriaNorma: number | null;
    idCargo: number | null;
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
