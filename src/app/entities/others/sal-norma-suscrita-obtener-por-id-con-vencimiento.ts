import { SalDocumentoAdjunto } from './sal-documento-adjunto';
import { SalFiscalizadorNormaSuscrita } from './sal-norma-suscrita';

export interface SalNormaSuscritaObtenerPorIdConVencimiento {
    idNegocio: number | null;
    nombreNegocio: string | null;
    id: number;
    nombre: string | null;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
    multa: string | null;
    idCategoriaNorma: number | null;
    nombreCategoriaNorma: string | null;
    fiscalizadores: SalFiscalizadorNormaSuscrita[] | null;
    templateNorma: SalTemplateNormaObtenerPorIdConVencimiento | null;
    fechaVencimiento: string;
    fechaCompletitud: string | null;
    documentosAdjuntos: SalDocumentoAdjunto[] | null;
}

export interface SalTemplateNormaObtenerPorIdConVencimiento {
    idTemplate: number;
    nombreTemplate: string;
    nombre: string;
    descripcion: string | null;
    idTipoPeriodicidad: number | null;
    nombreTipoPeriodicidad: string | null;
    multa: string | null;
    idCategoriaNorma: number;
    nombreCategoriaNorma: string | null;
    fiscalizadores: SalFiscalizadorNormaSuscrita[] | null;
}
