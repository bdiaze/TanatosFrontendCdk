import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoRubro } from '../entities/models/tipo-rubro';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TipoRubroDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<TipoRubro[]> {
        return this.http.get<TipoRubro[]>(
            environment.tanatosService.apiUrl + '/TipoRubro/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<TipoRubro[]> {
        return this.http.get<TipoRubro[]>(
            environment.tanatosService.apiUrl + `/TipoRubro/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: TipoRubro): Observable<TipoRubro> {
        return this.http.post<TipoRubro>(
            environment.tanatosService.apiUrl + '/TipoRubro/',
            entrada
        );
    }

    actualizar(entrada: TipoRubro): Observable<TipoRubro> {
        return this.http.put<TipoRubro>(environment.tanatosService.apiUrl + '/TipoRubro/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/TipoRubro/${id}`);
    }
}
