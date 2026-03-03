export interface SalWhatsappMensaje {
    tenantId: string;
    numeroTelefono: string;
    whatsappMessageId: string;
    direccion: string;
    tipo: string;
    cuerpo: string | null;
    nombreTemplate: string | null;
    estado: string;
    fechaCreacion: string;
    rawPayload: string | null;
}
