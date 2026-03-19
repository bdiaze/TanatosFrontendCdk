import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalSuscripcion } from '../entities/others/sal-suscripcion';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntSuscripcionCrear } from '../entities/others/ent-suscripcion-crear';
import { SalSuscripcionCrear } from '../entities/others/sal-suscripcion-crear';

@Injectable({
    providedIn: 'root',
})
export class SuscripcionDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(): Observable<SalSuscripcion[]> {
        return this.http.get<SalSuscripcion[]>(
            environment.tanatosService.apiUrl + `/Suscripcion/Vigentes`,
        );
    }

    crear(entrada: EntSuscripcionCrear): Observable<SalSuscripcionCrear> {
        return this.http.post<SalSuscripcionCrear>(
            environment.tanatosService.apiUrl + '/Suscripcion/',
            entrada,
        );
    }

    cancelar(idSuscripcion: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/Suscripcion/${idSuscripcion}`,
        );
    }
}
