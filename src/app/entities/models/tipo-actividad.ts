export interface TipoActividad {
    id: number;
    idTipoRubro: number;
    nombre: string;
    descripcion: string | null;
    vigencia: boolean;
}
