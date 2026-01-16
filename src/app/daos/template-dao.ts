import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../entities/models/template';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TemplateDao {
    constructor(private http: HttpClient) {}

    obtener(id: number): Observable<Template | null> {
        return this.http.get<Template | null>(
            environment.tanatosService.apiUrl + `/Template/${id}`
        );
    }

    obtenerVigentes(): Observable<Template[]> {
        return this.http.get<Template[]>(environment.tanatosService.apiUrl + '/Template/Vigentes');
    }

    obtenerVigentesConNormas(): Observable<Template[]> {
        return this.http.get<Template[]>(
            environment.tanatosService.apiUrl + '/Template/VigentesConNormas'
        );
    }

    obtenerVigentesConNormasYRecomendacion(idTipoActividad: number): Observable<Template[]> {
        return this.http.get<Template[]>(
            environment.tanatosService.apiUrl +
                `/Template/VigentesConNormasYRecomendacion/${idTipoActividad}`
        );
    }

    obtenerPorVigencia(vigencia: boolean | null): Observable<Template[]> {
        return this.http.get<Template[]>(
            environment.tanatosService.apiUrl + `/Template/PorVigencia/${vigencia}`
        );
    }

    crear(entrada: Template): Observable<Template> {
        return this.http.post<Template>(environment.tanatosService.apiUrl + '/Template/', entrada);
    }

    actualizar(entrada: Template): Observable<Template> {
        return this.http.put<Template>(environment.tanatosService.apiUrl + '/Template/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Template/${id}`);
    }
}
