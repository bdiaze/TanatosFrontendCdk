import { CuentaFinancieraDao } from '@/app/daos/cuenta-financiera-dao';
import { SalCuentaFinanciera } from '@/app/entities/others/sal-cuenta-financiera';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal, untracked, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmP, HlmH4 } from '@spartan-ng/helm/typography';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { lucidePlus, lucideSquareChevronDown, lucideTriangleAlert } from '@ng-icons/lucide';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { CampoDinamico, ModalEdicion, PosiblesValores } from '@/app/components/modal-edicion/modal-edicion';
import { EntCuentaFinancieraCrear } from '@/app/entities/others/ent-cuenta-financiera-crear';
import { SalTipoCuentaFinanciera } from '@/app/entities/others/sal-tipo-cuenta-financiera';
import { TipoCuentaFinancieraDao } from '@/app/daos/tipo-cuenta-financiera-dao';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { EntCuentaFinancieraActualizar } from '@/app/entities/others/ent-cuenta-financiera-actualizar';

@Component({
    selector: 'app-cuentas-financieras',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmItemImports,
        HlmIcon,
        NgIcon,
        HlmSkeletonImports,
        HlmAlertImports,
        NgClass,
        DecimalPipe,
        HlmP,
        HlmH4,
        HlmButtonImports,
        HlmDropdownMenuImports,
    ],
    templateUrl: './cuentas-financieras.html',
    styleUrl: './cuentas-financieras.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [provideIcons({ lucidePlus, lucideSquareChevronDown, lucideTriangleAlert })],
})
export class CuentasFinancieras implements OnInit {
    ayudaRunning = input<boolean>(false);
    selectionChanged = output<number | null>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly cuentaFinancieraDao = inject(CuentaFinancieraDao);
    private readonly tiposCuentasFinancierasDao = inject(TipoCuentaFinancieraDao);

