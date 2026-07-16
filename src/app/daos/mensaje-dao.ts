import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EntMensajeIngresar } from '../entities/others/ent-mensaje-ingresar';
import { SalMensaje } from '../entities/others/sal-mensaje';

@Injectable({
    providedIn: 'root',
})
export class MensajeDao {
    constructor(private readonly http: HttpClient) {}

    obtener(fechaDesde: Date, fechaHasta: Date): Observable<SalMensaje[]> {
        const params = new HttpParams().set('fechaDesde', fechaDesde.toISOString()).set('fechaHasta', fechaHasta.toISOString());
        return this.http.get<SalMensaje[]>(environment.tanatosService.apiUrl + `/Mensaje`, { params });
    }

    ingresar(entrada: EntMensajeIngresar): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/Mensaje/', entrada);
    }

    ingresarAnonimo(entrada: EntMensajeIngresar): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/Mensaje/', entrada);
    }
}
