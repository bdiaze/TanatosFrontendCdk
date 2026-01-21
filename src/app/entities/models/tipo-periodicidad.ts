export interface TipoPeriodicidad {
    id: number;
    nombre: string;
    descripcion: string;
    cron: string | null;
    vigencia: boolean;
}
