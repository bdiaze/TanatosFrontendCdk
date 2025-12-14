import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalDestinatarioNotificacion } from '../entities/others/sal-destinatario-notificacion';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { EntDestinatarioNotificacionCrear } from '../entities/others/ent-destinatario-notificacion-crear';
import { EntDestinatarioNotificacionValidar } from '../entities/others/ent-destinatario-notificacion-validar';

@Injectable({
    providedIn: 'root',
})
export class DestinatarioNotificacionDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalDestinatarioNotificacion[]> {
        return this.http.get<SalDestinatarioNotificacion[]>(
            environment.tanatosService.apiUrl + `/DestinatarioNotificacion/Vigentes/${idNegocio}`
        );
    }

    crear(entrada: EntDestinatarioNotificacionCrear): Observable<SalDestinatarioNotificacion> {
        return this.http.post<SalDestinatarioNotificacion>(
            environment.tanatosService.apiUrl + '/DestinatarioNotificacion/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/DestinatarioNotificacion/${id}`
        );
    }

    validarDestinatario(entrada: EntDestinatarioNotificacionValidar): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/public/DestinatarioNotificacion/Validar/',
            entrada
        );
    }
}
