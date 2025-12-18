import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalNormaSuscrita } from '../entities/others/sal-norma-suscrita';
import { EntNormaSuscritaCrear } from '../entities/others/ent-norma-suscrita-crear';
import { EntNormaSuscritaActualizar } from '../entities/others/ent-norma-suscrita-actualizar';

@Injectable({
    providedIn: 'root',
})
export class NormaSuscritaDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalNormaSuscrita[]> {
        return this.http.get<SalNormaSuscrita[]>(
            environment.tanatosService.apiUrl + `/NormaSuscrita/Vigentes/${idNegocio}`
        );
    }

    obtenerPorId(idNormaSuscrita: number): Observable<SalNormaSuscrita> {
        return this.http.get<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + `/NormaSuscrita/ObtenerPorId/${idNormaSuscrita}`
        );
    }

    crear(entrada: EntNormaSuscritaCrear): Observable<SalNormaSuscrita> {
        return this.http.post<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + '/NormaSuscrita/',
            entrada
        );
    }

    actualizar(entrada: EntNormaSuscritaActualizar): Observable<SalNormaSuscrita> {
        return this.http.put<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + '/NormaSuscrita/',
            entrada
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/NormaSuscrita/${id}`);
    }
}
