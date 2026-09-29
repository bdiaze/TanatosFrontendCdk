import { PlanDao } from '@/app/daos/plan-dao';
import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { EntSuscripcionCrear } from '@/app/entities/others/ent-suscripcion-crear';
import { SalPlan } from '@/app/entities/others/sal-plan';
import { SalSuscripcionResumen } from '@/app/entities/others/sal-suscripcion-resumen';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideDot, lucideGem, lucideInfo, lucideRefreshCw } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

@Component({
    selector: 'app-confirmar-suscripcion',
    imports: [
        NgIcon,
        HlmIcon,
        HlmP,
        HlmH3,
        HlmH4,
        HlmSpinnerImports,
        DecimalPipe,
        DatePipe,
        HlmAlertImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        HlmButtonImports,
        HlmSwitch,
        RouterLink,
        NgClass,
    ],
    templateUrl: './confirmar-suscripcion.html',
    styleUrl: './confirmar-suscripcion.scss',
    providers: [
        provideIcons({
            lucideGem,
            lucideRefreshCw,
            lucideCircleCheck,
            lucideInfo,
            lucideDot,
        }),
        DatePipe,
    ],
})
export class ConfirmarSuscripcion {
    private readonly destroyRef = inject(DestroyRef);

    private readonly tourService = inject(TourService);

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly idPlan = toSignal(this.route.paramMap.pipe(map((params) => Number(params.get('idPlan')))), { initialValue: null });
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    private readonly planDao = inject(PlanDao);
    private readonly suscripcionDao = inject(SuscripcionDao);

    private readonly negocioStore = inject(NegocioStore);

    constructor() {
        effect(() => {
            const idPlan = this.idPlan();

            untracked(() => {
                if (idPlan) {
                    this.obtenerPlan(idPlan);
                    this.obtenerSuscripcion();
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

    error = signal('');
    planSeleccionado = signal<SalPlan | null>(null);
    planSeleccionadoMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return {
                id: 0,
                nombre: 'Plan de Ejemplo',
                precio: 9990,
                duracionMeses: 1,
                suscripcionUnica: false,
            } as SalPlan;
        }
        return this.planSeleccionado();
    });
    resumenSuscripcion = this.negocioStore.resumenSuscripcionUsuario;
    resumenSuscripcionMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return {
                tienePlanEmpresa: false,
                renovacionAutomatica: false,
            } as SalSuscripcionResumen;
        }
        return this.resumenSuscripcion();
    });

    fechaInicioPlan = computed(() => {
        if (this.resumenSuscripcionMostrar()?.fechaExpiracion) {
            return this.resumenSuscripcionMostrar()?.fechaExpiracion;
        }

        return new Date().toISOString();
    });

    fechaPrimerPago = computed(() => {
        if (this.resumenSuscripcionMostrar()?.fechaExpiracion) {
            return this.resumenSuscripcionMostrar()?.fechaExpiracion;
        }

        return new Date().toISOString();
    });

    cargando = computed(() => {
        return this.obteniendoPlan() || this.obteniendoSuscripcion();
    });

