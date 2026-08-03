export interface TipoPeriodicidad {
    id: number;
    nombre: string;
    descripcion: string | null;
    cron: string | null;
    frecuenciaDias: number | null;
    deltaDias: number | null;
    deltaMeses: number | null;
    deltaAnnos: number | null;
    orden: number;
    vigencia: boolean;
}
