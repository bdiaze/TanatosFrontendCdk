import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalFiscalizadorNormaSuscrita, SalNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { AuthStore } from '@/app/services/auth-store';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, signal, untracked, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarSearch, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { combineLatest, map } from 'rxjs';

@Component({
    selector: 'app-detalle-obligacion',
    imports: [
        NgIcon,
        HlmIcon,
        HlmH3,
        HlmH4,
        HlmP,
        HlmAlertImports,
        HlmBreadcrumbImports,
        EditorTexto,
        HlmBadgeImports,
        HlmSkeletonImports,
        HlmSeparatorImports,
        HlmItemImports,
        DatePipe,
        TitleCasePipe,
    ],
    templateUrl: './detalle-obligacion.html',
    styleUrl: './detalle-obligacion.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideCalendarSearch,
        }),
    ],
})
export class DetalleObligacion implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);
    protected readonly authStore = inject(AuthStore);

    private readonly route = inject(ActivatedRoute);
    ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    private readonly normaSuscritaDao = inject(NormaSuscritaDao);

    readonly routeParams = toSignal(
        combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
            map(([params, queryParams]) => ({
                idNormaSuscrita: params.get('idNormaSuscrita'),
                codigoAcceso: queryParams.get('codigo'),
            })),
        ),
    );

    constructor() {
        effect(() => {
            const routeParams = this.routeParams();

            untracked(() => {
                if (routeParams && routeParams.idNormaSuscrita) {
                    this.obtenerObligacion(Number(routeParams.idNormaSuscrita), routeParams.codigoAcceso);
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

    ngOnInit(): void {}

    error = signal<string>('');
    obligacion = signal<SalNormaSuscrita | null>(null);
    obligacionMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return {
                nombre: 'Obligación de Ejemplo',
                nombreCategoriaNorma: 'Tributación, SII y facturación',
                fiscalizadores: [{ nombreTipoFiscalizador: 'Servicio de Impuestos Internos' }],
                nombreTipoPeriodicidad: 'Mensual',
                multa: 'Multa de 1 UF + intereses',
                descripcion:
                    '<h2>Una obligación de ejemplo</h2><p>Esta es una <strong>obligación de ejemplo</strong> para explicar como funciona esta pantalla.</p><br/><h3>1. Con un primer paso de ejemplo</h3><h3>2. Y un segundo paso para completar</h3>',
                proximoVencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            } as SalNormaSuscrita;
        }
        return this.obligacion();
    });

    cargandoObligacion = signal(true);

    fiscalizadores = computed<SalFiscalizadorNormaSuscrita[]>(() => {
        let listado = this.obligacionMostrar()?.fiscalizadores;
        if (!listado || listado.length == 0) {
            listado = this.obligacionMostrar()?.templateNorma?.fiscalizadores;
        }

        if (!listado) {
            listado = [];
        }

        return listado;
    });

    obtenerObligacion(idNormaSuscrita: number, codigoAcceso: string | null) {
        this.error.set('');
        this.obligacion.set(null);
        this.cargandoObligacion.set(true);
        if (!codigoAcceso) {
            this.normaSuscritaDao
                .obtenerPorId(idNormaSuscrita)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (normaSuscrita) => {
                        if (normaSuscrita.fiscalizadores) {
                            normaSuscrita.fiscalizadores = normaSuscrita.fiscalizadores.filter((f) => f.nombreTipoFiscalizador);
                            normaSuscrita.fiscalizadores = normaSuscrita.fiscalizadores.sort((a, b) =>
                                a.nombreTipoFiscalizador!.toLocaleLowerCase().localeCompare(b.nombreTipoFiscalizador!.toLocaleLowerCase()),
                            );
                        }

                        if (normaSuscrita.notificaciones) {
                            normaSuscrita.notificaciones = normaSuscrita.notificaciones.sort((a, b) =>
                                a.idTipoUnidadTiempoAntelacion !== b.idTipoUnidadTiempoAntelacion
                                    ? b.idTipoUnidadTiempoAntelacion - a.idTipoUnidadTiempoAntelacion
                                    : b.cantAntelacion - a.cantAntelacion,
                            );
                        }

                        this.obligacion.set(normaSuscrita);
                    },
                    error: (err) => {
                        console.error('Error al obtener el detalle de la obligación', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al obtener el detalle de la obligación');
                    },
                })
                .add(() => {
                    this.cargandoObligacion.set(false);
                });
        } else {
            this.normaSuscritaDao
                .obtenerPorIdConCodigoAcceso(idNormaSuscrita, codigoAcceso)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (normaSuscrita) => {
                        if (normaSuscrita.fiscalizadores) {
                            normaSuscrita.fiscalizadores = normaSuscrita.fiscalizadores.filter((f) => f.nombreTipoFiscalizador);
                            normaSuscrita.fiscalizadores = normaSuscrita.fiscalizadores.sort((a, b) =>
                                a.nombreTipoFiscalizador!.toLocaleLowerCase().localeCompare(b.nombreTipoFiscalizador!.toLocaleLowerCase()),
                            );
                        }

                        if (normaSuscrita.notificaciones) {
                            normaSuscrita.notificaciones = normaSuscrita.notificaciones.sort((a, b) =>
                                a.idTipoUnidadTiempoAntelacion !== b.idTipoUnidadTiempoAntelacion
                                    ? b.idTipoUnidadTiempoAntelacion - a.idTipoUnidadTiempoAntelacion
                                    : b.cantAntelacion - a.cantAntelacion,
                            );
                        }

                        this.obligacion.set(normaSuscrita);
                    },
                    error: (err) => {
                        console.error('Error al obtener el detalle de la obligación', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al obtener el detalle de la obligación');
                    },
                })
                .add(() => {
                    this.cargandoObligacion.set(false);
                });
        }
    }

    expandido = signal<boolean>(false);
    mostrarBotonExpandir = signal<boolean>(true);

    @ViewChild('contenedorDescripcion') set contenedorDescripcion(el: ElementRef | undefined) {
        if (el) {
            const mostrar = el.nativeElement.scrollHeight > 240;
            this.mostrarBotonExpandir.set(mostrar);
        }
    }

    mostrarMasMenos(masMenos: boolean) {
        this.expandido.set(masMenos);
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        steps.push(
            ...[
                {
                    popover: {
                        title: 'Detalle de tu obligación',
                        description: 'Aquí podrás conocer los detalles de una de tus obligaciones, como la descripción, multa y próximo vencimiento.',
                    },
                },
                {
                    element: '#cabecera_obligacion',
                    popover: {
                        title: 'La obligación',
                        description: 'Primero te mostramos cuál es la obligación, a qué categoría pertenece y quién la fiscaliza.',
                    },
                },
                {
                    element: '#periodicidad_multa',
                    popover: {
                        title: 'Periodicidad y multa',
                        description: 'Luego te indicamos cada cuánto se repite, y qué multa arriesgas en caso de no cumplirla a tiempo.',
                    },
                },
                {
                    element: '#descripcion',
                    popover: {
                        title: '¿En qué consiste la obligación?',
                        description: 'Además, te entregamos una descripción de la obligación, explicando de qué se trata y cómo se completa.',
                    },
                },
                {
                    element: '#proximo_vencimiento',
                    popover: {
                        title: '¿Cuándo vence?',
                        description: 'Y por último, tienes la fecha del próximo vencimiento de tu obligación.',
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

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
