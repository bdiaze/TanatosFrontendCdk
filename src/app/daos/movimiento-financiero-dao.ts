import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalMovimientoFinancieroObtenerPorPaginacion } from '../entities/others/sal-movimiento-financiero-obtener-por-paginacion';
import { environment } from '@/environments/environment';
import { EntMovimientoFinancieroCrear } from '../entities/others/ent-movimiento-financiero-crear';
import { SalMovimientoFinanciero } from '../entities/others/sal-movimiento-financiero';
import { EntMovimientoFinancieroActualizar } from '../entities/others/ent-movimiento-financiero-actualizar';
import { TotalIngresosGastos } from '../entities/others/total-ingresos-gastos';
import { IngresosGastosPorPeriodo } from '../entities/others/ingresos-gastos-por-periodo';
import { IngresosGastosPorCategoria } from '../entities/others/ingresos-gastos-por-categoria';

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

    obtenerTotalIngresosGastos(idNegocio: number, fechaDesde: Date, fechaHasta: Date): Observable<TotalIngresosGastos> {
        let params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get<TotalIngresosGastos>(environment.tanatosService.apiUrl + `/MovimientoFinanciero/TotalIngresosGastos/${idNegocio}`, { params });
    }

    obtenerIngresosGastosPorPeriodo(idNegocio: number, fechaDesde: Date, fechaHasta: Date): Observable<IngresosGastosPorPeriodo[]> {
        let params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get<IngresosGastosPorPeriodo[]>(environment.tanatosService.apiUrl + `/MovimientoFinanciero/IngresosGastosPorPeriodo/${idNegocio}`, {
            params,
        });
    }

    obtenerIngresosGastosPorCategoria(idNegocio: number, fechaDesde: Date, fechaHasta: Date): Observable<IngresosGastosPorCategoria[]> {
        let params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get<IngresosGastosPorCategoria[]>(
            environment.tanatosService.apiUrl + `/MovimientoFinanciero/IngresosGastosPorCategoria/${idNegocio}`,
            { params },
        );
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
