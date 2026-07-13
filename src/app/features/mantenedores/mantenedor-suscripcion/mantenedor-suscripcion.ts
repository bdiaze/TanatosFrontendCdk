import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PlanDao } from '@/app/daos/plan-dao';
import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { EntSuscripcionCrear } from '@/app/entities/others/ent-suscripcion-crear';
import { SalPlan } from '@/app/entities/others/sal-plan';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideChevronRight,
    lucideCircleCheck,
    lucideCircleX,
    lucideCreditCard,
    lucideDot,
    lucideGem,
    lucideHourglass,
    lucideRefreshCw,
    lucideRefreshCwOff,
    lucideUserRound,
    lucideUsersRound,
} from '@ng-icons/lucide';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-mantenedor-suscripcion',
    imports: [
        NgIcon,
        HlmIcon,
        HlmP,
        HlmH3,
        HlmH4,
        HlmSpinnerImports,
        HlmSeparatorImports,
        DecimalPipe,
        HlmItemImports,
        HlmAlertImports,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        HlmButtonImports,
        ModalEliminacion,
        HlmTableImports,
    ],
    templateUrl: './mantenedor-suscripcion.html',
    styleUrl: './mantenedor-suscripcion.scss',
    providers: [
        provideIcons({
            lucideCreditCard,
            lucideHourglass,
            lucideGem,
            lucideDot,
            lucideChevronRight,
            lucideRefreshCwOff,
            lucideRefreshCw,
            lucideCircleCheck,
            lucideCircleX,
            lucideUsersRound,
            lucideUserRound,
        }),
        DatePipe,
    ],
})
export class MantenedorSuscripcion implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly suscripcionDao: SuscripcionDao = inject(SuscripcionDao);
    private readonly planDao: PlanDao = inject(PlanDao);
    negocioStore: NegocioStore = inject(NegocioStore);
    private readonly datePipe = inject(DatePipe);

    planesVigentes = signal([] as SalPlan[]);

    resumenSuscripcion = this.negocioStore.resumenSuscripcionUsuario;

    fechaExpiracionFormateada = computed(() => {
        const resumenSuscripcion = this.resumenSuscripcion();
        if (resumenSuscripcion && resumenSuscripcion.fechaExpiracion) {
            const fechaFormateada = this.datePipe.transform(resumenSuscripcion.fechaExpiracion, "EEEE d 'de' MMMM 'de' yyyy");
            // Si la fecha es distinta a la actual, se muestra la fecha, sino, se muestra la hora...
            if (this.datePipe.transform(new Date(), "EEEE d 'de' MMMM 'de' yyyy") !== fechaFormateada) {
                return fechaFormateada!.charAt(0).toLocaleUpperCase() + fechaFormateada!.slice(1);
            } else {
                return this.datePipe.transform(resumenSuscripcion.fechaExpiracion, "'Hoy a las' HH:mm");
            }
        }
        return null;
    });
    fechaProximoCobroFormateada = computed(() => {
        const resumenSuscripcion = this.resumenSuscripcion();
        if (resumenSuscripcion && resumenSuscripcion.fechaProximoCobro) {
            const fechaFormateada = this.datePipe.transform(resumenSuscripcion.fechaProximoCobro, "EEEE d 'de' MMMM 'de' yyyy");
            return fechaFormateada!.charAt(0).toLocaleUpperCase() + fechaFormateada!.slice(1);
        }
        return null;
    });
    esPlanEmpresa = computed(() => {
        const resumenSuscripcion = this.resumenSuscripcion();
        if (resumenSuscripcion && resumenSuscripcion.nombrePlanEnCurso) {
            return true;
        }
        return false;
    });
    informarRenovacion = computed(() => {
        const resumenSuscripcion = this.resumenSuscripcion();
        if (resumenSuscripcion?.renovacionAutomatica) {
            return true;
        }
        if (resumenSuscripcion?.precioPlanEnCurso && resumenSuscripcion!.precioPlanEnCurso! > 0) {
            return true;
        }
        return false;
    });
    planes = computed(() => this.planesVigentes());

    cargandoSuscripciones = signal(true);
    cargandoPlanesVigentes = signal(true);
    error = signal('');

    procesandoPrimerPago = computed(() => {
        const resumenSuscripcion = this.resumenSuscripcion();
        return resumenSuscripcion && !resumenSuscripcion.nombrePlanEnCurso && resumenSuscripcion.nombrePlanPagoEnCurso;
    });

    private pollingSub?: Subscription;

    constructor() {
        effect(() => {
            const procesandoPrimerPago = this.procesandoPrimerPago();

            untracked(() => {
                if (procesandoPrimerPago) {
                    if (this.pollingSub) return;
                    this.pollingSub = interval(10 * 1000).subscribe(() => {
                        this.obtenerResumenSuscripcion(true);
                    });
                } else {
                    this.pollingSub?.unsubscribe();
                    this.pollingSub = undefined;
                }
            });
        });
    }

    ngOnInit(): void {
        this.obtenerResumenSuscripcion();
        this.obtenerPlanesVigentes();
    }

    obtenerResumenSuscripcion(oculto: boolean = false) {
        if (!oculto) {
            this.cargandoSuscripciones.set(true);
        }

        this.suscripcionDao
            .obtenerResumen()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (err) => {
                    console.error('Error al obtener el resumen de suscripción del cliente', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener el resumen de suscripción del cliente');
                },
            })
            .add(() => {
                if (!oculto) {
                    this.cargandoSuscripciones.set(false);
                }
            });
    }

    obtenerPlanesVigentes() {
        this.cargandoPlanesVigentes.set(true);
        this.planesVigentes.set([]);
        this.planDao
            .obtenerDisponibles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.precio - b.precio);
                    this.planesVigentes.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los planes disponibles', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los planes disponibles');
                },
            })
            .add(() => {
                this.cargandoPlanesVigentes.set(false);
            });
    }

    procesandoPago = signal(false);
    idPlanProcesandoPago = signal<number | null>(null);

    generarUrlPago(idPlan: number) {
        if (this.procesandoPago()) return;

        this.procesandoPago.set(true);
        this.idPlanProcesandoPago.set(idPlan);
        this.suscripcionDao
            .crear({
                idPlan: idPlan,
            } as EntSuscripcionCrear)
            .subscribe({
                next: (res) => {
                    if (res.urlSuscripcion) {
                        window.location.href = res.urlSuscripcion;
                    } else {
                        this.obtenerResumenSuscripcion();
                        this.procesandoPago.set(false);
                        this.idPlanProcesandoPago.set(null);
                    }
                },
                error: (err) => {
                    console.error('Error al generar URL para pago de la suscripción', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al generar URL para pago de la suscripción');
                    this.procesandoPago.set(false);
                    this.idPlanProcesandoPago.set(null);
                },
            });
    }

    showModalDesuscribirse = signal(false);

    openModalDesuscribirse() {
        this.showModalDesuscribirse.set(true);
    }

    closeModalDesuscribirse() {
        this.showModalDesuscribirse.set(false);
    }

    procesando = signal(false);

    desuscribirse() {
        this.procesando.set(true);
        this.suscripcionDao
            .cancelar()
            .subscribe({
                next: () => {
                    this.obtenerResumenSuscripcion();
                },
                error: (err) => {
                    console.error('Error al cancelar suscripción', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al cancelar suscripción');
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
        this.showModalDesuscribirse.set(false);
    }
}
