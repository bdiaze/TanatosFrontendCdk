import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalDestinatarioNotificacion } from '../entities/others/sal-destinatario-notificacion';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { EntDestinatarioNotificacionCrear } from '../entities/others/ent-destinatario-notificacion-crear';

@Injectable({
    providedIn: 'root',
})
export class DestinatarioNotificacionDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<SalDestinatarioNotificacion[]> {
        return this.http.get<SalDestinatarioNotificacion[]>(
            environment.tanatosService.apiUrl + '/DestinatarioNotificacion/Vigentes'
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
}
