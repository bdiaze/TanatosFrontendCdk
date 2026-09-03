export interface SalNegocio {
    id: number;
    nombre: string;
    direccion: string | null;
    idTipoActividad: number | null;
    nombreTipoActividad: string | null;
    mision: string | null;
    vision: string | null;
    valores: string | null;
    fechaCreacion: string;
}
