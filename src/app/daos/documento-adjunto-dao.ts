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
import { EntDocumentoAdjuntoGenerarUrlSubidaPorCodigoAcceso } from '../entities/others/ent-documento-adjunto-generar-url-subida-por-codigo-acceso';
import { EntDocumentoAdjuntoConfirmarSubidaPorCodigoAcceso } from '../entities/others/ent-documento-adjunto-confirmar-subida-por-codigo-acceso';
import { EntDocumentoAdjuntoGenerarUrlBajadaPorCodigoAcceso } from '../entities/others/ent-documento-adjunto-generar-url-bajada-por-codigo-acceso';

@Injectable({
    providedIn: 'root',
})
export class DocumentoAdjuntoDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idHistorialNormaSuscrita: number): Observable<SalDocumentoAdjunto[]> {
        return this.http.get<SalDocumentoAdjunto[]>(environment.tanatosService.apiUrl + `/DocumentoAdjunto/Vigentes/${idHistorialNormaSuscrita}`);
    }

    generarUrlSubida(entrada: EntDocumentoAdjuntoGenerarUrlSubida): Observable<SalDocumentoAdjuntoGenerarUrlSubida> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlSubida>(environment.tanatosService.apiUrl + '/DocumentoAdjunto/GenerarUrlSubida', entrada);
    }

    generarUrlSubidaPorCodigoAcceso(entrada: EntDocumentoAdjuntoGenerarUrlSubidaPorCodigoAcceso): Observable<SalDocumentoAdjuntoGenerarUrlSubida> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlSubida>(
            environment.tanatosService.apiUrl + '/public/DocumentoAdjunto/GenerarUrlSubidaPorCodigoAcceso',
            entrada,
        );
    }

    confirmarSubida(entrada: EntDocumentoAdjuntoConfirmarSubida): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/DocumentoAdjunto/ConfirmarSubida', entrada);
    }

    confirmarSubidaPorCodigoAcceso(entrada: EntDocumentoAdjuntoConfirmarSubidaPorCodigoAcceso): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/DocumentoAdjunto/ConfirmarSubidaPorCodigoAcceso', entrada);
    }

    generarUrlBajada(entrada: EntDocumentoAdjuntoGenerarUrlBajada): Observable<SalDocumentoAdjuntoGenerarUrlBajada> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlBajada>(environment.tanatosService.apiUrl + '/DocumentoAdjunto/GenerarUrlBajada', entrada);
    }

    generarUrlBajadaPorCodigoAcceso(entrada: EntDocumentoAdjuntoGenerarUrlBajadaPorCodigoAcceso): Observable<SalDocumentoAdjuntoGenerarUrlBajada> {
        return this.http.post<SalDocumentoAdjuntoGenerarUrlBajada>(
            environment.tanatosService.apiUrl + '/public/DocumentoAdjunto/GenerarUrlBajadaPorCodigoAcceso',
            entrada,
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/DocumentoAdjunto/${id}`);
    }

    eliminarPorCodigoAcceso(codigoAcceso: string, id: number): Observable<void> {
        return this.http.delete<void>(
            environment.tanatosService.apiUrl + `/public/DocumentoAdjunto/PorCodigoAcceso/${id}?codigoAcceso=${encodeURIComponent(codigoAcceso)}`,
        );
    }
}
