import { Component, DestroyRef, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideWallet } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { CuentasFinancieras } from '../cuentas-financieras/cuentas-financieras';
import { NegocioStore } from '@/app/services/negocio-store';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DriveStep } from 'driver.js';
import { TourService } from '@/app/helpers/tour-service';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { MovimientosFinancieros } from '../movimientos-financieros/movimientos-financieros';
import { SalMovimientoFinanciero } from '@/app/entities/others/sal-movimiento-financiero';

@Component({
    selector: 'app-cartola-movimientos',
    imports: [HlmH3, HlmH4, HlmIcon, NgIcon, CuentasFinancieras, MovimientosFinancieros, HlmBreadcrumbImports, HlmButtonImports],
    templateUrl: './cartola-movimientos.html',
    styleUrl: './cartola-movimientos.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [provideIcons({ lucideWallet })],
})
export class CartolaMovimientos {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    negocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    idCuentaFinancieraSeleccionada = signal<number | null>(null);

    cuentaFinancieraCambiada(idCuentaFinanciera: number | null) {
        this.idCuentaFinancieraSeleccionada.set(idCuentaFinanciera);
    }

    readonly cuentasFinancierasComponent = viewChild.required(CuentasFinancieras);
    movimientoActualizado() {
        this.cuentasFinancierasComponent().refreshInformacionCuentas();
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mi Equipo',
                    description: 'Ahora que ya estamos en Mi Equipo, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá está tu equipo de trabajo',
                    description: 'Aquí podrás administrar a los integrantes de tu equipo, además de añadir medios de notificación para ellos.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#tabla_empleados',
                    popover: {
                        title: '¿Quiénes integran mi equipo?',
                        description: 'Acá encontrarás a todos los integrantes de tu equipo.',
                    },
                },
            ] as DriveStep[]),
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

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
