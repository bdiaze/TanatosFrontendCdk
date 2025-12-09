import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaNorma } from '../entities/models/categoria-norma';

@Injectable({
    providedIn: 'root',
})
export class CategoriaNormaDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<CategoriaNorma[]> {
        return this.http.get<CategoriaNorma[]>(
            environment.tanatosService.apiUrl + '/CategoriaNorma/Vigentes'
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<CategoriaNorma[]> {
        return this.http.get<CategoriaNorma[]>(
            environment.tanatosService.apiUrl + `/CategoriaNorma/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: CategoriaNorma): Observable<CategoriaNorma> {
        return this.http.post<CategoriaNorma>(
            environment.tanatosService.apiUrl + '/CategoriaNorma/',
            entrada
        );
    }

    actualizar(entrada: CategoriaNorma): Observable<CategoriaNorma> {
        return this.http.put<CategoriaNorma>(
            environment.tanatosService.apiUrl + '/CategoriaNorma/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/CategoriaNorma/${id}`);
    }
}
