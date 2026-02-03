export interface SalNormaSuscritaObtenerConVencimiento {
    fechaVencimiento: string;
    idNormaSuscrita: number;
    idHistorialNormaSuscrita: number;
    nombreNorma: string | null;
    descripcionNorma: string | null;
    multaNorma: string | null;
    idCategoriaNorma: number | null;
    nombreCategoriaNorma: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
}
