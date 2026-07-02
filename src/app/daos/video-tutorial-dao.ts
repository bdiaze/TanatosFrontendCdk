import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalVideoTutorialHabilitado } from '../entities/others/sal-video-tutorial-habilitado';
import { environment } from '@/environments/environment';
import { SalVideoTutorial } from '../entities/others/sal-video-tutorial';
import { EntVideoTutorialCrear } from '../entities/others/ent-video-tutorial-crear';
import { EntVideoTutorialActualizar } from '../entities/others/ent-video-tutorial-actualizar';

@Injectable({
    providedIn: 'root',
})
export class VideoTutorialDao {
    constructor(private readonly http: HttpClient) {}

    obtenerHabilitados(): Observable<SalVideoTutorialHabilitado[]> {
        return this.http.get<SalVideoTutorialHabilitado[]>(environment.tanatosService.apiUrl + '/public/VideoTutorial/');
    }

    obtenerVigentes(): Observable<SalVideoTutorial[]> {
        return this.http.get<SalVideoTutorial[]>(environment.tanatosService.apiUrl + '/VideoTutorial/Vigentes');
    }

    crear(entrada: EntVideoTutorialCrear): Observable<SalVideoTutorial> {
        return this.http.post<SalVideoTutorial>(environment.tanatosService.apiUrl + '/VideoTutorial/', entrada);
    }

    actualizar(entrada: EntVideoTutorialActualizar): Observable<SalVideoTutorial> {
        return this.http.put<SalVideoTutorial>(environment.tanatosService.apiUrl + '/VideoTutorial/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/VideoTutorial/${id}`);
    }
}
