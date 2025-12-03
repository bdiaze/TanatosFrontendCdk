import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoReceptorNotificacion } from '@models/tipo-receptor-notificacion';
import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class TipoReceptorNotificacionDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoReceptorNotificacion[]> {
        return this.http.get<TipoReceptorNotificacion[]>(
            environment.tanatosService.apiUrl + '/TipoReceptorNotificacion/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean): Observable<TipoReceptorNotificacion[]> {
        return this.http.get<TipoReceptorNotificacion[]>(
            environment.tanatosService.apiUrl + `/TipoReceptorNotificacion/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoReceptorNotificacion): Observable<TipoReceptorNotificacion> {
        return this.http.post<TipoReceptorNotificacion>(
            environment.tanatosService.apiUrl + '/TipoReceptorNotificacion/',
            entrada
        );
    }

    actualizar(entrada: TipoReceptorNotificacion): Observable<TipoReceptorNotificacion> {
        return this.http.put<TipoReceptorNotificacion>(
            environment.tanatosService.apiUrl + '/TipoReceptorNotificacion/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/TipoReceptorNotificacion/${id}`
        );
    }
}
