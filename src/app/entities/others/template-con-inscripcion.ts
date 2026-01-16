export interface TemplateConInscripcion {
    idTemplate: number;
    nombreTemplate: string;
    templateNormas: TemplateNormasConInscripcion[];
    inscrito: boolean;
    recomendado: boolean;
}

export interface TemplateNormasConInscripcion {
    idNorma: number;
    nombreNorma: string;
}
