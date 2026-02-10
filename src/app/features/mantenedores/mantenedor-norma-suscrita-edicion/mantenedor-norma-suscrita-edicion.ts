import { CategoriaNormaDao } from '@/app/daos/categoria-norma-dao';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { TipoFiscalizadorDao } from '@/app/daos/tipo-fiscalizador-dao';
import { TipoPeriodicidadDao } from '@/app/daos/tipo-periodicidad-dao';
import { TipoUnidadTiempoDao } from '@/app/daos/tipo-unidad-tiempo-dao';
import { CategoriaNorma } from '@/app/entities/models/categoria-norma';
import { TipoFiscalizador } from '@/app/entities/models/tipo-fiscalizador';
import { TipoPeriodicidad } from '@/app/entities/models/tipo-periodicidad';
import { TipoUnidadTiempo } from '@/app/entities/models/tipo-unidad-tiempo';
import { EntNormaSuscritaActualizar } from '@/app/entities/others/ent-norma-suscrita-actualizar';
import { EntNormaSuscritaCrear } from '@/app/entities/others/ent-norma-suscrita-crear';
import { SalNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucidePlus,
    lucideSquarePen,
    lucideX,
} from '@ng-icons/lucide';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
    selector: 'app-mantenedor-norma-suscrita-edicion',
    imports: [
        ReactiveFormsModule,
        HlmButtonImports,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmSwitch,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmIcon,
        NgIcon,
        HlmTextareaImports,
        BrnSelectImports,
        HlmSelectImports,
        HlmSpinnerImports,
        HlmIconImports,
        HlmAlertImports,
        HlmP,
        HlmH3,
        HlmH4,
        HlmBadgeImports,
        FormsModule,
        RouterLink,
        HlmDropdownMenuImports,
        HlmDatePickerImports,
        BrnPopoverImports,
        HlmPopoverImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
    ],
    templateUrl: './mantenedor-norma-suscrita-edicion.html',
    styleUrl: './mantenedor-norma-suscrita-edicion.scss',
    providers: [
        provideIcons({
            lucideBadgeCheck,
            lucideBadgeX,
            lucidePlus,
            lucideX,
            lucideSquarePen,
        }),
        provideHlmDatePickerConfig({
            autoCloseOnSelect: true,
            formatDate: (date: Date) => {
                return new Intl.DateTimeFormat('es-CL', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }).format(date);
            },
        }),
    ],
})
export class MantenedorNormaSuscritaEdicion implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    idNormaSuscrita = signal<number | null>(null);

    normaSuscritaDao = inject(NormaSuscritaDao);
    categoriaNormaDao = inject(CategoriaNormaDao);
    tipoPeriodicidadDao = inject(TipoPeriodicidadDao);
    tipoFiscalizadorDao = inject(TipoFiscalizadorDao);
    tipoUnidadTiempoDao = inject(TipoUnidadTiempoDao);

    negocioStore = inject(NegocioStore);

    form: FormGroup<{
        nombre: FormControl<string | null>;
        descripcion: FormControl<string | null>;
        idTipoPeriodicidad: FormControl<number | null>;
        multa: FormControl<string | null>;
        idCategoriaNorma: FormControl<number | null>;
        activado: FormControl<boolean | null>;
        fiscalizadores: FormArray<
            FormGroup<{
                idTipoFiscalizador: FormControl<number | null>;
            }>
        >;
        notificaciones: FormArray<
            FormGroup<{
                idTipoUnidadTiempoAntelacion: FormControl<number | null>;
                cantAntelacion: FormControl<number | null>;
            }>
        >;
        fechaProximoVencimiento: FormControl<Date | null>;
        horaProximoVencimiento: FormControl<string | null>;
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        descripcion: new FormControl<string | null>({ value: null, disabled: false }),
        idTipoPeriodicidad: new FormControl<number | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        multa: new FormControl<string | null>({ value: null, disabled: false }),
        idCategoriaNorma: new FormControl<number | null>({ value: null, disabled: false }),
        activado: new FormControl<boolean | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        fiscalizadores: new FormArray<
            FormGroup<{
                idTipoFiscalizador: FormControl<number | null>;
            }>
        >([]),
        notificaciones: new FormArray<
            FormGroup<{
                idTipoUnidadTiempoAntelacion: FormControl<number | null>;
                cantAntelacion: FormControl<number | null>;
            }>
        >([]),
        fechaProximoVencimiento: new FormControl<Date | null>({ value: null, disabled: false }),
        horaProximoVencimiento: new FormControl<string | null>({ value: null, disabled: false }),
    });

    item = signal<SalNormaSuscrita | null>(null);

    titulo = computed<string>(() => {
        if (this.item()) {
            return `Edita la obligación "${
                this.item()?.nombre ?? this.item()?.templateNorma?.nombre
            }"`;
        }
        return `Crea una obligación nueva:`;
    });

    error = signal<string>('');

    cargandoNormaSuscrita = signal<boolean>(false);

    cargandoCategoriasVigentes = signal<boolean>(true);
    categoriasVigentes = signal<CategoriaNorma[]>([]);

    cargandoPeriodicidadVigentes = signal<boolean>(true);
    periodicidadesVigentes = signal<TipoPeriodicidad[]>([]);

    cargandoFiscalizadoresVigentes = signal<boolean>(true);
    fiscalizadoresVigentes = signal<TipoFiscalizador[]>([]);

    cargandoUnidadesTiempoVigentes = signal<boolean>(true);
    unidadesTiempoVigentes = signal<TipoUnidadTiempo[]>([]);

    procesando = signal<boolean>(false);

    minDate = signal<Date>(new Date());

    constructor() {
        effect(() => {
            if (this.cargandoCategoriasVigentes()) {
                this.form.controls['idCategoriaNorma'].disable();
            } else {
                this.form.controls['idCategoriaNorma'].enable();
            }
        });

        effect(() => {
            if (this.cargandoPeriodicidadVigentes()) {
                this.form.controls['idTipoPeriodicidad'].disable();
            } else {
                this.form.controls['idTipoPeriodicidad'].enable();
            }
        });

        effect(() => {
            if (this.idNormaSuscrita()) {
                this.cargandoNormaSuscrita.set(true);
                this.normaSuscritaDao
                    .obtenerPorId(this.idNormaSuscrita()!)
                    .subscribe({
                        next: (normaSuscrita) => {
                            this.item.set(normaSuscrita);
                        },
                        error: (err) => {
                            console.error('Error al obtener la información de la obligación', err);
                            this.error.set(
                                getErrorMessage(err) ??
                                    'Error al obtener la información de la obligación',
                            );
                        },
                    })
                    .add(() => {
                        this.cargandoNormaSuscrita.set(false);
                    });
            }
        });

        effect(() => {
            if (this.item()) {
                const fechaVencimiento = this.item()?.proximoVencimiento
                    ? new Date(this.item()!.proximoVencimiento!)
                    : null;

                let fechaProximoVencimiento = null;
                if (fechaVencimiento != null) {
                    fechaProximoVencimiento = new Date(
                        fechaVencimiento.getFullYear(),
                        fechaVencimiento.getMonth(),
                        fechaVencimiento.getDate(),
                    );
                }
                let horaProximoVencimiento = null;
                if (fechaVencimiento != null) {
                    horaProximoVencimiento = new Intl.DateTimeFormat('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }).format(fechaVencimiento);
                }

                this.form.patchValue({
                    nombre: this.item()?.nombre ?? this.item()?.templateNorma?.nombre,
                    descripcion:
                        this.item()?.descripcion ?? this.item()?.templateNorma?.descripcion,
                    idTipoPeriodicidad:
                        this.item()?.idTipoPeriodicidad ??
                        this.item()?.templateNorma?.idTipoPeriodicidad,
                    multa: this.item()?.multa ?? this.item()?.templateNorma?.multa,
                    idCategoriaNorma:
                        this.item()?.idCategoriaNorma ??
                        this.item()?.templateNorma?.idCategoriaNorma,
                    activado: this.item()?.activado,
                    fechaProximoVencimiento: fechaProximoVencimiento ?? undefined,
                    horaProximoVencimiento: horaProximoVencimiento ?? undefined,
                });

                (this.form.get('fiscalizadores') as FormArray).clear();
                if (this.item()!.fiscalizadores && this.item()!.fiscalizadores!.length > 0) {
                    this.item()!.fiscalizadores?.forEach((fiscalizador) => {
                        (this.form.get('fiscalizadores') as FormArray).push(
                            new FormGroup({
                                idTipoFiscalizador: new FormControl(
                                    fiscalizador.idTipoFiscalizador,
                                    {
                                        nonNullable: true,
                                        validators: [Validators.required],
                                    },
                                ),
                            }),
                        );
                    });
                } else {
                    this.item()!.templateNorma?.fiscalizadores?.forEach((fiscalizador) => {
                        (this.form.get('fiscalizadores') as FormArray).push(
                            new FormGroup({
                                idTipoFiscalizador: new FormControl(
                                    fiscalizador.idTipoFiscalizador,
                                    {
                                        nonNullable: true,
                                        validators: [Validators.required],
                                    },
                                ),
                            }),
                        );
                    });
                }

                (this.form.get('notificaciones') as FormArray).clear();
                if (this.item()!.notificaciones && this.item()!.notificaciones!.length > 0) {
                    this.item()!.notificaciones?.forEach((notificacion) => {
                        (this.form.get('notificaciones') as FormArray).push(
                            new FormGroup({
                                idTipoUnidadTiempoAntelacion: new FormControl(
                                    notificacion.idTipoUnidadTiempoAntelacion,
                                    {
                                        nonNullable: true,
                                        validators: [Validators.required],
                                    },
                                ),
                                cantAntelacion: new FormControl(notificacion.cantAntelacion, {
                                    nonNullable: true,
                                    validators: [Validators.required],
                                }),
                            }),
                        );
                    });
                } else {
                    this.item()!.templateNorma?.notificaciones?.forEach((notificacion) => {
                        (this.form.get('notificaciones') as FormArray).push(
                            new FormGroup({
                                idTipoUnidadTiempoAntelacion: new FormControl(
                                    notificacion.idTipoUnidadTiempoAntelacion,
                                    {
                                        nonNullable: true,
                                        validators: [Validators.required],
                                    },
                                ),
                                cantAntelacion: new FormControl(notificacion.cantAntelacion, {
                                    nonNullable: true,
                                    validators: [Validators.required],
                                }),
                            }),
                        );
                    });
                }
            } else {
                this.form.patchValue({
                    nombre: null,
                    descripcion: null,
                    idTipoPeriodicidad: null,
                    multa: null,
                    idCategoriaNorma: null,
                    activado: false,
                    fechaProximoVencimiento: undefined,
                    horaProximoVencimiento: undefined,
                });

                (this.form.get('fiscalizadores') as FormArray).clear();
                (this.form.get('notificaciones') as FormArray).clear();
            }
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.error.set('');
            this.item.set(null);

            const param = params.get('idNormaSuscrita');
            if (param) {
                this.idNormaSuscrita.set(Number(param));
            } else {
                this.idNormaSuscrita.set(null);
            }
        });

        this.form.controls['activado']!.valueChanges.subscribe((activado: boolean | null) => {
            const fechaProximoVencimiento = this.form.controls['fechaProximoVencimiento'];
            const horaProximoVencimiento = this.form.controls['horaProximoVencimiento'];

            if (activado) {
                fechaProximoVencimiento.addValidators(Validators.required);
                horaProximoVencimiento.addValidators(Validators.required);
            } else {
                fechaProximoVencimiento.removeValidators(Validators.required);
                horaProximoVencimiento.removeValidators(Validators.required);
            }
            fechaProximoVencimiento.updateValueAndValidity();
            horaProximoVencimiento.updateValueAndValidity();
        });

        this.cargandoCategoriasVigentes.set(true);
        this.categoriaNormaDao
            .obtenerVigentes()
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.categoriasVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener categorías vigentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener categorías vigentes');
                },
            })
            .add(() => {
                this.cargandoCategoriasVigentes.set(false);
            });

        this.cargandoPeriodicidadVigentes.set(true);
        this.tipoPeriodicidadDao
            .obtenerVigentes()
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) => a.id - b.id);
                    this.periodicidadesVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener periodicidades vigentes', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener periodicidades vigentes',
                    );
                },
            })
            .add(() => {
                this.cargandoPeriodicidadVigentes.set(false);
            });

        this.cargandoFiscalizadoresVigentes.set(true);
        this.tipoFiscalizadorDao
            .obtenerVigentes()
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.fiscalizadoresVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener fiscalizadores vigentes', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener fiscalizadores vigentes',
                    );
                },
            })
            .add(() => {
                this.cargandoFiscalizadoresVigentes.set(false);
            });

        this.cargandoUnidadesTiempoVigentes.set(true);
        this.tipoUnidadTiempoDao
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    res = res.sort((a, b) => a.id - b.id);
                    this.unidadesTiempoVigentes.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener unidades de tiempo vigentes', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener unidades de tiempo vigentes',
                    );
                },
            })
            .add(() => {
                this.cargandoUnidadesTiempoVigentes.set(false);
            });
    }

    formFiscalizador = '';

    agregarFiscalizador() {
        const idFiscalizador = this.formFiscalizador;

        this.formFiscalizador = '';

        const idx = (this.form.controls['fiscalizadores'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoFiscalizador']?.value === idFiscalizador,
        );

        if (idx !== -1) {
            return;
        }

        (this.form.controls['fiscalizadores'] as FormArray).push(
            new FormGroup({
                idTipoFiscalizador: new FormControl(idFiscalizador, {
                    nonNullable: true,
                }),
            }),
        );
    }

    quitarFiscalizador(idFiscalizador: number) {
        const idx = (this.form.controls['fiscalizadores'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoFiscalizador']?.value === idFiscalizador,
        );

        if (idx !== -1) {
            (this.form.controls['fiscalizadores'] as FormArray).removeAt(idx);
        }
    }

    nombreFiscalizador(idFiscalizador: number): string {
        const fiscalizador = this.fiscalizadoresVigentes().find(
            (fiscalizador: TipoFiscalizador) => fiscalizador.id === idFiscalizador,
        );
        return fiscalizador?.nombreCorto && fiscalizador.nombreCorto.trim() !== ''
            ? fiscalizador.nombreCorto
            : fiscalizador?.nombre!;
    }

    formNotifCantTiempo = '';
    formNotifUnidadTiempo = '';

    agregarNotificacionPrevia() {
        const cantTiempo = this.formNotifCantTiempo;
        const idUnidadTiempo = this.formNotifUnidadTiempo;

        this.formNotifCantTiempo = '';
        this.formNotifUnidadTiempo = '';

        const idx = (this.form.controls['notificaciones'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['cantAntelacion']?.value === cantTiempo &&
                ctrl.controls['idTipoUnidadTiempoAntelacion']?.value === idUnidadTiempo,
        );

        if (idx !== -1) {
            return;
        }

        (this.form.controls['notificaciones'] as FormArray).push(
            new FormGroup({
                idTipoUnidadTiempoAntelacion: new FormControl(idUnidadTiempo, {
                    nonNullable: true,
                }),
                cantAntelacion: new FormControl(cantTiempo, {
                    nonNullable: true,
                }),
            }),
        );
    }

    quitarNotificacionPrevia(cantAntelacion: number, idTipoUnidadTiempoAntelacion: number) {
        const idx = (this.form.controls['notificaciones'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['cantAntelacion']?.value === cantAntelacion &&
                ctrl.controls['idTipoUnidadTiempoAntelacion']?.value ===
                    idTipoUnidadTiempoAntelacion,
        );

        if (idx !== -1) {
            (this.form.controls['notificaciones'] as FormArray).removeAt(idx);
        }
    }

    nombreUnidadTiempo(idUnidadTiempo: number, cantUnidadTiempo: number | null = null): string {
        const unidadTiempo = this.unidadesTiempoVigentes().find(
            (unidadTiempo: TipoUnidadTiempo) => unidadTiempo.id === idUnidadTiempo,
        );

        let cantidad = '';
        if (cantUnidadTiempo) {
            cantidad = `${cantUnidadTiempo}`;
        }

        let plural = '';
        if (cantUnidadTiempo && cantUnidadTiempo > 1) {
            plural = 's';
        }

        return `${cantidad} ${unidadTiempo?.nombre!}${plural}`;
    }

    clickConfirmar() {
        if (this.item()) {
            let proximoVencimiento = null;
            if (this.form.controls['activado'].value!) {
                const fechaProximoVencimiento =
                    this.form.controls['fechaProximoVencimiento'].value!;
                const [hora, minuto] = this.form.controls['horaProximoVencimiento']
                    .value!.split(':')
                    .map(Number);
                proximoVencimiento = new Date(
                    fechaProximoVencimiento.getFullYear(),
                    fechaProximoVencimiento.getMonth(),
                    fechaProximoVencimiento.getDate(),
                    hora,
                    minuto,
                    0,
                    0,
                );
            }

            const normaSuscrita: EntNormaSuscritaActualizar = {
                id: this.item()!.id,
                idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                nombre: this.form.controls['nombre'].value!,
                descripcion: this.form.controls['descripcion'].value!,
                idTipoPeriodicidad: this.form.controls['idTipoPeriodicidad'].value!,
                multa: this.form.controls['multa'].value,
                idCategoriaNorma: this.form.controls['idCategoriaNorma'].value!,
                activado: this.form.controls['activado'].value!,
                fiscalizadores: [],
                notificaciones: [],
                proximoVencimiento: proximoVencimiento ? proximoVencimiento.toISOString() : null,
            };

            this.form.controls['fiscalizadores'].controls.forEach((fiscalizadorControl) => {
                normaSuscrita.fiscalizadores?.push({
                    idTipoFiscalizador: fiscalizadorControl.controls['idTipoFiscalizador'].value!,
                });
            });

            this.form.controls['notificaciones'].controls.forEach((notificacionControl) => {
                normaSuscrita.notificaciones?.push({
                    idTipoUnidadTiempoAntelacion:
                        notificacionControl.controls['idTipoUnidadTiempoAntelacion'].value!,
                    cantAntelacion: notificacionControl.controls['cantAntelacion'].value!,
                });
            });

            this.procesando.set(true);
            this.normaSuscritaDao
                .actualizar(normaSuscrita)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/mis-obligaciones']);
                    },
                    error: (err) => {
                        console.error('Error al editar la norma suscrita', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al editar la norma suscrita');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                });
        } else {
            let proximoVencimiento = null;
            if (this.form.controls['activado'].value!) {
                const fechaProximoVencimiento =
                    this.form.controls['fechaProximoVencimiento'].value!;
                const [hora, minuto] = this.form.controls['horaProximoVencimiento']
                    .value!.split(':')
                    .map(Number);
                proximoVencimiento = new Date(
                    fechaProximoVencimiento.getFullYear(),
                    fechaProximoVencimiento.getMonth(),
                    fechaProximoVencimiento.getDate(),
                    hora,
                    minuto,
                    0,
                    0,
                );
            }

            const normaSuscrita: EntNormaSuscritaCrear = {
                idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                nombre: this.form.controls['nombre'].value!,
                descripcion: this.form.controls['descripcion'].value!,
                idTipoPeriodicidad: this.form.controls['idTipoPeriodicidad'].value!,
                multa: this.form.controls['multa'].value,
                idCategoriaNorma: this.form.controls['idCategoriaNorma'].value!,
                activado: this.form.controls['activado'].value!,
                fiscalizadores: [],
                notificaciones: [],
                proximoVencimiento: proximoVencimiento ? proximoVencimiento.toISOString() : null,
            };

            this.form.controls['fiscalizadores'].controls.forEach((fiscalizadorControl) => {
                normaSuscrita.fiscalizadores?.push({
                    idTipoFiscalizador: fiscalizadorControl.controls['idTipoFiscalizador'].value!,
                });
            });

            this.form.controls['notificaciones'].controls.forEach((notificacionControl) => {
                normaSuscrita.notificaciones?.push({
                    idTipoUnidadTiempoAntelacion:
                        notificacionControl.controls['idTipoUnidadTiempoAntelacion'].value!,
                    cantAntelacion: notificacionControl.controls['cantAntelacion'].value!,
                });
            });

            this.procesando.set(true);
            this.normaSuscritaDao
                .crear(normaSuscrita)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/mis-obligaciones']);
                    },
                    error: (err) => {
                        console.error('Error al crear la norma suscrita', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al crear la norma suscrita');
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
}
