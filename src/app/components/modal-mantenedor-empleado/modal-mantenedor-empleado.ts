import { CargoDao } from '@/app/daos/cargo-dao';
import { EmpleadoDao } from '@/app/daos/empleado-dao';
import { EntCargoActualizar } from '@/app/entities/others/ent-cargo-actualizar';
import { EntCargoCrear } from '@/app/entities/others/ent-cargo-crear';
import { EntEmpleadoActualizar } from '@/app/entities/others/ent-empleado-actualizar';
import { EntEmpleadoCrear } from '@/app/entities/others/ent-empleado-crear';
import { SalCargo } from '@/app/entities/others/sal-cargo';
import { SalEmpleado } from '@/app/entities/others/sal-empleado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, EventEmitter, inject, Input, Output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideContactRound } from '@ng-icons/lucide';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmP } from '@spartan-ng/helm/typography';

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
        BrnPopoverContent,
    ],
    templateUrl: './modal-mantenedor-empleado.html',
    styleUrl: './modal-mantenedor-empleado.scss',
    providers: [provideIcons({ lucideContactRound })],
})
export class ModalMantenedorEmpleado {
    @Input() idEmpleado: number | null = null;
    @Output() cerrar = new EventEmitter<void>();
    @Output() postGuardar = new EventEmitter<void>();

    private destroyRef = inject(DestroyRef);

    empleadoDao = inject(EmpleadoDao);
    cargoDao = inject(CargoDao);
    negocioStore = inject(NegocioStore);

    empleado = signal<SalEmpleado | null>(null);
    cargos = signal([] as SalCargo[]);

    cargandoEmpleados = signal(false);
    cargandoCargos = signal(false);
    procesando = signal<boolean>(false);

    cargando = computed(() => {
        return this.cargandoEmpleados() || this.cargandoCargos() || this.procesando();
    });

    error = signal('');

    search = signal('');
    filteredOptions = computed(() => this.cargos().filter((c) => c.nombre.toLocaleLowerCase().includes(this.search().toLocaleLowerCase())));

    form: FormGroup<{
        nombre: FormControl<string | null>;
        cargo: FormControl<string | null>;
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, { validators: [Validators.required], nonNullable: true }),
        cargo: new FormControl<string | null>(
            { value: null, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
    });

    constructor() {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.obtenerCargos();
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

    clickConfirmar() {
        this.procesando.set(true);
        const valorForm = this.form.value;
        const idNegocio = this.negocioStore.negocioSeleccionado()?.id!;

        // Se valida si existe el cargo...
        const cargos = this.cargos();
        const cargoExistente = cargos.find((c) => c.nombre.toLocaleLowerCase().trim() == valorForm.cargo?.toLocaleLowerCase().trim());

        if (!cargoExistente && !this.idEmpleado /* Si no existe el cargo ni el empleado, se crean ambos... */) {
            this.cargoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: valorForm.cargo,
                } as EntCargoCrear)
                .subscribe({
                    next: (res) => {
                        this.empleadoDao
                            .crear({
                                idNegocio: idNegocio,
                                nombre: valorForm.nombre,
                                idCargo: res.id,
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
            this.empleadoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: valorForm.nombre,
                    idCargo: cargoExistente.id,
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
            this.cargoDao
                .crear({
                    idNegocio: idNegocio,
                    nombre: valorForm.cargo,
                } as EntCargoCrear)
                .subscribe({
                    next: (res) => {
                        this.empleadoDao
                            .actualizar({
                                id: this.idEmpleado,
                                nombre: valorForm.nombre,
                                idCargo: res.id,
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
            this.empleadoDao
                .actualizar({
                    id: this.idEmpleado,
                    nombre: valorForm.nombre,
                    idCargo: cargoExistente.id,
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

    invalid(llave: string) {
        const control = this.form.get(llave);
        return control?.invalid && control?.touched;
    }
}
