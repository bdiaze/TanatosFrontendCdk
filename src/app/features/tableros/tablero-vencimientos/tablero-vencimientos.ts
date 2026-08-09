import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscritaObtenerConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-con-vencimiento';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarRange, lucideCircleAlert, lucideCircleCheck, lucideClockAlert, lucideMinus, lucidePlus, lucideX } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButton } from '@spartan-ng/helm/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { normalize } from '@/app/helpers/string-comparator';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TourService } from '@/app/helpers/tour-service';
import { map } from 'rxjs';
import { DriveStep } from 'driver.js';
import { TarjetaVencimiento } from '@/app/components/tarjeta-vencimiento/tarjeta-vencimiento';

@Component({
    selector: 'app-tablero-vencimientos',
    imports: [
        NgIcon,
        HlmIcon,
        HlmH3,
        HlmH4,
        HlmInputImports,
        HlmInputGroupImports,
        HlmSpinnerImports,
        HlmSeparatorImports,
        HlmItemImports,
        HlmButton,
        RouterLink,
        HlmAlertImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        TarjetaVencimiento,
    ],
    templateUrl: './tablero-vencimientos.html',
    providers: [
        provideIcons({
            lucideCalendarRange,
            lucideClockAlert,
            lucideCircleAlert,
            lucideCircleCheck,
            lucideX,
            lucidePlus,
            lucideMinus,
        }),
    ],
})
export class TableroVencimientos {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);
    normaSuscritaDao: NormaSuscritaDao = inject(NormaSuscritaDao);
    negocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    normasVencidas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    normasVencidasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    fechaVencimiento: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    nombreNorma: 'Obligación de ejemplo',
                    descripcionNorma: 'Esta es una obligación vencida',
                } as SalNormaSuscritaObtenerConVencimiento,
            ];
        }
        return this.normasVencidas();
    });

    normasFuturas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    normasFuturasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    fechaVencimiento: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                    nombreNorma: 'Obligación de ejemplo',
                    descripcionNorma: 'Esta es una obligación futura',
                } as SalNormaSuscritaObtenerConVencimiento,
            ];
        }
        return this.normasFuturas();
    });

    mostrarInactivas = signal(false);
    normasInactivas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    normasInactivasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    fechaVencimiento: null,
                    nombreNorma: 'Obligación de ejemplo',
                    descripcionNorma: 'Esta es una obligación inactiva',
                } as SalNormaSuscritaObtenerConVencimiento,
            ];
        }
        return this.normasInactivas();
    });

    normasCompletadas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    filtroCompletadas = signal<string>('');
    cuantosMostrarCompletadas = signal<number>(6);
    normasCompletadasFiltradas = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    fechaVencimiento: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                    fechaCompletitud: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
                    nombreNorma: 'Obligación de ejemplo',
                    descripcionNorma: 'Esta es una obligación completada',
                } as SalNormaSuscritaObtenerConVencimiento,
            ];
        }
        return this.normasCompletadas().filter((n) => normalize(n.nombreNorma!).includes(normalize(this.filtroCompletadas())));
    });
    normasCompletadasFiltradasPaginadas = computed(() => {
        return this.normasCompletadasFiltradas().slice(0, this.cuantosMostrarCompletadas());
    });

    cargando = signal(true);
    error = signal('');

    constructor() {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.obtenerTodos();
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

    obtenerTodos() {
        this.cargando.set(true);
        this.normasVencidas.set([]);
        this.normasFuturas.set([]);
        this.normasCompletadas.set([]);

        this.normaSuscritaDao
            .obtenerConVencimiento(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const ahora = new Date();

                    const sortedVencidas = res
                        .filter((x) => x.fechaVencimiento && new Date(x.fechaVencimiento).getTime() <= ahora.getTime() && !x.fechaCompletitud)
                        .sort((a, b) => new Date(a.fechaVencimiento!).getTime() - new Date(b.fechaVencimiento!).getTime());
                    this.normasVencidas.set(sortedVencidas);

                    const sortedFuturas = res
                        .filter((x) => x.fechaVencimiento && new Date(x.fechaVencimiento).getTime() > ahora.getTime() && !x.fechaCompletitud)
                        .sort((a, b) => new Date(a.fechaVencimiento!).getTime() - new Date(b.fechaVencimiento!).getTime());
                    this.normasFuturas.set(sortedFuturas);

                    const sortedInactivas = res.filter((x) => !x.activado).sort((a, b) => a.idNormaSuscrita - b.idNormaSuscrita);
                    this.normasInactivas.set(sortedInactivas);

                    const sortedFechaCompletitud = res
                        .filter((x) => x.fechaCompletitud)
                        .sort((a, b) => new Date(b.fechaCompletitud!).getTime() - new Date(a.fechaCompletitud!).getTime());
                    this.normasCompletadas.set(sortedFechaCompletitud);
                },
                error: (err) => {
                    console.error('Error al obtener los vencimientos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los vencimientos');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    mostrarMasCompletadas() {
        this.cuantosMostrarCompletadas.update((v) => {
            return v + 3;
        });
    }

    toggleMostrarInactivas() {
        this.mostrarInactivas.update((m) => !m);
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mi Calendario',
                    description: 'Ahora que ya estamos en Mi Calendario, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Estás en tu calendario de obligaciones',
                    description: 'Aquí podrás encontrar toda la información asociada al vencimiento de tus obligaciones.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#obligaciones-vencidas',
                    popover: {
                        title: 'Obligaciones vencidas',
                        description: 'Por acá tienes las obligaciones cuyo vencimiento ya pasó ¡Ten precaución con ellas!',
                    },
                },
                {
                    element: '#proximas-obligaciones',
                    popover: {
                        title: 'Las próximas obligaciones',
                        description: 'Luego tenemos tus obligaciones a futuro, comenzando por la más cercana.',
                    },
                },
                {
                    element: '#obligaciones-inactivas',
                    popover: {
                        title: 'Las que aún no activas',
                        description: 'Además, te mostramos todas las obligaciones no activadas, es decir, sin notificaciones configuradas.',
                    },
                },
                {
                    element: '#obligaciones-completadas',
                    popover: {
                        title: 'Y las completadas',
                        description: 'Al final encontrarás el historial de obligaciones que ya fueron completadas.',
                    },
                },
            ] as DriveStep[]),
        );

        if (this.ayuda() === '1') {
            steps.push({
                element: '#obligacion-prueba',
                popover: {
                    title: 'Selecciona un vencimiento',
                    description: 'Además, puedes seleccionar cualquier obligación para obtener más información de ese vencimiento, ¡Vamos allá!',
                    side: 'bottom',
                },
            });
        } else {
            steps.push({
                element: '#obligacion-prueba',
                popover: {
                    title: 'Selecciona un vencimiento',
                    description: 'Además, puedes seleccionar cualquier obligación para obtener más información de ese vencimiento.',
                    side: 'bottom',
                },
            });
        }

        let cambiandoASiguiente = false;
        let mostrandoInactivas = this.mostrarInactivas();

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
                this.mostrarInactivas.set(mostrandoInactivas);
                if (!cambiandoASiguiente && this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
            onNextFromLast: () => {
                if (this.ayuda() === '1') {
                    cambiandoASiguiente = true;
                    this.router.navigate(['/obligacion', 0, 0], { queryParams: { ayuda: 1 } });
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: false,
                doneBtnText: 'Siguiente',
            };
        }

        this.mostrarInactivas.set(true);
        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
