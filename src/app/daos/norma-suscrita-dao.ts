import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalNormaSuscrita } from '../entities/others/sal-norma-suscrita';
import { EntNormaSuscritaCrear } from '../entities/others/ent-norma-suscrita-crear';
import { EntNormaSuscritaActualizar } from '../entities/others/ent-norma-suscrita-actualizar';
import { SalNormaSuscritaObtenerConVencimiento } from '../entities/others/sal-norma-suscrita-obtener-con-vencimiento';
import { SalNormaSuscritaObtenerPorIdConVencimiento } from '../entities/others/sal-norma-suscrita-obtener-por-id-con-vencimiento';
import { EntNormaSuscritaCompletarNorma } from '../entities/others/ent-norma-suscrita-completar-norma';
import { SalNormaSuscritaCompletarNorma } from '../entities/others/sal-norma-suscrita-completar-norma';

@Injectable({
    providedIn: 'root',
})
export class NormaSuscritaDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalNormaSuscrita[]> {
        return this.http.get<SalNormaSuscrita[]>(
            environment.tanatosService.apiUrl + `/NormaSuscrita/Vigentes/${idNegocio}`,
        );
    }

    obtenerPorId(idNormaSuscrita: number): Observable<SalNormaSuscrita> {
        return this.http.get<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + `/NormaSuscrita/ObtenerPorId/${idNormaSuscrita}`,
        );
    }

    obtenerConVencimiento(idNegocio: number): Observable<SalNormaSuscritaObtenerConVencimiento[]> {
        return this.http.get<SalNormaSuscritaObtenerConVencimiento[]>(
            environment.tanatosService.apiUrl + `/NormaSuscrita/ObtenerConVencimiento/${idNegocio}`,
        );
    }

    obtenerPorIdConVencimiento(
        idNormaSuscrita: number,
        idHistorialNormaSuscrita: number,
    ): Observable<SalNormaSuscritaObtenerPorIdConVencimiento> {
        return this.http.get<SalNormaSuscritaObtenerPorIdConVencimiento>(
            environment.tanatosService.apiUrl +
                `/NormaSuscrita/ObtenerPorIdConVencimiento/${idNormaSuscrita}/${idHistorialNormaSuscrita}`,
        );
    }

    crear(entrada: EntNormaSuscritaCrear): Observable<SalNormaSuscrita> {
        return this.http.post<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + '/NormaSuscrita/',
            entrada,
        );
    }

    actualizar(entrada: EntNormaSuscritaActualizar): Observable<SalNormaSuscrita> {
        return this.http.put<SalNormaSuscrita>(
            environment.tanatosService.apiUrl + '/NormaSuscrita/',
            entrada,
        );
    }

    completarNorma(
        entrada: EntNormaSuscritaCompletarNorma,
    ): Observable<SalNormaSuscritaCompletarNorma> {
        return this.http.put<SalNormaSuscritaCompletarNorma>(
            environment.tanatosService.apiUrl + '/NormaSuscrita/CompletarNorma',
            entrada,
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/NormaSuscrita/${id}`);
    }
}
