import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalInscripcionTemplate } from '../entities/others/sal-inscripcion-template';
import { environment } from '@/environments/environment';
import { EntInscripcionTemplateActivar } from '../entities/others/ent-inscripcion-template-activar';
import { EntInscripcionTemplateDesactivar } from '../entities/others/ent-inscripcion-template-desactivar';

@Injectable({
    providedIn: 'root',
})
export class InscripcionTemplateDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalInscripcionTemplate[]> {
        return this.http.get<SalInscripcionTemplate[]>(
            environment.tanatosService.apiUrl + `/InscripcionTemplate/Vigentes/${idNegocio}`
        );
    }

    activar(entrada: EntInscripcionTemplateActivar): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/InscripcionTemplate/Activar',
            entrada
        );
    }

    desactivar(entrada: EntInscripcionTemplateDesactivar): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/InscripcionTemplate/Desactivar',
            entrada
        );
    }
}
