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
