export interface SalWhatsappConversacion {
    tenantId: string;
    numeroTelefono: string;
    fechaUltimoMensaje: string;
    previewUltimoMensaje: string | null;
    cantidadNoLeidos: number;
    estado: string;
    fechaUltimaEntrada: string | null;
    puedeResponderGratuitoHasta: string | null;
}
