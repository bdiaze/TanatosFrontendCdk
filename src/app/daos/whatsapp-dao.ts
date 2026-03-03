import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalWhatsappConversacion } from '../entities/others/sal-whatsapp-conversacion';
import { environment } from '@/environments/environment';
import { SalWhatsappMensaje } from '../entities/others/sal-whatsapp-mensaje';
import { SalWhatsappMedia } from '../entities/others/sal-whatsapp-media';
import { SalWhatsappEnviar } from '../entities/others/sal-whatsapp-enviar';
import { EntWhatsappEnviar } from '../entities/others/ent-whatsapp-enviar';

@Injectable({
    providedIn: 'root',
})
export class WhatsappDao {
    constructor(private http: HttpClient) {}

    obtenerConversaciones(
        desde: Date | null = null,
        hasta: Date | null = null,
    ): Observable<SalWhatsappConversacion[]> {
        const params = new HttpParams();
        if (desde) {
            params.set('desde', desde.toISOString());
        }
        if (hasta) {
            params.set('hasta', hasta.toISOString());
        }

        return this.http.get<SalWhatsappConversacion[]>(
            environment.tanatosService.apiUrl + '/Whatsapp/Conversaciones',
            { params },
        );
    }

    obtenerMensajes(
        numeroTelefono: string,
        desde: Date | null = null,
        hasta: Date | null = null,
    ): Observable<SalWhatsappMensaje[]> {
        const params = new HttpParams().set('numeroTelefono', numeroTelefono);
        if (desde) {
            params.set('desde', desde.toISOString());
        }
        if (hasta) {
            params.set('hasta', hasta.toISOString());
        }

        return this.http.get<SalWhatsappMensaje[]>(
            environment.tanatosService.apiUrl + '/Whatsapp/Mensajes',
            { params },
        );
    }

    obtenerMedia(whatsappMessageId: string): Observable<SalWhatsappMedia> {
        const params = new HttpParams().set('whatsappMessageId', whatsappMessageId);

        return this.http.get<SalWhatsappMedia>(
            environment.tanatosService.apiUrl + '/Whatsapp/Media',
            { params },
        );
    }

    enviar(para: string, cuerpo: string): Observable<SalWhatsappEnviar> {
        const entrada: EntWhatsappEnviar = {
            para,
            cuerpo,
        };

        return this.http.post<SalWhatsappEnviar>(
            environment.tanatosService.apiUrl + '/Whatsapp/Enviar',
            entrada,
        );
    }
}
