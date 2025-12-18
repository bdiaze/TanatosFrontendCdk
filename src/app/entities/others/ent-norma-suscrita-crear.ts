export interface EntNormaSuscritaCrear {
    idNegocio: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number;
    multa: string | null;
    idCategoriaNorma: number;
    activado: boolean;
    fiscalizadores: EntFiscalizadorNormaSuscritaCrear[] | null;
    notificaciones: EntNotificacionNormaSuscritaCrear[] | null;
}

export interface EntFiscalizadorNormaSuscritaCrear {
    idTipoFiscalizador: number;
}

export interface EntNotificacionNormaSuscritaCrear {
    idTipoUnidadTiempoAntelacion: number;
    cantAntelacion: number;
}
