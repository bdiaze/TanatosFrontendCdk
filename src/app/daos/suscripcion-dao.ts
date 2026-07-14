import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SalSuscripcion } from '../entities/others/sal-suscripcion';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntSuscripcionCrear } from '../entities/others/ent-suscripcion-crear';
import { SalSuscripcionCrear } from '../entities/others/sal-suscripcion-crear';
import { NegocioStore } from '../services/negocio-store';
import { SalSuscripcionResumen } from '../entities/others/sal-suscripcion-resumen';
import { SalNegocioInformacionUsuario } from '../entities/others/sal-negocio-informacion-usuario';

@Injectable({
    providedIn: 'root',
})
export class SuscripcionDao {
    constructor(private readonly http: HttpClient) {}

    negocioStore = inject(NegocioStore);

    obtenerResumen(): Observable<SalSuscripcionResumen> {
        return this.http.get<SalSuscripcionResumen>(environment.tanatosService.apiUrl + `/Suscripcion/Resumen`).pipe(
            tap((r) => {
                const resumenExistente = this.negocioStore.resumenSuscripcionUsuario();
                if (
                    resumenExistente?.nombrePlanEnCurso != r.nombrePlanEnCurso ||
                    resumenExistente?.precioPlanEnCurso != r.precioPlanEnCurso ||
                    resumenExistente?.nombrePlanPagoEnCurso != r.nombrePlanPagoEnCurso ||
                    resumenExistente?.precioPlanPagoEnCurso != r.precioPlanPagoEnCurso ||
                    resumenExistente?.fechaExpiracion != r.fechaExpiracion ||
                    resumenExistente?.fechaProximoCobro != r.fechaProximoCobro ||
                    resumenExistente?.renovacionAutomatica != r.renovacionAutomatica
                ) {
                    this.negocioStore.resumenSuscripcionUsuario.set(r);
                }

                const informacionExistente = this.negocioStore.informacionUsuario();
                if (informacionExistente && informacionExistente.tienePlanEmpresa !== r.tienePlanEmpresa) {
                    this.negocioStore.informacionUsuario.update(
                        (info) =>
                            ({
                                ...info,
                                tienePlanEmpresa: r.tienePlanEmpresa,
                            }) as SalNegocioInformacionUsuario,
                    );
                }
            }),
        );
    }

    crear(entrada: EntSuscripcionCrear): Observable<SalSuscripcionCrear> {
        return this.http.post<SalSuscripcionCrear>(environment.tanatosService.apiUrl + '/Suscripcion/', entrada);
    }

    cancelar(): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Suscripcion/`);
    }
}
