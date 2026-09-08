import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalProcesoAutomaticoObtenerPorPaginacion } from '../entities/others/sal-proceso-automatico-obtener-por-paginacion';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProcesoAutomaticoDao {
    constructor(private readonly http: HttpClient) {}

    obtenerConPaginacion(
        primerId: number | null,
        cantidad: number | null,
        nombre: string | null,
        vigencia: boolean | null,
    ): Observable<SalProcesoAutomaticoObtenerPorPaginacion> {
        let params = new HttpParams();
        if (primerId !== null) params = params.set('primerId', primerId);
        if (cantidad !== null) params = params.set('cantidad', cantidad);
        if (nombre !== null) params = params.set('nombre', nombre);
        if (vigencia !== null) params = params.set('vigencia', vigencia);

        return this.http.get<SalProcesoAutomaticoObtenerPorPaginacion>(environment.tanatosService.apiUrl + '/ProcesoAutomatico/ObtenerConPaginacion', {
            params,
        });
    }
}
