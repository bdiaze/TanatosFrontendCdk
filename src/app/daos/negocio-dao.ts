import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';
import { EntNegocioCrear } from '../entities/others/ent-negocio-crear';
import { EntNegocioActualizar } from '../entities/others/ent-negocio-actualizar';
import { NegocioStore } from '../services/negocio-store';
import { clearCookie, getCookie, setCookie } from '../helpers/cookie-helper';

@Injectable({
    providedIn: 'root',
})
export class NegocioDao {
    constructor(private http: HttpClient) {}

    negocioStore = inject(NegocioStore);

    obtenerVigentes(): Observable<SalNegocio[]> {
        return this.http
            .get<SalNegocio[]>(environment.tanatosService.apiUrl + '/Negocio/Vigentes')
            .pipe(
                tap((v) => {
                    v = v.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );
                    this.negocioStore.negociosUsuario.set(v);

                    const cookieSeleccionado = getCookie('NegocioSeleccionado');
                    if (cookieSeleccionado) {
                        const encontrado = v.find((x) => x.id === Number(cookieSeleccionado));
                        if (encontrado) {
                            this.negocioStore.negocioSeleccionado.set(encontrado);
                            return;
                        } else {
                            clearCookie('NegocioSeleccionado');
                        }
                    }

                    if (v.length > 0) {
                        this.negocioStore.negocioSeleccionado.set(v[0]);
                        setCookie('NegocioSeleccionado', `${v[0].id}`);
                    }
                })
            );
    }

    crear(entrada: EntNegocioCrear): Observable<SalNegocio> {
        return this.http.post<SalNegocio>(environment.tanatosService.apiUrl + '/Negocio/', entrada);
    }

    actualizar(entrada: EntNegocioActualizar): Observable<SalNegocio> {
        return this.http.put<SalNegocio>(environment.tanatosService.apiUrl + '/Negocio/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Negocio/${id}`);
    }
}
