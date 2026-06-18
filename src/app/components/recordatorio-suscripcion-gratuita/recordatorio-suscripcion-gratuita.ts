import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HlmP } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideGem } from '@ng-icons/lucide';

@Component({
    selector: 'app-recordatorio-suscripcion-gratuita',
    imports: [HlmP, RouterLink, NgIcon, HlmIcon],
    templateUrl: './recordatorio-suscripcion-gratuita.html',
    styleUrl: './recordatorio-suscripcion-gratuita.scss',
    providers: [
        provideIcons({
            lucideGem,
        }),
    ],
})
export class RecordatorioSuscripcionGratuita {
    private readonly destroyRef = inject(DestroyRef);

    private readonly authStore = inject(AuthStore);
    private readonly negocioStore = inject(NegocioStore);
    private readonly suscripcionDao = inject(SuscripcionDao);

    suscripcionGratuita = this.negocioStore.suscripcionActualGratuita;
    diasRestantes = computed(() => {
        const fechaActual = new Date();
        const fechaExpiracion = new Date(this.suscripcionGratuita()?.fechaExpiracion!);
        const dias = Math.round((fechaExpiracion.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));
        return dias;
    });

    expanded = signal<boolean>(false);

    constructor() {
        effect(() => {
            const sesionIniciada = this.authStore.sesionIniciada();

            untracked(() => {
                if (sesionIniciada) {
                    this.obtenerSuscripciones();
                }
            });
        });
    }

    obtenerSuscripciones() {
        this.suscripcionDao.obtenerVigentes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
    }
}
