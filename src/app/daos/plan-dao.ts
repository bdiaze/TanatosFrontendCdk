import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalPlan } from '../entities/others/sal-plan';
import { environment } from '@/environments/environment';
import { Plan } from '../entities/models/plan';
import { EntPlanCrearEditar } from '../entities/others/ent-plan-crear-editar';

@Injectable({
    providedIn: 'root',
})
export class PlanDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<SalPlan[]> {
        return this.http.get<SalPlan[]>(environment.tanatosService.apiUrl + '/Plan/Vigentes');
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<Plan[]> {
        return this.http.get<Plan[]>(
            environment.tanatosService.apiUrl + `/Plan/PorVigencia/${vigencia}`,
        );
    }

    crear(entrada: EntPlanCrearEditar): Observable<Plan> {
        return this.http.post<Plan>(environment.tanatosService.apiUrl + '/Plan/', entrada);
    }

    actualizar(entrada: EntPlanCrearEditar): Observable<Plan> {
        return this.http.put<Plan>(environment.tanatosService.apiUrl + '/Plan/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Plan/${id}`);
    }
}
