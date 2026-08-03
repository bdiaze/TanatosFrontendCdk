export interface SalNormaSuscritaObtenerConVencimiento {
    fechaVencimiento: string;
    fechaCompletitud: string | null;
    idTemplate: number | null;
    idNorma: number | null;
    idNormaSuscrita: number;
    idHistorialNormaSuscrita: number;
    nombreTemplate: string | null;
    nombreNorma: string | null;
    descripcionNorma: string | null;
    multaNorma: string | null;
    idCategoriaNorma: number | null;
    nombreCategoriaNorma: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
    idCargo: number | null;
    nombreCargo: string | null;
}
