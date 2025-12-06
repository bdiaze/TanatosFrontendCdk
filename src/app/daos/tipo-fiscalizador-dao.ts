import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoFiscalizador } from '../entities/models/tipo-fiscalizador';

@Injectable({
    providedIn: 'root',
})
export class TipoFiscalizadorDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoFiscalizador[]> {
        return this.http.get<TipoFiscalizador[]>(
            environment.tanatosService.apiUrl + '/TipoFiscalizador/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean): Observable<TipoFiscalizador[]> {
        return this.http.get<TipoFiscalizador[]>(
            environment.tanatosService.apiUrl + `/TipoFiscalizador/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoFiscalizador): Observable<TipoFiscalizador> {
        return this.http.post<TipoFiscalizador>(
            environment.tanatosService.apiUrl + '/TipoFiscalizador/',
            entrada
        );
    }

    actualizar(entrada: TipoFiscalizador): Observable<TipoFiscalizador> {
        return this.http.put<TipoFiscalizador>(
            environment.tanatosService.apiUrl + '/TipoFiscalizador/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/TipoFiscalizador/${id}`
        );
    }
}
