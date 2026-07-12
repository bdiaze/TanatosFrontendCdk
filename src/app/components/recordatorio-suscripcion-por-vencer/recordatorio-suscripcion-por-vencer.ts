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
    selector: 'app-recordatorio-suscripcion-por-vencer',
    imports: [HlmP, RouterLink, NgIcon, HlmIcon],
    templateUrl: './recordatorio-suscripcion-por-vencer.html',
    styleUrl: './recordatorio-suscripcion-por-vencer.scss',
    providers: [
        provideIcons({
            lucideGem,
        }),
    ],
})
export class RecordatorioSuscripcionPorVencer {
    private readonly destroyRef = inject(DestroyRef);

    private readonly authStore = inject(AuthStore);
    private readonly negocioStore = inject(NegocioStore);
    private readonly suscripcionDao = inject(SuscripcionDao);

    diasRestantes = computed(() => {
        const resumenSuscripcion = this.negocioStore.resumenSuscripcionUsuario();
        if (resumenSuscripcion && resumenSuscripcion.fechaExpiracion) {
            const fechaActual = new Date();
            const fechaExpiracion = new Date(resumenSuscripcion.fechaExpiracion!);
            const dias = (fechaExpiracion.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24);
            return Math.round(dias);
        }
        return null;
    });
    titulo = computed(() => {
        const resumenSuscripcion = this.negocioStore.resumenSuscripcionUsuario();
        if (resumenSuscripcion && resumenSuscripcion.precioPlanEnCurso === 0) {
            return 'Mes de Prueba';
        }
        return 'Plan Empresa';
    });

    expanded = signal<boolean>(false);

    constructor() {
        effect(() => {
            const sesionIniciada = this.authStore.sesionIniciada();

            untracked(() => {
                if (sesionIniciada) {
                    this.obtenerResumenSuscripcion();
                }
            });
        });
    }

    obtenerResumenSuscripcion() {
        this.suscripcionDao.obtenerResumen().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
    }
}
