export interface EntNormaSuscritaActualizar {
    id: number;
    idNegocio: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number;
    multa: string | null;
    idCategoriaNorma: number;
    activado: boolean;
}
