import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalEvaluacion } from '../entities/others/sal-evaluacion';
import { environment } from '@/environments/environment';
import { EntEvaluacionCrear } from '../entities/others/ent-evaluacion-crear';
import { SalEvaluacionCrear } from '../entities/others/sal-evaluacion-crear';

@Injectable({
    providedIn: 'root',
})
export class EvaluacionDao {
    constructor(private readonly http: HttpClient) {}

    obtener(fechaDesde: Date, fechaHasta: Date): Observable<SalEvaluacion[]> {
        const params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get<SalEvaluacion[]>(environment.tanatosService.apiUrl + `/Evaluacion/`, { params });
    }

    crear(entrada: EntEvaluacionCrear): Observable<SalEvaluacionCrear> {
        return this.http.post<SalEvaluacionCrear>(environment.tanatosService.apiUrl + '/Evaluacion/', entrada);
    }
}
