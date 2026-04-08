export interface TipoReceptorNotificacion {
    id: number;
    nombre: string;
    regexValidacion: string | null;
    requierePlanEmpresa: boolean;
    vigencia: boolean;
}
