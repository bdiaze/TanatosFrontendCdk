import { TemplateNorma } from './template-norma';

export interface Template {
    id: number;
    idTemplatePadre: number | null;
    nombre: string;
    descripcion: string;
    vigencia: boolean;

    templateNormas: TemplateNorma[] | null;
}
