import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoPeriodicidad } from '../entities/models/tipo-periodicidad';

@Injectable({
    providedIn: 'root',
})
export class TipoPeriodicidadDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoPeriodicidad[]> {
        return this.http.get<TipoPeriodicidad[]>(
            environment.tanatosService.apiUrl + '/TipoPeriodicidad/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<TipoPeriodicidad[]> {
        return this.http.get<TipoPeriodicidad[]>(
            environment.tanatosService.apiUrl + `/TipoPeriodicidad/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoPeriodicidad): Observable<TipoPeriodicidad> {
        return this.http.post<TipoPeriodicidad>(
            environment.tanatosService.apiUrl + '/TipoPeriodicidad/',
            entrada
        );
    }

    actualizar(entrada: TipoPeriodicidad): Observable<TipoPeriodicidad> {
        return this.http.put<TipoPeriodicidad>(
            environment.tanatosService.apiUrl + '/TipoPeriodicidad/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/TipoPeriodicidad/${id}`
        );
    }
}
