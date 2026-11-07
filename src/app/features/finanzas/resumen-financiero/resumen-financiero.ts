import { MovimientoFinancieroDao } from '@/app/daos/movimiento-financiero-dao';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';
import { form, required } from '@angular/forms/signals';
import { CuentaFinancieraDao } from '@/app/daos/cuenta-financiera-dao';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { lucideChartNoAxesCombined, lucideEqual, lucideMinus, lucidePlus, lucideSearchAlert, lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { SalCuentaFinanciera } from '@/app/entities/others/sal-cuenta-financiera';
import { TotalIngresosGastos } from '@/app/entities/others/total-ingresos-gastos';
import { IngresosGastosPorCategoria } from '@/app/entities/others/ingresos-gastos-por-categoria';
import { IngresosGastosPorPeriodo } from '@/app/entities/others/ingresos-gastos-por-periodo';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { HlmDatePickerImports, provideHlmMonthYearPickerConfig } from '@spartan-ng/helm/date-picker';
import { injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { RouterLink } from '@angular/router';

@Component({
    imports: [
        HlmP,
        HlmH3,
        HlmH4,
        HlmIcon,
        NgIcon,
        HlmBreadcrumbImports,
        HlmButtonImports,
        HlmSeparatorImports,
        DatePipe,
        DecimalPipe,
        NgClass,
        BaseChartDirective,
        HlmDatePickerImports,
        HlmSkeletonImports,
        RouterLink,
    ],
    selector: 'app-resumen-financiero',
    styleUrl: './resumen-financiero.scss',
    templateUrl: './resumen-financiero.html',
    providers: [
        provideIcons({ lucideChartNoAxesCombined, lucidePlus, lucideMinus, lucideTrendingUp, lucideTrendingDown, lucideSearchAlert, lucideEqual }),
        provideCharts(withDefaultRegisterables()),
        DatePipe,
        provideHlmMonthYearPickerConfig({
            autoCloseOnSelect: true,
            formatDate: (date: Date) => {
                const mes = new Intl.DateTimeFormat('es-CL', {
                    month: 'short',
                }).format(date);

                const anno = new Intl.DateTimeFormat('es-CL', {
                    year: 'numeric',
                }).format(date);
                return mes.charAt(0).toLocaleUpperCase() + mes.slice(1) + ' de ' + anno;
            },
        }),
    ],
})
export class ResumenFinanciero implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly cuentaFinancieraDao = inject(CuentaFinancieraDao);
    private readonly movimientoFinancieroDao = inject(MovimientoFinancieroDao);

    negocioStore = inject(NegocioStore);
    datePipe = inject(DatePipe);

    error = signal('');

    private readonly cuentasFinancieras$ = new Subject<{ idNegocio: number }>();
    private readonly totalIngresosGastos$ = new Subject<{ idNegocio: number; fechaDesde: Date; fechaHasta: Date }>();
    private readonly ingresosGastosPorPeriodo$ = new Subject<{ idNegocio: number; fechaDesde: Date; fechaHasta: Date }>();
    private readonly ingresosGastosPorCategoria$ = new Subject<{ idNegocio: number; fechaDesde: Date; fechaHasta: Date }>();

    private readonly _i18n = injectBrnCalendarI18n();

    hoy = signal(new Date());

    rangoFechasPeriodos = signal({ fechaDesde: this.calcularHace12Meses(this.hoy()), fechaHasta: this.calcularUltimoDiaMes(this.hoy()) });
    formFechasPeriodos = form(this.rangoFechasPeriodos, (path) => {
        required(path.fechaDesde, { message: 'Debes ingresar la fecha inferior del rango' });
        required(path.fechaHasta, { message: 'Debes ingresar la fecha superior del rango' });
    });

    fechaCategoria = signal({ fecha: this.hoy() });
    formFechaCategoria = form(this.fechaCategoria, (path) => {
        required(path.fecha, { message: 'Debes ingresar el periodo a consultar' });
    });

    cuentasFinancieras = signal<SalCuentaFinanciera[] | null>(null);
    totalIngresosGastos = signal<TotalIngresosGastos | null>(null);
    ingresosGastosPorPeriodo = signal<IngresosGastosPorPeriodo[] | null>(null);
    ingresosGastosPorCategoria = signal<IngresosGastosPorCategoria[] | null>(null);

    saldoActual = computed(() => {
        return this.cuentasFinancieras()?.reduce((acc, item) => acc + item.saldoActual, 0) ?? 0;
    });

    resultadoMesActualPositivo = computed(() => {
        if (this.totalIngresosGastos()) return Math.abs(this.totalIngresosGastos()!.resultado);
        return 0;
    });

    // Se usa de-DE para forzar separador de miles en números de 4 dígitos
    formatoMonto = (v: number) => `${v < 0 ? '-' : ''} $${Math.abs(v).toLocaleString('de-DE')}`;

    optionsBar: ChartOptions<'bar'> = {
        responsive: true,
        scales: {
            x: { stacked: true },
            y: {
                stacked: true,
                ticks: { callback: (value) => this.formatoMonto(Number(value)) },
            },
        },
        plugins: {
            tooltip: {
                backgroundColor: '#2a2d34',
                displayColors: false,
                padding: { top: 10, bottom: 10, left: 14, right: 14 },
                callbacks: {
                    label: (ctx) => this.formatoMonto(ctx.parsed.y ?? 0),
                },
            },
        },
        maintainAspectRatio: false,
        locale: 'es-CL',
    };

    dataPeriodos = computed<ChartData<'bar'> | null>(() => {
        const ingresosGastosPorPeriodo = this.ingresosGastosPorPeriodo();
        if (!ingresosGastosPorPeriodo) return null;

        const periodos = ingresosGastosPorPeriodo.map((ig) => {
            const anno = ig.periodo.substring(0, 4);
            const mes = ig.periodo.substring(4);
            const periodo = new Date(Number(anno), Number(mes) - 1, 1);
            const nombre = this.datePipe.transform(periodo, 'MMMM yyyy')!;
            return nombre.charAt(0).toLocaleUpperCase() + nombre.slice(1);
        });
        const ingresos = ingresosGastosPorPeriodo.map((ig) => ig.totalIngresos);
        const gastos = ingresosGastosPorPeriodo.map((ig) => -ig.totalGastos);

        return {
            labels: periodos,
            datasets: [
                { data: ingresos, label: 'Ingresos', backgroundColor: '#005db2', borderColor: '#005db2', borderWidth: 1, maxBarThickness: 72 },
                { data: gastos, label: 'Gastos', backgroundColor: '#ff9450', borderColor: '#ff9450', borderWidth: 1, maxBarThickness: 72 },
            ],
        };
    });

    optionsLine: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: { offset: true },
            y: {
                ticks: { callback: (value) => this.formatoMonto(Number(value)) },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#2a2d34',
                displayColors: false,
                padding: { top: 10, bottom: 10, left: 14, right: 14 },
                callbacks: {
                    label: (ctx) => this.formatoMonto(ctx.parsed.y ?? 0),
                },
            },
        },
        maintainAspectRatio: false,
        locale: 'es-CL',
    };

    dataResultadoPeriodos = computed<ChartData<'line'> | null>(() => {
        const ingresosGastosPorPeriodo = this.ingresosGastosPorPeriodo();
        if (!ingresosGastosPorPeriodo) return null;

        const periodos = ingresosGastosPorPeriodo.map((ig) => {
            const anno = ig.periodo.substring(0, 4);
            const mes = ig.periodo.substring(4);
            const periodo = new Date(Number(anno), Number(mes) - 1, 1);
            const nombre = this.datePipe.transform(periodo, 'MMMM yyyy')!;
            return nombre.charAt(0).toLocaleUpperCase() + nombre.slice(1);
        });
        const resultados = ingresosGastosPorPeriodo.map((ig) => ig.resultado);

        return {
            labels: periodos,
            datasets: [
                {
                    data: resultados,
                    label: 'Resultado',
                    borderColor: '#02b2cb',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#02b2cb',
                },
            ],
        };
    });

    optionsPie: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                title: {
                    display: true,
                    text: ' ',
                },
            },
            tooltip: {
                backgroundColor: '#2a2d34',
                padding: { top: 10, bottom: 10, left: 14, right: 14 },
                displayColors: false,
                callbacks: {
                    label: (ctx) => this.formatoMonto(ctx.parsed ?? 0),
                },
            },
        },
        locale: 'es-CL',
    };

    dataCategoriasGastos = computed<ChartData<'pie'> | null>(() => {
        const ingresosGastosPorCategoria = this.ingresosGastosPorCategoria()?.filter((ig) => ig.tipoMovimiento === 2);
        if (!ingresosGastosPorCategoria) return null;

        const categorias = ingresosGastosPorCategoria.map((ig) => ig.nombreCategoriaFinanciera ?? 'Sin categoría');
        const montos = ingresosGastosPorCategoria.map((ig) => ig.montoTotal);

        return {
            labels: categorias,
            datasets: [
                {
                    data: montos,
                    backgroundColor: categorias.map((_, i) => this.coloresPara(i)),
                    borderWidth: 0,
                },
            ],
        };
    });

    dataCategoriasIngresos = computed<ChartData<'pie'> | null>(() => {
        const ingresosGastosPorCategoria = this.ingresosGastosPorCategoria()?.filter((ig) => ig.tipoMovimiento === 1);
        if (!ingresosGastosPorCategoria) return null;

        const categorias = ingresosGastosPorCategoria.map((ig) => ig.nombreCategoriaFinanciera ?? 'Sin categoría');
        const montos = ingresosGastosPorCategoria.map((ig) => ig.montoTotal);

        return {
            labels: categorias,
            datasets: [
                {
                    data: montos,
                    backgroundColor: categorias.map((_, i) => this.coloresPara(i)),
                    borderWidth: 0,
                },
            ],
        };
    });

    coloresPara(i: number): string {
        const PALETA = ['#005db2', '#ff9450', '#02b2cb', '#4ea0eb'];
        if (i < PALETA.length) return PALETA[i];

        const hue = ((i - PALETA.length) * 137.5) % 360;
        return `hsl(${hue}, 65%, 55%)`;
    }

    constructor() {
        effect(() => {
            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;

            untracked(() => {
                if (idNegocio) {
                    const hoy = new Date();
                    const desde = this.calcularPrimerDiaMes(hoy);
                    const hasta = this.calcularUltimoDiaMes(hoy);

                    this.obtenerCuentasFinancieras(idNegocio);
                    this.obtenerTotalIngresosGastos(idNegocio, desde, hasta);
                }
            });
        });

        effect(() => {
            if (this.formFechasPeriodos().invalid()) return;

            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
            const fechaDesde = this.formFechasPeriodos.fechaDesde().value();
            const fechaHasta = this.formFechasPeriodos.fechaHasta().value();

            untracked(() => {
                if (idNegocio && fechaDesde && fechaHasta) {
                    this.obtenerIngresosGastosPorPeriodo(idNegocio, this.calcularPrimerDiaMes(fechaDesde), this.calcularUltimoDiaMes(fechaHasta));
                }
            });
        });

        effect(() => {
            if (this.formFechaCategoria().invalid()) return;

            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
            const fecha = this.formFechaCategoria.fecha().value();

            untracked(() => {
                if (idNegocio && fecha) {
                    const fechaDesde = this.calcularPrimerDiaMes(fecha);
                    const fechaHasta = this.calcularUltimoDiaMes(fecha);

                    this.obtenerIngresosGastosPorCategoria(idNegocio, fechaDesde, fechaHasta);
                }
            });
        });

        this.cuentasFinancieras$
            .pipe(
                switchMap((parametros) => {
                    return this.cuentaFinancieraDao.obtenerVigentes(parametros.idNegocio).pipe(
                        tap((res) => {
                            const sorted = res.sort((a, b) => a.id - b.id);
                            this.cuentasFinancieras.set(sorted);
                        }),
                        catchError((err) => {
                            console.error('Error al obtener las cuentas financieras', err);
                            this.error.set(getErrorMessage(err) ?? 'Error al obtener las cuentas financieras');
                            return EMPTY;
                        }),
                        finalize(() => {
                            this.obteniendoCuentasFinancieras.set(false);
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.totalIngresosGastos$
            .pipe(
                switchMap((parametros) => {
                    return this.movimientoFinancieroDao.obtenerTotalIngresosGastos(parametros.idNegocio, parametros.fechaDesde, parametros.fechaHasta).pipe(
                        tap((res) => {
                            this.totalIngresosGastos.set(res);
                        }),
                        catchError((err) => {
                            console.error('Error al obtener el total de ingresos/gastos', err);
                            this.error.set(getErrorMessage(err) ?? 'Error al obtener el total de ingresos/gastos');
                            return EMPTY;
                        }),
                        finalize(() => {
                            this.obteniendoTotalIngresosGastos.set(false);
                        }),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.ingresosGastosPorPeriodo$
            .pipe(
                switchMap((parametros) => {
                    return this.movimientoFinancieroDao
                        .obtenerIngresosGastosPorPeriodo(parametros.idNegocio, parametros.fechaDesde, parametros.fechaHasta)
                        .pipe(
                            tap((res) => {
                                const sorted = res.sort((a, b) => Number(a.periodo) - Number(b.periodo));
                                this.ingresosGastosPorPeriodo.set(sorted);
                            }),
                            catchError((err) => {
                                console.error('Error al obtener los ingresos/gastos por periodo', err);
                                this.error.set(getErrorMessage(err) ?? 'Error al obtener los ingresos/gastos por periodo');
                                return EMPTY;
                            }),
                            finalize(() => {
                                this.obteniendoIngresosGastosPorPeriodo.set(false);
                            }),
                        );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.ingresosGastosPorCategoria$
            .pipe(
                switchMap((parametros) => {
                    return this.movimientoFinancieroDao
                        .obtenerIngresosGastosPorCategoria(parametros.idNegocio, parametros.fechaDesde, parametros.fechaHasta)
                        .pipe(
                            tap((res) => {
                                const sorted = res.sort((a, b) => b.montoTotal - a.montoTotal);
                                this.ingresosGastosPorCategoria.set(sorted);
                            }),
                            catchError((err) => {
                                console.error('Error al obtener los ingresos/gastos por categoría', err);
                                this.error.set(getErrorMessage(err) ?? 'Error al obtener los ingresos/gastos por categoría');
                                return EMPTY;
                            }),
                            finalize(() => {
                                this.obteniendoIngresosGastosPorCategoria.set(false);
                            }),
                        );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    ngOnInit(): void {
        this._i18n.use({
            months: () => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        });
    }

    obteniendoCuentasFinancieras = signal(false);
    obtenerCuentasFinancieras(idNegocio: number) {
        this.obteniendoCuentasFinancieras.set(true);

        this.cuentasFinancieras$.next({
            idNegocio,
        });
    }

    obteniendoTotalIngresosGastos = signal(false);
    obtenerTotalIngresosGastos(idNegocio: number, fechaDesde: Date, fechaHasta: Date) {
        this.obteniendoTotalIngresosGastos.set(true);

        this.totalIngresosGastos$.next({
            idNegocio,
            fechaDesde,
            fechaHasta,
        });
    }

    obteniendoIngresosGastosPorPeriodo = signal(false);
    obtenerIngresosGastosPorPeriodo(idNegocio: number, fechaDesde: Date, fechaHasta: Date) {
        this.obteniendoIngresosGastosPorPeriodo.set(true);

        this.ingresosGastosPorPeriodo$.next({ idNegocio, fechaDesde, fechaHasta });
    }

    obteniendoIngresosGastosPorCategoria = signal(false);
    obtenerIngresosGastosPorCategoria(idNegocio: number, fechaDesde: Date, fechaHasta: Date) {
        this.obteniendoIngresosGastosPorCategoria.set(true);

        this.ingresosGastosPorCategoria$.next({ idNegocio, fechaDesde, fechaHasta });
    }

    calcularPrimerDiaMes(referencia: Date) {
        return new Date(referencia.getFullYear(), referencia.getMonth(), 1, 0, 0, 0, 0);
    }

    calcularUltimoDiaMes(referencia: Date) {
        return new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    calcularHace12Meses(referencia: Date) {
        return new Date(referencia.getFullYear(), referencia.getMonth() - 11, 1, 0, 0, 0, 0);
    }
}
