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

    suscripcionPorVencer = computed(() => {
        const suscripcionActual = this.negocioStore.suscripcionActualUsuario();
        // Si la suscripción actual no tiene ID de Flow (no se renueva) o fue cancelada, se considera "por vencer"...
        if (suscripcionActual && (!suscripcionActual.tieneFlowSubscriptionId || suscripcionActual.estado === 2) /* Cancelada */) {
            return suscripcionActual;
        }
        return null;
    });
    diasRestantes = computed(() => {
        const suscripcionPorVencer = this.suscripcionPorVencer();
        if (suscripcionPorVencer) {
            const fechaActual = new Date();
            const fechaExpiracion = new Date(suscripcionPorVencer.fechaExpiracion!);
            const dias = (fechaExpiracion.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24);
            return Math.round(dias);
        }
        return null;
    });
    titulo = computed(() => {
        const suscripcionPorVencer = this.suscripcionPorVencer();
        if (suscripcionPorVencer) {
            if (!suscripcionPorVencer.tieneFlowSubscriptionId) {
                return 'Mes de Prueba';
            }
            return 'Plan Empresa';
        }
        return null;
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
