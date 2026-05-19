import { CargoDao } from '@/app/daos/cargo-dao';
import { EmpleadoDao } from '@/app/daos/empleado-dao';
import { TipoReceptorNotificacionDao } from '@/app/daos/tipo-receptor-notificacion-dao';
import { FormatoCorreo } from '@/app/directives/formato-correo';
import { FormatoTelefono } from '@/app/directives/formato-telefono';
import { TipoReceptorNotificacion } from '@/app/entities/models/tipo-receptor-notificacion';
import { EntCargoActualizar } from '@/app/entities/others/ent-cargo-actualizar';
import { EntCargoCrear } from '@/app/entities/others/ent-cargo-crear';
import { EntEmpleadoActualizar, EntEmpleadoActualizarDestinatario } from '@/app/entities/others/ent-empleado-actualizar';
import { EntEmpleadoCrear, EntEmpleadoCrearDestinatario } from '@/app/entities/others/ent-empleado-crear';
import { SalCargo } from '@/app/entities/others/sal-cargo';
import { SalEmpleado, SalEmpleadoDestinatario } from '@/app/entities/others/sal-empleado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, EventEmitter, inject, Input, Output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideContactRound, lucideMail, lucidePlus, lucideSmartphone, lucideSquarePlus, lucideTrash, lucideTrash2 } from '@ng-icons/lucide';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-modal-mantenedor-empleado',
    imports: [
        ReactiveFormsModule,
        HlmButtonImports,
        HlmCardImports,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmIcon,
        NgIcon,
        HlmAlertImports,
        HlmSpinnerImports,
        HlmSkeletonImports,
        RouterModule,
        HlmAutocompleteImports,
        HlmDropdownMenuImports,
        HlmP,
        HlmH4,
        FormatoTelefono,
        FormatoCorreo,
    ],
    templateUrl: './modal-mantenedor-empleado.html',
    styleUrl: './modal-mantenedor-empleado.scss',
    providers: [provideIcons({ lucideContactRound, lucidePlus, lucideMail, lucideSmartphone, lucideTrash2 })],
})
export class ModalMantenedorEmpleado {
    @Input() idEmpleado: number | null = null;
    @Output() cerrar = new EventEmitter<void>();
    @Output() postGuardar = new EventEmitter<void>();

    private destroyRef = inject(DestroyRef);

    empleadoDao = inject(EmpleadoDao);
    cargoDao = inject(CargoDao);
    tipoReceptorDao = inject(TipoReceptorNotificacionDao);
    negocioStore = inject(NegocioStore);

    empleado = signal<SalEmpleado | null>(null);
    cargos = signal([] as SalCargo[]);
    tiposReceptores = signal([] as TipoReceptorNotificacion[]);

    cargandoEmpleados = signal(false);
    cargandoCargos = signal(false);
    cargandoTipoReceptores = signal(false);
    procesando = signal<boolean>(false);

    cargando = computed(() => {
        return this.cargandoEmpleados() || this.cargandoCargos() || this.cargandoTipoReceptores() || this.procesando();
    });

    error = signal('');

    search = signal('');
    filteredOptions = computed(() => this.cargos().filter((c) => c.nombre.toLocaleLowerCase().includes(this.search().toLocaleLowerCase())));

    form: FormGroup<{
        nombre: FormControl<string | null>;
        cargo: FormControl<string | null>;
        destinatarios: FormArray<
            FormGroup<{
                idTipoReceptor: FormControl<number | null>;
                destino: FormControl<string | null>;
            }>
        >;
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, { validators: [Validators.required], nonNullable: true }),
        cargo: new FormControl<string | null>(
            { value: null, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        destinatarios: new FormArray<
            FormGroup<{
                idTipoReceptor: FormControl<number | null>;
                destino: FormControl<string | null>;
            }>
        >([]),
    });

