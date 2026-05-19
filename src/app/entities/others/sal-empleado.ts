export interface SalEmpleado {
    id: number;
    nombre: string;
    idCargo: number | null;
    nombreCargo: string | null;
    destinatarios: SalEmpleadoDestinatario[];
}

export interface SalEmpleadoDestinatario {
    id: number;
    idTipoReceptor: number;
    nombreTipoReceptor: string;
    tipoReceptorRequierePlanEmpresa: boolean;
    destino: string;
    validado: boolean;
}