    negocioStore = inject(NegocioStore);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'idTipoCuentaFinanciera',
            nombre: 'Tipo de Cuenta',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [],
        },
    ]);

    camposCreacion = signal<CampoDinamico[]>([
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'idTipoCuentaFinanciera',
            nombre: 'Tipo de Cuenta',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [],
        },
        {
            llave: 'saldoInicial',
            nombre: 'Saldo',
            tipo: 'money',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'fechaSaldoInicialUtc',
            nombre: 'Fecha',
            tipo: 'fecha',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    private readonly cuentas = signal([] as SalCuentaFinanciera[]);
    cuentasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    id: -1,
                    nombre: 'Cuenta de Prueba',
                    nombreTipoCuentaFinanciera: 'Cuenta Corriente',
                    saldoActual: 430_000,
                },
            ] as SalCuentaFinanciera[];
        }
        return this.cuentas();
    });

    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<SalCuentaFinanciera | null>(null);

    constructor() {
        effect(() => {
            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;

            untracked(() => {
                if (idNegocio) {
                    this.seleccionarCuenta(null);
                    this.obtenerCuentas(idNegocio);
                }
            });
        });

        effect(() => {
            const tiposCuentas = this.tiposCuentas();

            untracked(() => {
                const posiblesValoresTiposCuentas = [] as PosiblesValores[];
                tiposCuentas.forEach((tipoCuenta) => {
                    posiblesValoresTiposCuentas.push({
                        id: tipoCuenta.id,
                        valor: tipoCuenta.nombre,
                    });
                });

                this.camposEdicion.update((lista) =>
                    lista.map((u) => (u.llave === 'idTipoCuentaFinanciera' ? { ...u, posiblesValores: posiblesValoresTiposCuentas } : u)),
                );
                this.camposCreacion.update((lista) =>
                    lista.map((u) => (u.llave === 'idTipoCuentaFinanciera' ? { ...u, posiblesValores: posiblesValoresTiposCuentas } : u)),
                );
            });
        });
    }

    ngOnInit(): void {
        this.obtenerTiposCuentas();
    }

    refreshInformacionCuentas() {
        const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
        if (idNegocio) {
            this.obtenerCuentas(idNegocio);
        }
    }

    obtenerCuentas(idNegocio: number) {
        this.cargando.set(true);

        this.cuentaFinancieraDao
            .obtenerVigentes(idNegocio)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.cuentas.set(sorted);

                    const yaSeleccionado = sorted.find((c) => c.id === this.itemSeleccionado()?.id);
                    if (yaSeleccionado) {
                        this.seleccionarCuenta(yaSeleccionado);
                    } else {
                        this.seleccionarCuenta(sorted.length > 0 ? sorted[0] : null);
                    }
                },
                error: (err) => {
                    console.error('Error al obtener las cuentas financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las cuentas financieras');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    private readonly tiposCuentas = signal([] as SalTipoCuentaFinanciera[]);
    cargandoTiposCuentas = signal(true);

    obtenerTiposCuentas() {
        this.cargandoTiposCuentas.set(true);
        this.tiposCuentas.set([]);
        this.tiposCuentasFinancierasDao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.tiposCuentas.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener tipos de cuentas financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener tipos de cuentas financieras');
                },
            })
            .add(() => {
                this.cargandoTiposCuentas.set(false);
            });
    }

    seleccionarCuenta(cuentaFinanciera: SalCuentaFinanciera | null) {
        this.itemSeleccionado.set(cuentaFinanciera);
        this.selectionChanged.emit(cuentaFinanciera?.id ?? null);
    }

    fechaActual() {
        return new Date();
    }

    itemEliminacion = signal<SalCuentaFinanciera | null>(null);

    openModalEliminar(item: SalCuentaFinanciera) {
        this.itemEliminacion.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemEliminacion.set(null);
    }

    eliminar(item: SalCuentaFinanciera) {
        this.cargando.set(true);
        this.error.set('');

        this.cuentaFinancieraDao
            .eliminar(item.id)
            .subscribe({
                next: () => {
                    this.cuentas.update((c) => c.filter((i) => i.id !== item.id));
                    if (this.itemSeleccionado()?.id === item.id) {
                        const cuenta = this.cuentas().length > 0 ? this.cuentas()[0] : null;
                        this.seleccionarCuenta(cuenta);
                    }
                },
                error: (err) => {
                    console.error('Error al eliminar la cuenta financiera', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al eliminar la cuenta financiera');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });

        this.showModalEliminar.set(false);
    }

    itemEdicion = signal<SalCuentaFinanciera | null>(null);

    openModalEditar(item: SalCuentaFinanciera) {
        this.itemEdicion.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemEdicion.set(null);
    }

    editar(item: EntCuentaFinancieraActualizar) {
        this.cargando.set(true);
        this.error.set('');

        this.cuentaFinancieraDao
            .actualizar(item)
            .subscribe({
                next: (res) => {
                    this.cuentas.update((c) => c.map((e) => (e.id === res.id ? res : e)));
                },
                error: (err) => {
                    console.error('Error al editar la cuenta financiera', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al editar la cuenta financiera');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });

        this.showModalEditar.set(false);
    }

    openModalCrear() {
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
    }

    crear(item: any) {
        this.cargando.set(true);
        this.error.set('');

        item.fechaSaldoInicialUtc.setHours(0, 0, 0, 0);

        this.cuentaFinancieraDao
            .crear({
                idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                nombre: item.nombre,
                idTipoCuentaFinanciera: item.idTipoCuentaFinanciera,
                saldoInicial: item.saldoInicial,
                fechaSaldoInicialUtc: item.fechaSaldoInicialUtc.toISOString(),
            } as EntCuentaFinancieraCrear)
            .subscribe({
                next: (res) => {
                    this.cuentas.update((c) => [...c, res]);

                    const yaSeleccionado = this.cuentas().find((c) => c.id === this.itemSeleccionado()?.id);
                    if (yaSeleccionado) {
                        this.seleccionarCuenta(yaSeleccionado);
                    } else {
                        this.seleccionarCuenta(this.cuentas().length > 0 ? this.cuentas()[0] : null);
                    }
                },
                error: (err) => {
                    console.error('Error al crear la cuenta financiera', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al crear la cuenta financiera');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });

        this.showModalCrear.set(false);
    }
}
