import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { SalTipoProcesoAutomatico } from '../entities/others/sal-tipo-proceso-automatico';
import { EntTipoProcesoAutomaticoCrear } from '../entities/others/ent-tipo-proceso-automatico-crear';
import { EntTipoProcesoAutomaticoActualizar } from '../entities/others/ent-tipo-proceso-automatico-actualizar';

@Injectable({
    providedIn: 'root',
})
export class TipoProcesoAutomaticoDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(): Observable<SalTipoProcesoAutomatico[]> {
        return this.http.get<SalTipoProcesoAutomatico[]>(environment.tanatosService.apiUrl + '/TipoProcesoAutomatico/Vigentes');
    }

    crear(entrada: EntTipoProcesoAutomaticoCrear): Observable<SalTipoProcesoAutomatico> {
        return this.http.post<SalTipoProcesoAutomatico>(environment.tanatosService.apiUrl + '/TipoProcesoAutomatico/', entrada);
    }

    actualizar(entrada: EntTipoProcesoAutomaticoActualizar): Observable<SalTipoProcesoAutomatico> {
        return this.http.put<SalTipoProcesoAutomatico>(environment.tanatosService.apiUrl + '/TipoProcesoAutomatico/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/TipoProcesoAutomatico/${id}`);
    }
}
