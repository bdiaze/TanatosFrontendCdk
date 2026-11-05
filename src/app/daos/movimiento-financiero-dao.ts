import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalMovimientoFinancieroObtenerPorPaginacion } from '../entities/others/sal-movimiento-financiero-obtener-por-paginacion';
import { environment } from '@/environments/environment';
import { EntMovimientoFinancieroCrear } from '../entities/others/ent-movimiento-financiero-crear';
import { SalMovimientoFinanciero } from '../entities/others/sal-movimiento-financiero';
import { EntMovimientoFinancieroActualizar } from '../entities/others/ent-movimiento-financiero-actualizar';

@Injectable({
    providedIn: 'root',
})
export class MovimientoFinancieroDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(
        idNegocio: number,
        idCuentaFinanciera: number,
        fechaDesde: Date,
        fechaHasta: Date,
        primeraFecha: Date | null,
        primerId: number | null,
    ): Observable<SalMovimientoFinancieroObtenerPorPaginacion> {
        let params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        if (primeraFecha !== null) params = params.set('primeraFecha', primeraFecha.toISOString());
        if (primerId !== null) params = params.set('primerId', primerId);

        return this.http.get<SalMovimientoFinancieroObtenerPorPaginacion>(
            environment.tanatosService.apiUrl + `/MovimientoFinanciero/Vigentes/${idNegocio}/${idCuentaFinanciera}`,
            { params },
        );
    }

    exportarCsv(idNegocio: number, idCuentaFinanciera: number, fechaDesde: Date, fechaHasta: Date): Observable<HttpResponse<Blob>> {
        let params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get(environment.tanatosService.apiUrl + `/MovimientoFinanciero/ExportarCsv/${idNegocio}/${idCuentaFinanciera}`, {
            params,
            responseType: 'blob',
            observe: 'response',
        });
    }

    crear(entrada: EntMovimientoFinancieroCrear): Observable<SalMovimientoFinanciero> {
        return this.http.post<SalMovimientoFinanciero>(environment.tanatosService.apiUrl + '/MovimientoFinanciero/', entrada);
    }

    actualizar(entrada: EntMovimientoFinancieroActualizar): Observable<SalMovimientoFinanciero> {
        return this.http.put<SalMovimientoFinanciero>(environment.tanatosService.apiUrl + '/MovimientoFinanciero/', entrada);
    }

    eliminar(idNegocio: number, idCuentaFinanciera: number, idMovimientoFinanciero: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/MovimientoFinanciero/${idNegocio}/${idCuentaFinanciera}/${idMovimientoFinanciero}`);
    }
}
