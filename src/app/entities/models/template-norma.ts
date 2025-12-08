import { TemplateNormaFiscalizador } from './template-norma-fiscalizador';
import { TemplateNormaNotificacion } from './template-norma-notificacion';

export interface TemplateNorma {
    idTemplate: number;
    idNorma: number;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    multa: string | null;
    idCategoriaNorma: number;

    templateNormaFiscalizadores: TemplateNormaFiscalizador[] | null;
    templateNormaNotificaciones: TemplateNormaNotificacion[] | null;
}