    obteniendoPlan = signal(false);
    obtenerPlan(idPlan: number) {
        this.obteniendoPlan.set(true);
        this.planSeleccionado.set(null);
        this.planDao
            .obtenerDisponibles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const plan = res.find((p) => p.id === idPlan);
                    if (plan) {
                        this.planSeleccionado.set(plan);
                    } else {
                        console.error('El plan seleccionado no está disponible para su contratación.');
                        this.error.set('El plan seleccionado no está disponible para su contratación.');
                    }
                },
                error: (err) => {
                    console.error('Error al obtener los datos del plan seleccionado', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los datos del plan seleccionado');
                },
            })
            .add(() => {
                this.obteniendoPlan.set(false);
            });
    }

    obteniendoSuscripcion = signal(false);
    obtenerSuscripcion() {
        this.obteniendoSuscripcion.set(true);
        this.suscripcionDao
            .obtenerResumen()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (err) => {
                    console.error('Error al obtener tu suscripción actual', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener tu suscripción actual');
                },
            })
            .add(() => {
                this.obteniendoSuscripcion.set(false);
            });
    }

    periodicidadPlan(cantMeses: number | undefined) {
        switch (cantMeses) {
            case undefined:
                return '';
            case 1:
                return 'Mensual';
            case 12:
                return 'Anual';
            default:
                return `${cantMeses} Meses`;
        }
    }

    cadaXMesPlan(cantMeses: number | undefined) {
        switch (cantMeses) {
            case undefined:
                return '';
            case 1:
                return 'mes';
            case 12:
                return 'año';
            default:
                return `${cantMeses} meses`;
        }
    }

    segundoCobro(primerCobro: string | null | undefined, cantMeses: number | undefined) {
        if (primerCobro === null || primerCobro === undefined || cantMeses === undefined) {
            return '';
        }

        const segundoCobro = new Date(primerCobro);
        segundoCobro.setMonth(segundoCobro.getMonth() + cantMeses);
        return segundoCobro;
    }

    avisoLegalAceptado = signal(false);
    avisoPrivacidadAceptado = signal(false);

    procesandoPago = signal(false);

    generarUrlPago() {
        if (this.procesandoPago() || !this.planSeleccionado()) return;

        this.procesandoPago.set(true);
        this.suscripcionDao
            .crear({
                idPlan: this.planSeleccionado()?.id,
            } as EntSuscripcionCrear)
            .subscribe({
                next: (res) => {
                    if (res.urlSuscripcion) {
                        window.location.href = res.urlSuscripcion;
                    } else {
                        this.router.navigate(['/mi-plan']);
                        this.procesandoPago.set(false);
                    }
                },
                error: (err) => {
                    console.error('Error al generar URL para pago de la suscripción', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al generar URL para pago de la suscripción');
                    this.procesandoPago.set(false);
                },
            });
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Contrata el plan!',
                    description: 'Una vez seleccionado el plan deseado, deberás validar las condiciones de este y proceder con la contratación.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá están las condiciones de contratación',
                    description: 'Aquí podrás confirmar la información del plan seleccionado para proceder con su contratación.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#plan_seleccionado',
                    popover: {
                        title: 'Plan seleccionado',
                        description: 'Comenzando, tenemos el resumen del plan seleccionado.',
                    },
                },
                {
                    element: '#precio_plan',
                    popover: {
                        title: 'Precio a pagar',
                        description: 'Por acá verás el precio a pagar por la suscripcion.',
                    },
                },
                {
                    element: '#periodicidad',
                    popover: {
                        title: 'Periodicidad del plan',
                        description: 'También te indicamos cada cuánto se efectuará el cobro del plan.',
                    },
                },
                {
                    element: '#inicio_plan',
                    popover: {
                        title: 'Fecha de inicio',
                        description: 'La fecha en que se dará por iniciado el plan. Puede ser una fecha futura si aún tienes un plan vigente.',
                    },
                },
                {
                    element: '#primer_cobro',
                    popover: {
                        title: 'Fecha del primer cobro',
                        description: 'Y la fecha en que efectuaremos el primer cobro, en caso de que aceptes las condiciones del plan.',
                    },
                },
                {
                    element: '#caracteristicas_plan',
                    popover: {
                        title: 'Características del plan',
                        description: 'A continuación, te presentamos todos los beneficios que incluye el plan seleccionado.',
                    },
                },
                {
                    element: '#acceso_plantillas',
                    popover: {
                        title: 'Acceso a todas las plantillas',
                        description: 'Por ejemplo, acceso a todas nuestras plantillas de obligaciones.',
                    },
                },
                {
                    element: '#notificaciones_whatsapp',
                    popover: {
                        title: 'Notificaciones por WhatsApp',
                        description: 'Y la posibilidad de habilitar las notificaciones por WhatsApp.',
                    },
                },
                {
                    element: '#condiciones_importantes',
                    popover: {
                        title: 'Condiciones importantes',
                        description: 'Además te destacamos algunas condiciones importantes de la contratación. Leelas con detención.',
                    },
                },
                {
                    element: '#pago_recurrente',
                    popover: {
                        title: 'Pago recurrente',
                        description: 'Por ejemplo, es importante que entiendas que el costo del plan se paga de forma recurrente, según la periodicidad.',
                    },
                },
                {
                    element: '#aviso_legal',
                    popover: {
                        title: 'Aviso Legal',
                        description: 'Por último, es necesario que leas y, si estás de acuerdo, aceptes el Aviso Legal.',
                    },
                },
                {
                    element: '#politica_privacidad',
                    popover: {
                        title: 'Política de Privacidad',
                        description: 'Lo mismo para la Política de Privacidad, leela con detención y si estás de acuerdo aceptala.',
                    },
                },
                {
                    element: '#boton_contratar',
                    popover: {
                        title: '¡Contrata tu plan!',
                        description:
                            'Una vez aceptada todas las condiciones, procede con la contratación haciendo click aquí. Este botón te llevará a nuestra plataforma de pago.',
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
                showProgress: false,
            };
        }

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
