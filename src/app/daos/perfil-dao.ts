import { inject, Injectable } from '@angular/core';
import { EntPerfilConfirmarRegistro } from '../entities/others/ent-perfil-confirmar-registro';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntPerfilReenviarCodigoVerificacion } from '../entities/others/ent-perfil-reenviar-codigo-verificacion';
import { EntPerfilValidarWhatsapp } from '../entities/others/ent-perfil-validar-whatsapp';
import { EntPerfilActualizarWhatsapp } from '../entities/others/ent-perfil-actualizar-whatsapp';
import { SalPerfil } from '../entities/others/sal-perfil';
import { NegocioStore } from '../services/negocio-store';

@Injectable({
    providedIn: 'root',
})
export class PerfilDao {
    constructor(private readonly http: HttpClient) {}

    negocioStore = inject(NegocioStore);

    obtener(): Observable<SalPerfil> {
        return this.http.get<SalPerfil>(environment.tanatosService.apiUrl + '/Perfil/').pipe(
            tap((v) => {
                const informacionExistente = this.negocioStore.informacionUsuario();
                if (
                    v.nombre !== informacionExistente?.nombre ||
                    v.apellido !== informacionExistente?.apellido ||
                    v.email !== informacionExistente?.email ||
                    v.whatsapp !== informacionExistente?.whatsapp ||
                    v.whatsappValidado !== informacionExistente?.whatsappValidado ||
                    v.tienePlanEmpresa !== informacionExistente?.tienePlanEmpresa
                ) {
                    this.negocioStore.informacionUsuario.set(v);
                }
            }),
        );
    }

    actualizarWhatsapp(entrada: EntPerfilActualizarWhatsapp): Observable<void> {
        return this.http.put<void>(environment.tanatosService.apiUrl + '/Perfil/Whatsapp', entrada);
    }

    validarWhatsapp(entrada: EntPerfilValidarWhatsapp): Observable<void> {
        return this.http.put<void>(environment.tanatosService.apiUrl + '/public/Perfil/ValidarWhatsapp', entrada);
    }

    confirmarRegistro(entrada: EntPerfilConfirmarRegistro): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/Perfil/ConfirmarRegistro', entrada);
    }

    reenviarCodigoVerificacion(entrada: EntPerfilReenviarCodigoVerificacion): Observable<void> {
        return this.http.post<void>(environment.tanatosService.apiUrl + '/public/Perfil/ReenviarCodigoVerificacion', entrada);
    }
}
