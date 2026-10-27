import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalTipoCuentaFinanciera } from '../entities/others/sal-tipo-cuenta-financiera';
import { environment } from '@/environments/environment';
import { TipoCuentaFinanciera } from '../entities/models/tipo-cuenta-financiera';

@Injectable({
    providedIn: 'root',
})
export class TipoCuentaFinancieraDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(): Observable<SalTipoCuentaFinanciera[]> {
        return this.http.get<SalTipoCuentaFinanciera[]>(environment.tanatosService.apiUrl + '/TipoCuentaFinanciera/Vigentes');
    }

    obtenerTodos(): Observable<TipoCuentaFinanciera[]> {
        return this.http.get<TipoCuentaFinanciera[]>(environment.tanatosService.apiUrl + '/TipoCuentaFinanciera/');
    }

    crear(entrada: TipoCuentaFinanciera): Observable<TipoCuentaFinanciera> {
        return this.http.post<TipoCuentaFinanciera>(environment.tanatosService.apiUrl + '/TipoCuentaFinanciera/', entrada);
    }

    actualizar(entrada: TipoCuentaFinanciera): Observable<TipoCuentaFinanciera> {
        return this.http.put<TipoCuentaFinanciera>(environment.tanatosService.apiUrl + '/TipoCuentaFinanciera/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/TipoCuentaFinanciera/${id}`);
    }
}
