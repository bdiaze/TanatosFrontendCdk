import { PopupFuncionalidadBloqueada } from '@/app/components/popup-funcionalidad-bloqueada/popup-funcionalidad-bloqueada';
import { CategoriaFinancieraDao } from '@/app/daos/categoria-financiera-dao';
import { MovimientoFinancieroDao } from '@/app/daos/movimiento-financiero-dao';
import { FormatoDinero } from '@/app/directives/formato-dinero';
import { EntMovimientoFinancieroActualizar } from '@/app/entities/others/ent-movimiento-financiero-actualizar';
import { EntMovimientoFinancieroCrear } from '@/app/entities/others/ent-movimiento-financiero-crear';
import { SalCategoriaFinanciera } from '@/app/entities/others/sal-categoria-financiera';
import { SalMovimientoFinanciero } from '@/app/entities/others/sal-movimiento-financiero';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { NgClass } from '@angular/common';
import {
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    untracked,
    viewChild,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideMinus, lucidePlus, lucideWallet } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-modal-nuevo-movimiento',
    imports: [
        ReactiveFormsModule,
        HlmCardImports,
        HlmIcon,
        NgIcon,
        PopupFuncionalidadBloqueada,
        FormatoDinero,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmSkeletonImports,
        HlmSpinnerImports,
        HlmAlertImports,
        HlmButtonImports,
        HlmDatePickerImports,
        HlmSelectImports,
        NgClass,
    ],
    templateUrl: './modal-nuevo-movimiento.html',
    styleUrl: './modal-nuevo-movimiento.scss',
    providers: [
        provideIcons({ lucideWallet, lucidePlus, lucideMinus, lucideChevronDown }),
        provideHlmDatePickerConfig({
            autoCloseOnSelect: true,
            formatDate: (date: Date) => {
                return new Intl.DateTimeFormat('es-CL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            },
        }),
    ],
})
export class ModalNuevoMovimiento implements OnInit, OnDestroy {
    idCuentaFinanciera = input.required<number>();
    movimiento = input<SalMovimientoFinanciero | null>(null);
    notificarCambio = output<SalMovimientoFinanciero>();
    cerrar = output<void>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly movimientoFinancieroDao = inject(MovimientoFinancieroDao);
    private readonly categoriaFinancieraDao = inject(CategoriaFinancieraDao);

    private readonly negocioStore = inject(NegocioStore);

    error = signal('');
    procesando = signal<boolean>(false);

    form: FormGroup<{
        descripcion: FormControl<string | null>;
        monto: FormControl<string | null>;
        tipoMovimiento: FormControl<number | null>;
        fechaMovimiento: FormControl<Date | null>;
        horaMovimiento: FormControl<string | null>;
        idCategoriaFinanciera: FormControl<number | null>;
    }> = new FormGroup({
        descripcion: new FormControl<string | null>({ value: null, disabled: false }),
        monto: new FormControl<string | null>({ value: null, disabled: false }, { validators: [Validators.required, Validators.min(0)] }),
        tipoMovimiento: new FormControl<number | null>({ value: 1, disabled: false }),
        fechaMovimiento: new FormControl<Date | null>({ value: new Date(), disabled: false }, { validators: [Validators.required] }),
        horaMovimiento: new FormControl<string | null>({ value: this.extraerHora(), disabled: false }, { validators: [Validators.required] }),
        idCategoriaFinanciera: new FormControl<number | null>({ value: 0, disabled: false }),
    });

    readonly tipoMovimiento = toSignal(this.form.controls.tipoMovimiento.valueChanges, { initialValue: this.form.controls.tipoMovimiento.value });
    readonly idCategoriaFinanciera = toSignal(this.form.controls.idCategoriaFinanciera.valueChanges, {
        initialValue: this.form.controls.idCategoriaFinanciera.value,
    });

    constructor() {
        effect(() => {
            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
            untracked(() => {
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            });
        });

        effect(() => {
            const movimiento = this.movimiento();
            untracked(() => {
                if (movimiento) {
                    const fecha = new Date(movimiento.fechaMovimiento);

                    this.form.controls.descripcion.setValue(movimiento.descripcion);
                    this.form.controls.monto.setValue(String(movimiento.monto));
                    this.form.controls.tipoMovimiento.setValue(movimiento.tipoMovimiento);
                    this.form.controls.fechaMovimiento.setValue(fecha);
                    this.form.controls.horaMovimiento.setValue(this.extraerHora(fecha));
                    this.form.controls.idCategoriaFinanciera.setValue(movimiento.idCategoriaFinanciera ?? 0);
                }
            });
        });
    }

    ngOnInit(): void {
        document.body.classList.add('overflow-hidden!', 'md:pr-1.25');
    }

