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
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import {
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
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';

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
        HlmH4,
        HlmIconImports,
        HlmAlertImports,
        HlmP,
        HlmBadgeImports,
        FormsModule,
        RouterLink,
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
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        descripcion: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        idTipoPeriodicidad: new FormControl<number | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        multa: new FormControl<string | null>({ value: null, disabled: false }),
        idCategoriaNorma: new FormControl<number | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
    });

    item = signal<SalNormaSuscrita | null>(null);

    titulo = computed<string>(() => {
        if (this.item()) {
            return `Edita tu tarea "${this.item()?.nombre}"`;
        }
        return `Crea una tarea nueva:`;
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
            if (this.idNormaSuscrita() && this.negocioStore.negocioSeleccionado()) {
                this.cargandoNormaSuscrita.set(true);
                this.normaSuscritaDao
                    .obtenerVigentes(this.negocioStore.negocioSeleccionado()!.id)
                    .subscribe({
                        next: (vigentes) => {
                            if (vigentes) {
                                const existente = vigentes.find(
                                    (n) => n.id === this.idNormaSuscrita()
                                );
                                if (existente) {
                                    this.item.set(existente);
                                } else {
                                    this.error.set('La tarea no pertenece a tu negocio');
                                }
                            }
                        },
                        error: (err) => {
                            console.error('Error al obtener la información de la tarea', err);
                            this.error.set(
                                err.error ?? 'Error al obtener la información de la tarea'
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
                this.form.patchValue({
                    nombre: this.item()?.nombre,
                    descripcion: this.item()?.descripcion,
                    idTipoPeriodicidad: this.item()?.idTipoPeriodicidad,
                    multa: this.item()?.multa,
                    idCategoriaNorma: this.item()?.idCategoriaNorma,
                });
            } else {
                this.form.patchValue({
                    nombre: null,
                    descripcion: null,
                    idTipoPeriodicidad: null,
                    multa: null,
                    idCategoriaNorma: null,
                });
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

        this.cargandoCategoriasVigentes.set(true);
        this.categoriaNormaDao
            .obtenerVigentes()
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );
                    this.categoriasVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener categorías vigentes', err);
                    this.error.set(err.error ?? 'Error al obtener categorías vigentes');
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
                    this.error.set(err.error ?? 'Error al obtener periodicidades vigentes');
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
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );
                    this.fiscalizadoresVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener fiscalizadores vigentes', err);
                    this.error.set(err.error ?? 'Error al obtener fiscalizadores vigentes');
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
                    this.error.set(err.error ?? 'Error al obtener unidades de tiempo vigentes');
                },
            })
            .add(() => {
                this.cargandoUnidadesTiempoVigentes.set(false);
            });
    }

    clickConfirmar() {
        if (this.item()) {
            const normaSuscrita: EntNormaSuscritaActualizar = {
                id: this.item()!.id,
                idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                nombre: this.form.controls['nombre'].value!,
                descripcion: this.form.controls['descripcion'].value!,
                idTipoPeriodicidad: this.form.controls['idTipoPeriodicidad'].value!,
                multa: this.form.controls['multa'].value,
                idCategoriaNorma: this.form.controls['idCategoriaNorma'].value!,
                activado: true,
            };

            this.procesando.set(true);
            this.normaSuscritaDao
                .actualizar(normaSuscrita)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/mantenedores/norma-suscrita']);
                    },
                    error: (err) => {
                        console.error('Error al editar la norma suscrita', err);
                        this.error.set(err.error ?? 'Error al editar la norma suscrita');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                });
        } else {
            const normaSuscrita: EntNormaSuscritaCrear = {
                idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                nombre: this.form.controls['nombre'].value!,
                descripcion: this.form.controls['descripcion'].value!,
                idTipoPeriodicidad: this.form.controls['idTipoPeriodicidad'].value!,
                multa: this.form.controls['multa'].value,
                idCategoriaNorma: this.form.controls['idCategoriaNorma'].value!,
            };

            this.procesando.set(true);
            this.normaSuscritaDao
                .crear(normaSuscrita)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/mantenedores/norma-suscrita']);
                    },
                    error: (err) => {
                        console.error('Error al crear la norma suscrita', err);
                        this.error.set(err.error ?? 'Error al crear la norma suscrita');
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
