export interface SalNormaSuscrita {
    id: number;
    nombre: string | null;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
    multa: string | null;
    idCategoriaNorma: number | null;
    nombreCategoriaNorma: string | null;
    ordenVisual: number | null;
    editable: boolean;
    activado: boolean;
    templateNorma: SalTemplateNorma | null;
    fiscalizadores: SalFiscalizadorNormaSuscrita[] | null;
    notificaciones: SalNotificacionNormaSuscrita[] | null;
}

export interface SalTemplateNorma {
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
    multa: string | null;
    idCategoriaNorma: number;
    nombreCategoriaNorma: string | null;
}

export interface SalFiscalizadorNormaSuscrita {
    id: number;
    idTipoFiscalizador: number;
    nombreTipoFiscalizador: string | null;
}

export interface SalNotificacionNormaSuscrita {
    id: number;
    idTipoUnidadTiempoAntelacion: number;
    nombreTipoUnidadTiempoAntelacion: string | null;
    cantAntelacion: number;
}
