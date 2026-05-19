export interface EntEmpleadoActualizar {
    id: number;
    nombre: string;
    idCargo: number;
    destinatarios: EntEmpleadoActualizarDestinatario[];
}

export interface EntEmpleadoActualizarDestinatario {
    idTipoReceptor: number;
    destino: string;
}
