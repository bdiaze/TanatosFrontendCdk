export interface TemplateConInscripcion {
    idTemplate: number;
    nombreTemplate: string;
    templateNormas: TemplateNormasConInscripcion[];
    inscrito: boolean;
}

export interface TemplateNormasConInscripcion {
    idNorma: number;
    nombreNorma: string;
}