    constructor() {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.obtenerCargos();
                    this.obtenerTipoReceptores();
                    if (this.idEmpleado) {
                        this.obtenerEmpleados();
                    }
                }
            });
        });

        effect(() => {
            const empleado = this.empleado();

            untracked(() => {
                if (empleado) {
                    this.form.controls.nombre.setValue(empleado?.nombre!);
                    this.form.controls.cargo.setValue(empleado?.nombreCargo!);
                    empleado?.destinatarios.forEach((destinatario) => {
                        this.form.controls.destinatarios.push(this.buildDestinatarioFormGroup(destinatario));
                    });

                    this.search.set(empleado?.nombreCargo!);
                }
            });
        });
    }

    obtenerEmpleados() {
        this.cargandoEmpleados.set(true);
        this.empleado.set(null);

        this.empleadoDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const empleado = res.find((e) => e.id === this.idEmpleado);
                    if (empleado) {
                        this.empleado.set(empleado);
                    } else {
                        this.cerrar.emit();
                    }
                },
                error: (err) => {
                    console.error('Error al obtener la información del empleado', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener la información del empleado');
                },
            })
            .add(() => {
                this.cargandoEmpleados.set(false);
            });
    }

    obtenerCargos() {
        this.cargandoCargos.set(true);
        this.cargos.set([]);

        this.cargoDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));
                    this.cargos.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los cargos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los cargos');
                },
            })
            .add(() => {
                this.cargandoCargos.set(false);
            });
    }

    obtenerTipoReceptores() {
        this.cargandoTipoReceptores.set(true);
        this.tipoReceptorDao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.tiposReceptores.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los tipos de receptores de notificación', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los tipos de receptores de notificación');
                },
            })
            .add(() => {
                this.cargandoTipoReceptores.set(false);
            });
    }

    clickConfirmar() {
        this.procesando.set(true);
        const idNegocio = this.negocioStore.negocioSeleccionado()?.id!;
        const formCargo = this.form.value.cargo;
        const formNombre = this.form.value.nombre;
        const formDestinatarios = this.form.value.destinatarios;

        // Se valida si existe el cargo...
        const cargos = this.cargos();
        const cargoExistente = cargos.find((c) => c.nombre.toLocaleLowerCase().trim() == formCargo?.toLocaleLowerCase().trim());

        if (!cargoExistente && !this.idEmpleado /* Si no existe el cargo ni el empleado, se crean ambos... */) {
            const destinatarios = [] as EntEmpleadoCrearDestinatario[];
            formDestinatarios?.forEach((destinatario) => {
                destinatarios.push({
                    idTipoReceptor: destinatario.idTipoReceptor!,
                    destino: destinatario.destino!.replaceAll(' ', ''),
                } as EntEmpleadoCrearDestinatario);
            });

            this.cargoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: formCargo,
                } as EntCargoCrear)
                .subscribe({
                    next: (res) => {
                        this.empleadoDao
                            .crear({
                                idNegocio: idNegocio,
                                nombre: formNombre,
                                idCargo: res.id,
                                destinatarios: destinatarios,
                            } as EntEmpleadoCrear)
                            .subscribe({
                                next: () => {
                                    this.postGuardar.emit();
                                    this.cerrar.emit();
                                },
                                error: (err) => {
                                    console.error('Error al crear el nuevo empleado', err);
                                    this.error.set(getErrorMessage(err) ?? 'Error al crear el nuevo empleado');
                                },
                            })
                            .add(() => {
                                this.procesando.set(false);
                            });
                    },
                    error: (err) => {
                        console.error('Error al crear el nuevo cargo', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al crear el nuevo cargo');
                        this.procesando.set(false);
                    },
                });
        } else if (cargoExistente && !this.idEmpleado /* Si el cargo existe pero no el empleado, se crea solo el empleado... */) {
            const destinatarios = [] as EntEmpleadoCrearDestinatario[];
            formDestinatarios?.forEach((destinatario) => {
                destinatarios.push({
                    idTipoReceptor: destinatario.idTipoReceptor!,
                    destino: destinatario.destino!.replaceAll(' ', ''),
                } as EntEmpleadoCrearDestinatario);
            });

            this.empleadoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: formNombre,
                    idCargo: cargoExistente.id,
                    destinatarios: destinatarios,
                } as EntEmpleadoCrear)
                .subscribe({
                    next: () => {
                        this.postGuardar.emit();
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        console.error('Error al crear el nuevo empleado', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al crear el nuevo empleado');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                });
        } else if (!cargoExistente && this.idEmpleado /* Si el cargo no existe y el empleado sí, se crea el cargo y se edita el empleado... */) {
            const destinatarios = [] as EntEmpleadoActualizarDestinatario[];
            formDestinatarios?.forEach((destinatario) => {
                destinatarios.push({
                    idTipoReceptor: destinatario.idTipoReceptor!,
                    destino: destinatario.destino!.replaceAll(' ', ''),
                } as EntEmpleadoActualizarDestinatario);
            });

            this.cargoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: formCargo,
                } as EntCargoCrear)
                .subscribe({
                    next: (res) => {
                        this.empleadoDao
                            .actualizar({
                                id: this.idEmpleado,
                                nombre: formNombre,
                                idCargo: res.id,
                                destinatarios: destinatarios,
                            } as EntEmpleadoActualizar)
                            .subscribe({
                                next: () => {
                                    this.postGuardar.emit();
                                    this.cerrar.emit();
                                },
                                error: (err) => {
                                    console.error('Error al actualizar el empleado', err);
                                    this.error.set(getErrorMessage(err) ?? 'Error al actualizar el empleado');
                                },
                            })
                            .add(() => {
                                this.procesando.set(false);
                            });
                    },
                    error: (err) => {
                        console.error('Error al crear el nuevo cargo', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al crear el nuevo cargo');
                        this.procesando.set(false);
                    },
                });
        } else if (cargoExistente && this.idEmpleado /* Si el cargo existe y el empleado también, solo se edita el empleado... */) {
            const destinatarios = [] as EntEmpleadoActualizarDestinatario[];
            formDestinatarios?.forEach((destinatario) => {
                destinatarios.push({
                    idTipoReceptor: destinatario.idTipoReceptor!,
                    destino: destinatario.destino!.replaceAll(' ', ''),
                } as EntEmpleadoActualizarDestinatario);
            });

            this.empleadoDao
                .actualizar({
                    id: this.idEmpleado,
                    nombre: formNombre,
                    idCargo: cargoExistente.id,
                    destinatarios: destinatarios,
                } as EntEmpleadoActualizar)
                .subscribe({
                    next: () => {
                        this.postGuardar.emit();
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        console.error('Error al actualizar el empleado', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al actualizar el empleado');
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

    private buildDestinatarioFormGroup(destinatario: SalEmpleadoDestinatario) {
        return new FormGroup({
            idTipoReceptor: new FormControl<number | null>(destinatario.idTipoReceptor, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            destino: new FormControl<string | null>(destinatario.destino, {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    crearDestinatario(idTipoReceptor: number) {
        const group = new FormGroup({
            idTipoReceptor: new FormControl(idTipoReceptor, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            destino: new FormControl(null, {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(1)],
            }),
        });

        if (idTipoReceptor === 1 /* Correo electrónico */) {
            group.controls.destino.addValidators(Validators.email);
        }

        (this.form.controls.destinatarios as FormArray).push(group);
    }

    eliminarDestinatario(index: number) {
        this.form.controls.destinatarios.removeAt(index);
    }

    obtenerNombreTipoReceptor(idTipoReceptor: number | null) {
        return this.tiposReceptores().find((tr) => tr.id === idTipoReceptor)?.nombre ?? '';
    }

    obtenerDestinoPlaceholder(idTipoReceptor: number | null): string {
        switch (idTipoReceptor) {
            case 1:
                return 'ejemplo@ejemplo.cl';
            case 2:
                return '+56 9 9999 9999';
            default:
                return '';
        }
    }
}
