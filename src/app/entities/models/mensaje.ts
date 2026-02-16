export interface Mensaje {
    id: number;
    sub: string | null;
    nombre: string;
    correo: string;
    contenido: string;
    fechaCreacion: string;
}
