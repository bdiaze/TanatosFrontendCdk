import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SalSuscripcion } from '../entities/others/sal-suscripcion';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntSuscripcionCrear } from '../entities/others/ent-suscripcion-crear';
import { SalSuscripcionCrear } from '../entities/others/sal-suscripcion-crear';
import { NegocioStore } from '../services/negocio-store';

@Injectable({
    providedIn: 'root',
})
export class SuscripcionDao {
    constructor(private readonly http: HttpClient) {}

    negocioStore = inject(NegocioStore);

    obtenerVigentes(): Observable<SalSuscripcion[]> {
        return this.http.get<SalSuscripcion[]>(environment.tanatosService.apiUrl + `/Suscripcion/Vigentes`).pipe(
            tap((v) => {
                if (!this.arraysIguales(v, this.negocioStore.suscripcionesUsuario())) {
                    this.negocioStore.suscripcionesUsuario.set(v);
                }
            }),
        );
    }

    crear(entrada: EntSuscripcionCrear): Observable<SalSuscripcionCrear> {
        return this.http.post<SalSuscripcionCrear>(environment.tanatosService.apiUrl + '/Suscripcion/', entrada);
    }

    cancelar(idSuscripcion: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Suscripcion/${idSuscripcion}`);
    }

    arraysIguales(a: SalSuscripcion[], b: SalSuscripcion[]): boolean {
        if (a.length !== b.length) return false;

        const mapA = new Map(a.map((x) => [x.id, x]));
        return b.every((x) => {
            const original = mapA.get(x.id);
            if (!original) return false;

            return (
                original.idPlan === x.idPlan &&
                original.nombrePlan === x.nombrePlan &&
                original.precioPlan === x.precioPlan &&
                original.duracionMesesPlan === x.duracionMesesPlan &&
                original.fechaInicio === x.fechaInicio &&
                original.fechaExpiracion === x.fechaExpiracion &&
                original.fechaCancelacion === x.fechaCancelacion &&
                original.estado === x.estado &&
                original.tieneFlowSubscriptionId === x.tieneFlowSubscriptionId
            );
        });
    }
}
