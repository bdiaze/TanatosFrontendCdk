export interface SalDocumentoAdjuntoGenerarUrlSubida {
    idDocumentoAdjunto: number;
    preSignedUrl: string;
    preSignedFields: Record<string, string>;
}
