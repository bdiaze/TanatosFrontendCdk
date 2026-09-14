import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalModeloCanvas } from '../entities/others/sal-modelo-canvas';
import { environment } from '@/environments/environment';
import { EntModeloCanvasCrear } from '../entities/others/ent-modelo-canvas-crear';
import { EntModeloCanvasActualizar } from '../entities/others/ent-modelo-canvas-actualizar';

@Injectable({
    providedIn: 'root',
})
export class ModeloCanvasDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalModeloCanvas[]> {
        return this.http.get<SalModeloCanvas[]>(environment.tanatosService.apiUrl + `/ModeloCanvas/Vigentes/${idNegocio}`);
    }

    crear(entrada: EntModeloCanvasCrear): Observable<SalModeloCanvas> {
        return this.http.post<SalModeloCanvas>(environment.tanatosService.apiUrl + '/ModeloCanvas/', entrada);
    }

    actualizar(entrada: EntModeloCanvasActualizar): Observable<SalModeloCanvas> {
        return this.http.put<SalModeloCanvas>(environment.tanatosService.apiUrl + '/ModeloCanvas/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/ModeloCanvas/${id}`);
    }
}
