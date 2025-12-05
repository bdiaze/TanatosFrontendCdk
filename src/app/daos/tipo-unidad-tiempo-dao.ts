import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoReceptorNotificacion } from '../entities/models/tipo-receptor-notificacion';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TipoUnidadTiempoDao {
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
