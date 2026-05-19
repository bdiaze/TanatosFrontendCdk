export interface EntEmpleadoCrear {
    idNegocio: number;
    nombre: string;
    idCargo: number;
    destinatarios: EntEmpleadoCrearDestinatario[];
}

export interface EntEmpleadoCrearDestinatario {
    idTipoReceptor: number;
    destino: string;
}
