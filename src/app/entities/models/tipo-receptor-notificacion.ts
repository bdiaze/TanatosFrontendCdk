export interface TipoReceptorNotificacion {
    id: number;
    nombre: string;
    regexValidacion: string | null;
    vigencia: boolean;
}
