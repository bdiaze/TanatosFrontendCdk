export interface TipoUnidadTiempo {
    id: number;
    nombre: string;
    nombrePlural: string | null;
    cantSegundos: number;
    cantMinutos: number | null;
    cantHoras: number | null;
    cantDias: number | null;
    vigencia: boolean;
}
