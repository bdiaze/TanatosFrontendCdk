import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalDocumentoAdjunto } from '../entities/others/sal-documento-adjunto';
import { environment } from '@/environments/environment';
import { SalDocumentoAdjuntoGenerarUrlSubida } from '../entities/others/sal-documento-adjunto-generar-url-subida';
import { EntDocumentoAdjuntoGenerarUrlSubida } from '../entities/others/ent-documento-adjunto-generar-url-subida';
import { EntDocumentoAdjuntoConfirmarSubida } from '../entities/others/ent-documento-adjunto-confirmar-subida';
import { EntDocumentoAdjuntoGenerarUrlBajada } from '../entities/others/ent-documento-adjunto-generar-url-bajada';
import { SalDocumentoAdjuntoGenerarUrlBajada } from '../entities/others/sal-documento-adjunto-generar-url-bajada';

@Injectable({
    providedIn: 'root',
})
export class DocumentoAdjuntoDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idHistorialNormaSuscrita: number): Observable<SalDocumentoAdjunto[]> {
        return this.http.get<SalDocumentoAdjunto[]>(
            environment.tanatosService.apiUrl +
                `/DocumentoAdjunto/Vigentes/${idHistorialNormaSuscrita}`,
        );
    }

    generarUrlSubida(
        entrada: EntDocumentoAdjuntoGenerarUrlSubida,
    ): Observable<SalDocumentoAdjuntoGenerarUrlSubida> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlSubida>(
            environment.tanatosService.apiUrl + '/DocumentoAdjunto/GenerarUrlSubida',
            entrada,
        );
    }

    confirmarSubida(entrada: EntDocumentoAdjuntoConfirmarSubida): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/DocumentoAdjunto/ConfirmarSubida',
            entrada,
        );
    }

    generarUrlBajada(
        entrada: EntDocumentoAdjuntoGenerarUrlBajada,
    ): Observable<SalDocumentoAdjuntoGenerarUrlBajada> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlBajada>(
            environment.tanatosService.apiUrl + '/DocumentoAdjunto/GenerarUrlBajada',
            entrada,
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/DocumentoAdjunto/${id}`,
        );
    }
}
