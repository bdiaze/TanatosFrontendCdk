export interface TipoPeriodicidad {
    id: number;
    nombre: string;
    descripcion: string;
    cron: string | null;
    deltaDias: number | null;
    deltaMeses: number | null;
    deltaAnnos: number | null;
    vigencia: boolean;
}
