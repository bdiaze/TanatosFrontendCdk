import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoActividad } from '../entities/models/tipo-actividad';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TipoActividadDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoActividad[]> {
        return this.http.get<TipoActividad[]>(
            environment.tanatosService.apiUrl + '/TipoActividad/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<TipoActividad[]> {
        return this.http.get<TipoActividad[]>(
            environment.tanatosService.apiUrl + `/TipoActividad/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoActividad): Observable<TipoActividad> {
        return this.http.post<TipoActividad>(
            environment.tanatosService.apiUrl + '/TipoActividad/',
            entrada
        );
    }

    actualizar(entrada: TipoActividad): Observable<TipoActividad> {
        return this.http.put<TipoActividad>(
            environment.tanatosService.apiUrl + '/TipoActividad/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/TipoActividad/${id}`);
    }
}
