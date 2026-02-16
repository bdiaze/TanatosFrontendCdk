import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensaje } from '../entities/models/mensaje';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntMensajeIngresar } from '../entities/others/ent-mensaje-ingresar';

@Injectable({
    providedIn: 'root',
})
export class MensajeDao {
    constructor(private http: HttpClient) {}

    obtener(fechaInicial: string, fechaFinal: string): Observable<Mensaje[]> {
        return this.http.get<Mensaje[]>(
            environment.tanatosService.apiUrl + `/Mensaje/${fechaInicial}/${fechaFinal}`,
        );
    }

    ingresar(entrada: EntMensajeIngresar): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/Mensaje/', entrada);
    }

    ingresarAnonimo(entrada: EntMensajeIngresar): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/public/Mensaje/',
            entrada,
        );
    }
}
