import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
import { TipoUnidadTiempo } from '../entities/models/tipo-unidad-tiempo';

@Injectable({
    providedIn: 'root',
})
export class TipoUnidadTiempoDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoUnidadTiempo[]> {
        return this.http.get<TipoUnidadTiempo[]>(
            environment.tanatosService.apiUrl + '/TipoUnidadTiempo/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<TipoUnidadTiempo[]> {
        return this.http.get<TipoUnidadTiempo[]>(
            environment.tanatosService.apiUrl + `/TipoUnidadTiempo/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoUnidadTiempo): Observable<TipoUnidadTiempo> {
        return this.http.post<TipoUnidadTiempo>(
            environment.tanatosService.apiUrl + '/TipoUnidadTiempo/',
            entrada
        );
    }

    actualizar(entrada: TipoUnidadTiempo): Observable<TipoUnidadTiempo> {
        return this.http.put<TipoUnidadTiempo>(
            environment.tanatosService.apiUrl + '/TipoUnidadTiempo/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/TipoUnidadTiempo/${id}`
        );
    }
}
