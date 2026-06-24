import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscritaObtenerConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-con-vencimiento';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarRange, lucideCircleAlert, lucideCircleCheck, lucideClockAlert, lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButton } from '@spartan-ng/helm/button';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { normalize } from '@/app/helpers/string-comparator';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { PlainTextPipe } from '@/app/pipes/plain-text-pipe';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { TourService } from '@/app/helpers/tour-service';
import { map } from 'rxjs';
import { DriveStep } from 'driver.js';

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
        DatePipe,
        RouterLink,
        HlmAlertImports,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        PlainTextPipe,
    ],
    templateUrl: './tablero-vencimientos.html',
    providers: [
        provideIcons({
            lucideCalendarRange,
            lucideClockAlert,
            lucideCircleAlert,
            lucideCircleCheck,
            lucideX,
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
                    const sorted = res.sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());

                    const ahora = new Date();
                    this.normasVencidas.set(sorted.filter((x) => new Date(x.fechaVencimiento).getTime() <= ahora.getTime() && !x.fechaCompletitud));
                    this.normasFuturas.set(sorted.filter((x) => new Date(x.fechaVencimiento).getTime() > ahora.getTime() && !x.fechaCompletitud));

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

    haceCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha);
        return `${diferencia.length > 0 ? 'Hace ' + diferencia : 'Recién'}`;
    }

    enCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha, true);
        return `${diferencia.length > 0 ? 'Menos de ' + diferencia : 'Ahora'}`;
    }

    diferenciaConFechaActual(strFecha: string, aproxSuperior = false): string {
        const fecha: Date = new Date(strFecha);
        const ahora: Date = new Date();

        // Se determina la fecha de inicio y fin según la fecha mayor...
        const fechaFutura = fecha > ahora;
        let inicio = fechaFutura ? ahora : fecha;
        let fin = fechaFutura ? fecha : ahora;

        const inicioDayJS = dayjs(inicio);
        const finDayJS = dayjs(fin);

        const diffInYears = finDayJS.diff(inicioDayJS, 'year', true);
        if (!aproxSuperior) {
            const annos = Math.floor(diffInYears);
            if (annos >= 1) {
                return `${annos} ${annos === 1 ? 'año' : 'años'}`;
            }
        } else {
            const annos = Math.ceil(diffInYears);
            if (annos > 1) {
                return `${annos} años`;
            }
        }

        const diffInMonths = finDayJS.diff(inicioDayJS, 'month', true);
        if (!aproxSuperior) {
            const meses = Math.floor(diffInMonths);
            if (meses >= 1) {
                return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
            }
        } else {
            const meses = Math.ceil(diffInMonths);
            if (meses == 12) {
                return `un año`;
            } else if (meses > 1) {
                return `${meses} meses`;
            }
        }

        // Se calcula la diferencia para semanas, días, horas, minutos y segundos...
        const diffMs = fin.getTime() - inicio.getTime();

        const unidades = [
            { unit: 'semana', ms: 1000 * 60 * 60 * 24 * 7 },
            { unit: 'día', ms: 1000 * 60 * 60 * 24 },
            { unit: 'hora', ms: 1000 * 60 * 60 },
            { unit: 'minuto', ms: 1000 * 60 },
            { unit: 'segundo', ms: 1000 },
        ];

        if (!aproxSuperior) {
            for (const u of unidades) {
                const valor = Math.floor(diffMs / u.ms);
                if (valor >= 1) {
                    return `${valor} ${valor === 1 ? u.unit : u.unit + 's'}`;
                }
            }
        } else {
            for (const [index, u] of unidades.entries()) {
                const valor = Math.ceil(diffMs / u.ms);
                if (index > 0 && valor * u.ms == unidades[index - 1].ms) {
                    return `un${[0, 2].includes(index - 1) ? 'a' : ''} ${unidades[index - 1].unit}`;
                } else if (valor > 1) {
                    return `${valor} ${u.unit + 's'}`;
                }
            }
        }

        return '';
    }

    mostrarMasCompletadas() {
        this.cuantosMostrarCompletadas.update((v) => {
            return v + 3;
        });
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Ya estamos en Mi Calendario!',
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
                    element: '#obligaciones-completadas',
                    popover: {
                        title: 'Y las completadas',
                        description: 'Al final encontrarás el historial de obligaciones que ya fueron completadas.',
                    },
                },
                {
                    element: '#obligacion-prueba',
                    popover: {
                        title: 'Selecciona un vencimiento',
                        description: 'Puedes seleccionar cualquier obligación para obtener más información del vencimiento de ella.',
                        side: 'bottom',
                    },
                },
            ] as DriveStep[]),
        );

        let cambiandoASiguiente = false;

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

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
