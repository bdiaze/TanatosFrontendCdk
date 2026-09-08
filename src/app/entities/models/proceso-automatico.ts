export interface ProcesoAutomatico {
    id: number;
    idTipoProcesoAutomatico: number;
    idProcesoKairos: string;
    idCalendarizacionKairos: string;
    nombre: string;
    arnRol: string;
    arnProceso: string;
    parametros: string;
    cron: string | null;
    frecuenciaDias: number | null;
    inicioEjecucionUtc: string | null;
    fechaCreacion: string;
    fechaEliminacion: string | null;
    vigencia: boolean;
}
