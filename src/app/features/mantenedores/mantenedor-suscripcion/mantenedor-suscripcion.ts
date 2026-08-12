import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PlanDao } from '@/app/daos/plan-dao';
import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { EntSuscripcionCrear } from '@/app/entities/others/ent-suscripcion-crear';
import { SalPlan } from '@/app/entities/others/sal-plan';
import { SalSuscripcionResumen } from '@/app/entities/others/sal-suscripcion-resumen';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DriveStep } from 'driver.js';
import { interval, map, Subscription } from 'rxjs';

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
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    private readonly suscripcionDao: SuscripcionDao = inject(SuscripcionDao);
    private readonly planDao: PlanDao = inject(PlanDao);
    negocioStore: NegocioStore = inject(NegocioStore);
    private readonly datePipe = inject(DatePipe);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    planesVigentes = signal([] as SalPlan[]);

    resumenSuscripcion = computed(() => {
        if (this.ayudaRunning()) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + 14);

            return {
                tienePlanEmpresa: false,
                nombrePlanEnCurso: 'Plan de Ejemplo',
                precioPlanEnCurso: 9990,
                nombrePlanPagoEnCurso: 'Plan de Ejemplo',
                precioPlanPagoEnCurso: 9990,
                fechaExpiracion: null,
                fechaProximoCobro: fecha.toISOString(),
                renovacionAutomatica: true,
            } as SalSuscripcionResumen;
        }
        return this.negocioStore.resumenSuscripcionUsuario();
    });

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
    planesMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    nombre: 'Plan de Ejemplo',
                    precio: 9990,
                    duracionMeses: 1,
                    suscripcionUnica: false,
                },
                {
                    nombre: 'Plan Anual de Ejemplo',
                    precio: 119880,
                    duracionMeses: 12,
                    suscripcionUnica: false,
                },
            ] as SalPlan[];
        }
        return this.planesVigentes();
    });

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

        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
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

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mi Plan',
                    description: 'Ahora que ya estamos en Mi Plan, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá está tu plan',
                    description: 'Aquí encontrarás la información de tu plan actual, además de inscribirte o cancelar tus suscripciones.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#plan_actual',
                    popover: {
                        title: 'Resumen de tu plan',
                        description: 'Comenzando, tenemos el resumen de tu plan actual.',
                    },
                },
                {
                    element: '#precio_plan',
                    popover: {
                        title: 'El precio del plan',
                        description: 'Encontrarás el precio de tu plan actual.',
                    },
                },
                {
                    element: '#proximo_cobro',
                    popover: {
                        title: 'Fecha del próximo cobro',
                        description: 'La fecha en que se te cobrará la renovación automática del plan.',
                    },
                },
                {
                    element: '#cancelar_suscripcion',
                    popover: {
                        title: 'Cancelar tu suscripción',
                        description: 'Y además, podrás cancelar tu suscripción actual. ¡Cuidado! perderás tus beneficios si no renuevas tu plan.',
                    },
                },
                {
                    element: '#comparacion_planes',
                    popover: {
                        title: 'Los beneficios de tu plan',
                        description: 'Por otro lado, te recordamos los beneficios que tiene cada plan.',
                    },
                },
                {
                    element: '#comparacion_negocios',
                    popover: {
                        title: 'Cantidad de Negocios',
                        description: 'Por ejemplo, con el Plan Empresa puedes registrar cuantos negocios quieras.',
                    },
                },
                {
                    element: '#comparacion_plantillas',
                    popover: {
                        title: 'Plantillas de Obligaciones',
                        description: 'Podrás inscribirte a todas las plantillas de obligaciones que desees.',
                    },
                },
                {
                    element: '#comparacion_whatsapp',
                    popover: {
                        title: '¿Y Whatsapp?',
                        description: 'Con el Plan Empresa podrás enviar recordatorios directo al Whatsapp de todo tu equipo.',
                    },
                },
                {
                    element: '#comparacion_adjuntos',
                    popover: {
                        title: 'Adjunta tus documentos',
                        description: 'Y también podrás adjuntar documentos e imágenes al momento de dar por cumplida una obligación.',
                    },
                },
                {
                    element: '#contrata_plan',
                    popover: {
                        title: 'Contrata el plan para ti',
                        description:
                            '¿Y cómo consigo todos estos beneficios? ¡Simple! solo selecciona el plan que desees y te redireccionaremos a nuestra plataforma de pago.',
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
