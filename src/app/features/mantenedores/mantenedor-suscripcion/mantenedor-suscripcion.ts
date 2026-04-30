import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PlanDao } from '@/app/daos/plan-dao';
import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { EntSuscripcionCrear } from '@/app/entities/others/ent-suscripcion-crear';
import { SalPlan } from '@/app/entities/others/sal-plan';
import { SalSuscripcion } from '@/app/entities/others/sal-suscripcion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCalendarRange,
    lucideChevronRight,
    lucideCircleCheck,
    lucideCircleX,
    lucideCreditCard,
    lucideDiamond,
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
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { interval, merge, Subscription } from 'rxjs';

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
        DatePipe,
        DecimalPipe,
        HlmItemImports,
        HlmAlertImports,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
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
    private suscripcionDao: SuscripcionDao = inject(SuscripcionDao);
    private planDao: PlanDao = inject(PlanDao);
    negocioStore: NegocioStore = inject(NegocioStore);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);
    private router = inject(Router);

    suscripciones = signal([] as SalSuscripcion[]);
    planesVigentes = signal([] as SalPlan[]);
    ultimaSuscripcion = computed(() => {
        const suscripciones = this.suscripciones();

        // Buscamos la suscripción con mayor expiración...
        const suscripcionesConFechaExpiracion = suscripciones.filter((s) => s.fechaExpiracion && new Date(s.fechaExpiracion) > new Date());
        if (suscripcionesConFechaExpiracion.length > 0) {
            const mayorExpiracion = suscripcionesConFechaExpiracion.reduce((max, actual) =>
                new Date(actual.fechaExpiracion!) > new Date(max.fechaExpiracion!) ? actual : max,
            );
            if (mayorExpiracion) return mayorExpiracion;
        }

        return null;
    });
    fechaExpiracionFormateada = computed(() => {
        if (this.ultimaSuscripcion()) {
            return this.datePipe.transform(this.ultimaSuscripcion()?.fechaExpiracion, "EEEE d 'de' MMMM 'de' yyyy");
        }
        return null;
    });
    esPlanEmpresa = computed(() => {
        const ultimaSuscripcion = this.ultimaSuscripcion();
        if (ultimaSuscripcion && ultimaSuscripcion.fechaExpiracion && new Date(ultimaSuscripcion.fechaExpiracion) > new Date()) {
            return true;
        }
        return false;
    });
    planes = computed(() => {
        const planesVigentes = this.planesVigentes();
        const suscripciones = this.suscripciones();
        return planesVigentes.filter((p) => !p.suscripcionUnica || !suscripciones.some((s) => s.idPlan == p.id));
    });

    cargandoSuscripciones = signal(true);
    cargandoPlanesVigentes = signal(true);
    error = signal('');

    esCallback = signal(false);

    private pollingSub?: Subscription;

    constructor() {
        effect(() => {
            if (this.esCallback()) {
                if (this.pollingSub) return;
                this.pollingSub = interval(10 * 1000).subscribe(() => {
                    const ultima = this.ultimaSuscripcion();
                    if (!ultima || ultima.estado !== 1) {
                        this.obtenerSuscripciones(true);
                    } else {
                        this.router.navigate([], { queryParams: { callback: null }, queryParamsHandling: 'merge' });
                    }
                });
            } else {
                this.pollingSub?.unsubscribe();
                this.pollingSub = undefined;
            }
        });
    }

    ngOnInit(): void {
        this.obtenerSuscripciones();
        this.obtenerPlanesVigentes();

        this.activatedRoute.queryParams.subscribe((params) => {
            const callback = params['callback'];
            this.esCallback.set(callback == 1);
        });
    }

    obtenerSuscripciones(oculto: boolean = false) {
        if (!oculto) {
            this.cargandoSuscripciones.set(true);
            this.suscripciones.set([]);
        }

        this.suscripcionDao
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    this.suscripciones.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener las suscripciones del cliente', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las suscripciones del cliente');
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
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.precio - b.precio);
                    this.planesVigentes.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los planes vigentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los planes vigentes');
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
                        this.obtenerSuscripciones();
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

    obtenerEstadoSuscripcion(idEstado: number) {
        switch (idEstado) {
            case 1:
                return 'Activa';
            case 2:
                return 'Cancelada';
            case 3:
                return 'Expirada';
            case 4:
                return 'Pago Pendiente';
            default:
                return '';
        }
    }

    obtenerRenovacion(idPlan: number) {
        if (idPlan == 1) return null;
        return 'Automática';
    }

    showModalDesuscribirse = signal(false);

    openModalDesuscribirse() {
        this.showModalDesuscribirse.set(true);
    }

    closeModalDesuscribirse() {
        this.showModalDesuscribirse.set(false);
    }

    procesando = signal(false);

    desuscribirse(idSuscripcion: number) {
        this.procesando.set(true);
        this.suscripcionDao
            .cancelar(idSuscripcion)
            .subscribe({
                next: () => {
                    this.obtenerSuscripciones();
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
