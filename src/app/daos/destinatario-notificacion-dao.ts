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
    constructor(private readonly http: HttpClient) {}

    validarDestinatario(entrada: EntDestinatarioNotificacionValidar): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/DestinatarioNotificacion/Validar/', entrada);
    }
}
