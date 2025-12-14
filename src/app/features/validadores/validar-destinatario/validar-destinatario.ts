import { DestinatarioNotificacionDao } from '@/app/daos/destinatario-notificacion-dao';
import { EntDestinatarioNotificacionValidar } from '@/app/entities/others/ent-destinatario-notificacion-validar';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH2, HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-validar-destinatario',
    imports: [
        HlmButtonImports,
        HlmH2,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmSpinnerImports,
        HlmSeparatorImports,
    ],
    templateUrl: './validar-destinatario.html',
    styleUrl: './validar-destinatario.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideSend })],
    host: {
        class: 'inline-block h-full w-full',
    },
})
export class ValidarDestinatario implements OnInit {
    private route = inject(ActivatedRoute);
    private destinatarioNotificacionDao = inject(DestinatarioNotificacionDao);

    private codigoValidacion: string | undefined;

    procesando = signal<boolean>(false);
    error = signal<string>('');
    exito = signal<boolean>(false);

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.codigoValidacion = params['codigo'];
        });
    }

    validarCodigo() {
        if (!this.codigoValidacion) {
            return;
        }

        this.procesando.set(true);

        const entrada: EntDestinatarioNotificacionValidar = {
            codigoValidacion: this.codigoValidacion,
        };

        this.destinatarioNotificacionDao
            .validarDestinatario(entrada)
            .subscribe({
                next: (res) => {
                    this.exito.set(true);
                },
                error: (err) => {
                    this.error.set(
                        err.error ??
                            'Ocurrió un error al registrarlo como destinatario, intente nuevamente...'
                    );
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
    }
}
