import { PerfilDao } from '@/app/daos/perfil-dao';
import { EntPerfilValidarWhatsapp } from '@/app/entities/others/ent-perfil-validar-whatsapp';
import { getErrorMessage } from '@/app/helpers/error-message';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCirclePlus, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { combineLatest, map } from 'rxjs';
import { HlmH2, HlmH4 } from '@spartan-ng/helm/typography';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
    selector: 'app-validar-whatsapp',
    imports: [NgIcon, HlmIcon, HlmAlertImports, HlmSpinnerImports, HlmH2, HlmH4, HlmButtonImports, HlmSeparatorImports],
    templateUrl: './validar-whatsapp.html',
    styleUrl: './validar-whatsapp.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideMessageCirclePlus,
        }),
    ],
})
export class ValidarWhatsapp {
    private readonly route = inject(ActivatedRoute);
    readonly routeParams = toSignal(
        combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
            map(([params, queryParams]) => ({
                idWhatsappUsuario: params.get('idWhatsappUsuario'),
                codigoAcceso: queryParams.get('codigo'),
            })),
        ),
    );

    private readonly perfilDao = inject(PerfilDao);

    private readonly idWhatsappUsuario = signal<number | null>(null);
    private readonly codigoAcceso = signal<string | null>(null);

    constructor() {
        effect(() => {
            const routeParams = this.routeParams();
            untracked(() => {
                if (routeParams && routeParams.idWhatsappUsuario && routeParams.codigoAcceso) {
                    this.idWhatsappUsuario.set(Number(routeParams.idWhatsappUsuario));
                    this.codigoAcceso.set(routeParams.codigoAcceso);
                }
            });
        });
    }

    error = signal<string>('');
    validandoWhatsapp = signal(false);
    whatsappValidadoOk = signal(false);
    validarWhatsapp() {
        this.validandoWhatsapp.set(true);
        this.perfilDao
            .validarWhatsapp({
                idWhatsappUsuario: this.idWhatsappUsuario(),
                codigoAcceso: this.codigoAcceso(),
            } as EntPerfilValidarWhatsapp)
            .subscribe({
                next: () => {
                    this.whatsappValidadoOk.set(true);
                },
                error: (err) => {
                    console.error('Error al validar el número de WhatsApp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al validar el número de WhatsApp');
                },
            })
            .add(() => {
                this.validandoWhatsapp.set(false);
            });
    }
}