    ngOnDestroy(): void {
        document.body.classList.remove('overflow-hidden!', 'md:pr-1.25');
    }

    categorias = signal([] as SalCategoriaFinanciera[]);
    categoriasMostrar = computed(() => {
        const categorias = this.categorias();
        const tipoMovimiento = this.tipoMovimiento(); // 1: Ingreso - 2: Gasto - 3: Ambos
        return [
            {
                id: 0,
                nombre: 'Sin categoría',
                tipoMovimiento: 3,
            } as SalCategoriaFinanciera,
            ...categorias
                .filter((c) => c.tipoMovimiento == tipoMovimiento || c.tipoMovimiento == 3)
                .sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())),
        ];
    });

    categoriaItemToString = (value: number) => {
        return this.categoriasMostrar().find((c) => c.id === value)?.nombre ?? '';
    };

    cargandoCategorias = signal(false);
    obtenerCategorias(idNegocio: number) {
        this.cargandoCategorias.set(true);
        this.categoriaFinancieraDao
            .obtenerVigentes(idNegocio)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.categorias.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener las categorías financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las categorías financieras');
                },
            })
            .add(() => {
                this.cargandoCategorias.set(false);
            });
    }

    readonly inputMonto = viewChild<ElementRef<HTMLInputElement>>('inputMonto');

    seleccionarTipoMovimiento(tipoMovimiento: 1 | 2) {
        this.form.controls.tipoMovimiento.setValue(tipoMovimiento);
        this.form.controls.idCategoriaFinanciera.setValue(0);
        this.inputMonto()?.nativeElement.focus();
    }

    clickConfirmar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        let idCategoriaFinanciera = this.form.controls.idCategoriaFinanciera.value;
        if (idCategoriaFinanciera === 0) idCategoriaFinanciera = null;
        const tipoMovimiento = this.form.controls.tipoMovimiento.value!;
        const monto = Number(this.form.controls.monto.value!.replace(/\D+/g, ''));
        const descripcion = this.form.controls.descripcion.value;
        const fechaMovimiento = this.form.controls.fechaMovimiento.value!;
        const [h, m] = this.form.controls.horaMovimiento.value!.split(':').map(Number);
        fechaMovimiento.setHours(h, m, 0, 0);

        this.procesando.set(true);

        if (this.movimiento()) {
            this.movimientoFinancieroDao
                .actualizar({
                    idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                    idCuentaFinanciera: this.idCuentaFinanciera(),
                    idMovimientoFinanciero: this.movimiento()!.id,
                    idCategoriaFinanciera: idCategoriaFinanciera,
                    tipoMovimiento: tipoMovimiento,
                    monto: monto,
                    fechaMovimiento: fechaMovimiento.toISOString(),
                    descripcion: descripcion,
                } as EntMovimientoFinancieroActualizar)
                .subscribe({
                    next: (res) => {
                        this.notificarCambio.emit(res);
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        console.error('Error al actualizar el movimiento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al actualizar el movimiento');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                });
        } else {
            this.movimientoFinancieroDao
                .crear({
                    idCuentaFinanciera: this.idCuentaFinanciera(),
                    idCategoriaFinanciera: idCategoriaFinanciera,
                    tipoMovimiento: tipoMovimiento,
                    monto: monto,
                    fechaMovimientoUtc: fechaMovimiento.toISOString(),
                    descripcion: descripcion,
                } as EntMovimientoFinancieroCrear)
                .subscribe({
                    next: (res) => {
                        this.notificarCambio.emit(res);
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        console.error('Error al registrar el movimiento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al registrar el movimiento');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                });
        }
    }

    invalid(llave: string, formGroup: FormGroup | null = null) {
        let control;
        if (formGroup != null) {
            control = formGroup.get(llave);
        } else {
            control = this.form.get(llave);
        }
        return control?.invalid && control?.touched;
    }

    extraerHora(fecha: Date | null = null): string {
        fecha ??= new Date();
        const hh = String(fecha.getHours()).padStart(2, '0');
        const mm = String(fecha.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    @ViewChild('overlay', { static: true })
    overlay!: ElementRef<HTMLDivElement>;

    private pointerStartedInOverlay = false;

    @HostListener('document:pointerdown', ['$event'])
    onPointerDown(event: PointerEvent) {
        this.pointerStartedInOverlay = event.target === this.overlay.nativeElement;
    }

    @HostListener('document:pointercancel')
    onPointerCancel() {
        this.pointerStartedInOverlay = false;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: PointerEvent) {
        if (this.pointerStartedInOverlay && event.target === this.overlay.nativeElement) {
            this.cerrar.emit();
        }

        this.pointerStartedInOverlay = false;
    }
}
