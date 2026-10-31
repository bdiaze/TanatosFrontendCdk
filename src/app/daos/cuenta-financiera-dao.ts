import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalCuentaFinanciera } from '../entities/others/sal-cuenta-financiera';
import { environment } from '@/environments/environment';
import { EntCuentaFinancieraCrear } from '../entities/others/ent-cuenta-financiera-crear';
import { EntCuentaFinancieraActualizar } from '../entities/others/ent-cuenta-financiera-actualizar';

@Injectable({
    providedIn: 'root',
})
export class CuentaFinancieraDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalCuentaFinanciera[]> {
        return this.http.get<SalCuentaFinanciera[]>(environment.tanatosService.apiUrl + `/CuentaFinanciera/Vigentes/${idNegocio}`);
    }

    crear(entrada: EntCuentaFinancieraCrear): Observable<SalCuentaFinanciera> {
        return this.http.post<SalCuentaFinanciera>(environment.tanatosService.apiUrl + '/CuentaFinanciera/', entrada);
    }

    actualizar(entrada: EntCuentaFinancieraActualizar): Observable<SalCuentaFinanciera> {
        return this.http.put<SalCuentaFinanciera>(environment.tanatosService.apiUrl + '/CuentaFinanciera/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/CuentaFinanciera/${id}`);
    }
}
