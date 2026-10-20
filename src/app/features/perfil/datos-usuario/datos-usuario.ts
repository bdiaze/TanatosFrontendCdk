import { PerfilDao } from '@/app/daos/perfil-dao';
import { formatearTelefono, FormatoTelefono } from '@/app/directives/formato-telefono';
import { EntPerfilActualizarWhatsapp } from '@/app/entities/others/ent-perfil-actualizar-whatsapp';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { NgClass } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideClockAlert, lucidePhone, lucideSave, lucideTriangleAlert, lucideUserRound, lucideUserRoundPen } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

@Component({
    selector: 'app-datos-usuario',
    imports: [
        HlmH3,
        HlmH4,
        HlmP,
        HlmSpinnerImports,
        HlmSkeletonImports,
        NgIcon,
        HlmIcon,
        HlmAlertImports,
        HlmBreadcrumbImports,
        ReactiveFormsModule,
        HlmLabelImports,
        HlmFieldImports,
        HlmInputImports,
        HlmInputGroupImports,
        HlmButtonImports,
        HlmButtonGroupImports,
        HlmTooltipImports,
        FormatoTelefono,
        NgClass,
    ],
    templateUrl: './datos-usuario.html',
    styleUrl: './datos-usuario.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideUserRoundPen, lucideSave, lucideUserRound, lucidePhone, lucideBadgeCheck, lucideClockAlert })],
})
export class DatosUsuario {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly tourService = inject(TourService);
    private readonly perfilDao = inject(PerfilDao);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    readonly negocioStore = inject(NegocioStore);

    error = signal<string>('');

    constructor() {
        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });

        effect(() => {
            const whatsapp = this.negocioStore.informacionUsuario()?.whatsapp;
            untracked(() => {
                this.whatsappForm.controls.whatsapp.setValue(formatearTelefono(whatsapp ?? ''));
            });
        });

        effect(() => {
            const obteniendo = this.obteniendoPerfil();
            const actualizando = this.actualizandoWhatsapp();
            untracked(() => {
                if (obteniendo || actualizando) {
                    this.whatsappForm.controls.whatsapp.disable();
                } else {
                    this.whatsappForm.controls.whatsapp.enable();
                }
            });
        });
    }

    whatsappForm = new FormGroup({
        whatsapp: new FormControl<string | null>(null),
    });

    obteniendoPerfil = signal<boolean>(false);
    obtenerPerfil() {
        this.obteniendoPerfil.set(true);
        this.perfilDao
            .obtener()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({})
            .add(() => {
                this.obteniendoPerfil.set(false);
            });
    }

    actualizandoWhatsapp = signal(false);
    actualizarWhatsapp() {
        let whatsapp = this.whatsappForm.controls.whatsapp.value;
        whatsapp = whatsapp?.replaceAll(' ', '') ?? null;
        if (whatsapp?.length === 0) whatsapp = null;

        this.actualizandoWhatsapp.set(true);
        this.perfilDao
            .actualizarWhatsapp({
                whatsapp: whatsapp,
            } as EntPerfilActualizarWhatsapp)
            .subscribe({
                next: () => {
                    this.obtenerPerfil();
                },
                error: (err) => {
                    console.error('Error al actualizar el número de WhatsApp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al actualizar el número de WhatsApp');
                },
            })
            .add(() => {
                this.actualizandoWhatsapp.set(false);
            });
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Misión, Visión y Valores',
                    description: 'Ahora que ya estamos en Misión, Visión y Valores, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Misión, Visión y Valores',
                    description: 'Aquí podrás definir tu Misión, Visión y Valores, aspectos fundamentales de la identidad de tu negocio.',
                },
            });
        }

        steps.push(
            ...[
                {
                    element: '#mision',
                    popover: {
                        title: 'Primero la misión',
                        description: 'Acá podrás declarar la misión o la razón de ser de tu negocio.',
                    },
                },
            ],
        );

        let config: {
            pasos: DriveStep[];
            onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
            showProgress?: boolean;
            doneBtnText?: string;
            onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
        } = {
            pasos: steps,
            onFinish: () => {
                this.ayudaRunning.set(false);
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: true,
            };
        }

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
