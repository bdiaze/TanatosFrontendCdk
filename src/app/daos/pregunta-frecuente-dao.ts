import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalPreguntaFrecuenteHabilitado } from '../entities/others/sal-pregunta-frecuente-habilitado';
import { environment } from '@/environments/environment';
import { SalPreguntaFrecuente } from '../entities/others/sal-pregunta-frecuente';
import { EntPreguntaFrecuenteCrear } from '../entities/others/ent-pregunta-frecuente-crear';
import { EntPreguntaFrecuenteActualizar } from '../entities/others/ent-pregunta-frecuente-actualizar';

@Injectable({
    providedIn: 'root',
})
export class PreguntaFrecuenteDao {
    constructor(private readonly http: HttpClient) {}

    obtenerHabilitados(): Observable<SalPreguntaFrecuenteHabilitado[]> {
        return this.http.get<SalPreguntaFrecuenteHabilitado[]>(environment.tanatosService.apiUrl + '/public/PreguntaFrecuente/');
    }

    obtenerVigentes(): Observable<SalPreguntaFrecuente[]> {
        return this.http.get<SalPreguntaFrecuente[]>(environment.tanatosService.apiUrl + '/PreguntaFrecuente/Vigentes');
    }

    crear(entrada: EntPreguntaFrecuenteCrear): Observable<SalPreguntaFrecuente> {
        return this.http.post<SalPreguntaFrecuente>(environment.tanatosService.apiUrl + '/PreguntaFrecuente/', entrada);
    }

    actualizar(entrada: EntPreguntaFrecuenteActualizar): Observable<SalPreguntaFrecuente> {
        return this.http.put<SalPreguntaFrecuente>(environment.tanatosService.apiUrl + '/PreguntaFrecuente/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/PreguntaFrecuente/${id}`);
    }
}
