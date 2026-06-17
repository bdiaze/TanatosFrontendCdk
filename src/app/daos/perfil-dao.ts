import { Injectable } from '@angular/core';
import { EntPerfilConfirmarRegistro } from '../entities/others/ent-perfil-confirmar-registro';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntPerfilReenviarCodigoVerificacion } from '../entities/others/ent-perfil-reenviar-codigo-verificacion';

@Injectable({
    providedIn: 'root',
})
export class PerfilDao {
    constructor(private readonly http: HttpClient) {}

    confirmarRegistro(entrada: EntPerfilConfirmarRegistro): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/Perfil/ConfirmarRegistro', entrada);
    }

    reenviarCodigoVerificacion(entrada: EntPerfilReenviarCodigoVerificacion): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/Perfil/ReenviarCodigoVerificacion', entrada);
    }
}
