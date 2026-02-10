import { CategoriaNormaDao } from '@/app/daos/categoria-norma-dao';
import { TemplateDao } from '@/app/daos/template-dao';
import { TipoActividadDao } from '@/app/daos/tipo-actividad-dao';
import { TipoFiscalizadorDao } from '@/app/daos/tipo-fiscalizador-dao';
import { TipoPeriodicidadDao } from '@/app/daos/tipo-periodicidad-dao';
import { TipoRubroDao } from '@/app/daos/tipo-rubro-dao';
import { TipoUnidadTiempoDao } from '@/app/daos/tipo-unidad-tiempo-dao';
import { CategoriaNorma } from '@/app/entities/models/categoria-norma';
import { Template } from '@/app/entities/models/template';
import { TemplateActividad } from '@/app/entities/models/template-actividad';
import { TemplateNorma } from '@/app/entities/models/template-norma';
import { TemplateNormaFiscalizador } from '@/app/entities/models/template-norma-fiscalizador';
import { TemplateNormaNotificacion } from '@/app/entities/models/template-norma-notificacion';
import { TipoActividad } from '@/app/entities/models/tipo-actividad';
import { TipoFiscalizador } from '@/app/entities/models/tipo-fiscalizador';
import { TipoPeriodicidad } from '@/app/entities/models/tipo-periodicidad';
import { TipoRubro } from '@/app/entities/models/tipo-rubro';
import { TipoUnidadTiempo } from '@/app/entities/models/tipo-unidad-tiempo';
import { normalize } from '@/app/helpers/string-comparator';
import { Component, computed, effect, inject, signal } from '@angular/core';
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
    lucideChevronDown,
    lucidePlus,
    lucideSquarePen,
    lucideTrash2,
    lucideX,
} from '@ng-icons/lucide';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { forkJoin } from 'rxjs';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-mantenedor-template-edicion',
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
        HlmAccordionImports,
        HlmIconImports,
        HlmDropdownMenuImports,
        HlmAlertImports,
        HlmP,
        HlmH3,
        HlmH4,
        HlmBadgeImports,
        FormsModule,
        RouterLink,
        BrnPopoverContent,
        HlmAutocompleteImports,
        HlmSkeletonImports,
    ],
    templateUrl: './mantenedor-template-edicion.html',
    styleUrl: './mantenedor-template-edicion.scss',
    providers: [
        provideIcons({
            lucideBadgeCheck,
            lucideBadgeX,
            lucideChevronDown,
            lucideTrash2,
            lucidePlus,
            lucideX,
            lucideSquarePen,
        }),
    ],
})
export class MantenedorTemplateEdicion {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    idTemplate = signal<number | null>(null);

    templateDao = inject(TemplateDao);
    categoriaNormaDao = inject(CategoriaNormaDao);
    tipoPeriodicidadDao = inject(TipoPeriodicidadDao);
    tipoFiscalizadorDao = inject(TipoFiscalizadorDao);
    tipoUnidadTiempoDao = inject(TipoUnidadTiempoDao);
    tipoRubroDao = inject(TipoRubroDao);
    tipoActividadDao = inject(TipoActividadDao);

    form: FormGroup<{
        id: FormControl<number | null>;
        idTemplatePadre: FormControl<number | null>;
        nombre: FormControl<string>;
        descripcion: FormControl<string>;
        vigencia: FormControl<boolean>;
        templateNormas: FormArray<
            FormGroup<{
                idNorma: FormControl<number | null>;
                nombre: FormControl<string>;
                descripcion: FormControl<string>;
                idTipoPeriodicidad: FormControl<number | null>;
                multa: FormControl<string>;
                idCategoriaNorma: FormControl<number | null>;
                templateNormaFiscalizadores: FormArray<
                    FormGroup<{
                        idTipoFiscalizador: FormControl<number | null>;
                    }>
                >;
                templateNormaNotificaciones: FormArray<
                    FormGroup<{
                        idTipoUnidadTiempoAntelacion: FormControl<number | null>;
                        cantAntelacion: FormControl<number | null>;
                    }>
                >;
                isOpened: FormControl<boolean>;
            }>
        >;
        templateActividades: FormArray<
            FormGroup<{
                idTipoActividad: FormControl<number | null>;
            }>
        >;
    }> = new FormGroup({
        id: new FormControl<number | null>({ value: null, disabled: false }, [Validators.required]),
        idTemplatePadre: new FormControl<number | null>({ value: null, disabled: false }),
        nombre: new FormControl<string>(
            { value: '', disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        descripcion: new FormControl<string>(
            { value: '', disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        vigencia: new FormControl<boolean>(
            { value: false, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        templateNormas: new FormArray<
            FormGroup<{
                idNorma: FormControl<number | null>;
                nombre: FormControl<string>;
                descripcion: FormControl<string>;
                idTipoPeriodicidad: FormControl<number | null>;
                multa: FormControl<string>;
                idCategoriaNorma: FormControl<number | null>;
                templateNormaFiscalizadores: FormArray<
                    FormGroup<{
                        idTipoFiscalizador: FormControl<number | null>;
                    }>
                >;
                templateNormaNotificaciones: FormArray<
                    FormGroup<{
                        idTipoUnidadTiempoAntelacion: FormControl<number | null>;
                        cantAntelacion: FormControl<number | null>;
                    }>
                >;
                isOpened: FormControl<boolean>;
            }>
        >([]),
        templateActividades: new FormArray<
            FormGroup<{
                idTipoActividad: FormControl<number | null>;
            }>
        >([]),
    });

    item = signal<Template | null>(null);

    titulo = computed<string>(() => {
        if (this.idTemplate()) {
            return `Actualizar el template "${this.item()?.nombre}":`;
        }
        return `Crear un template nuevo:`;
    });

    error = signal<string>('');

    cargandoTemplatesExistentes = signal<boolean>(true);
    templatesExistentes = signal<Template[]>([]);

    cargandoDetalleTemplate = signal<boolean>(false);

    cargandoActividadesExistentes = signal<boolean>(true);
    actividadesExistentes = signal<TipoActividad[]>([]);
    rubrosExistentes = signal<TipoRubro[]>([]);

    cargandoCategoriasExistentes = signal<boolean>(true);
    categoriasExistentes = signal<CategoriaNorma[]>([]);

    cargandoPeriodicidadExistentes = signal<boolean>(true);
    periodicidadesExistentes = signal<TipoPeriodicidad[]>([]);

    cargandoFiscalizadoresExistentes = signal<boolean>(true);
    fiscalizadoresExistentes = signal<TipoFiscalizador[]>([]);

    cargandoUnidadesTiempoExistentes = signal<boolean>(true);
    unidadesTiempoExistentes = signal<TipoUnidadTiempo[]>([]);

    procesando = signal<boolean>(false);

    constructor() {
        effect(() => {
            if (this.cargandoTemplatesExistentes()) {
                this.form.controls['idTemplatePadre'].disable();
            } else {
                this.form.controls['idTemplatePadre'].enable();
            }
        });

        effect(() => {
            if (this.idTemplate()) {
                this.cargandoDetalleTemplate.set(true);
                this.templateDao
                    .obtener(this.idTemplate()!)
                    .subscribe({
                        next: (detalleTemplate) => {
                            if (detalleTemplate?.templateNormas) {
                                detalleTemplate.templateNormas =
                                    detalleTemplate?.templateNormas?.sort(
                                        (a, b) => a.idNorma - b.idNorma,
                                    );

                                detalleTemplate?.templateNormas?.forEach((norma) => {
                                    if (norma.templateNormaFiscalizadores) {
                                        norma.templateNormaFiscalizadores =
                                            norma.templateNormaFiscalizadores?.sort(
                                                (a, b) =>
                                                    a.idTipoFiscalizador - b.idTipoFiscalizador,
                                            );
                                    }

                                    if (norma.templateNormaNotificaciones) {
                                        norma.templateNormaNotificaciones =
                                            norma.templateNormaNotificaciones?.sort((a, b) =>
                                                a.idTipoUnidadTiempoAntelacion !==
                                                b.idTipoUnidadTiempoAntelacion
                                                    ? b.idTipoUnidadTiempoAntelacion -
                                                      a.idTipoUnidadTiempoAntelacion
                                                    : b.cantAntelacion - a.cantAntelacion,
                                            );
                                    }
                                });
                            }

                            this.item.set(detalleTemplate);
                        },
                        error: (err) => {
                            console.error('Error al obtener los detalles del template', err);
                            this.error.set(
                                err.error ?? 'Error al obtener los detalles del template',
                            );
                        },
                    })
                    .add(() => {
                        this.cargandoDetalleTemplate.set(false);
                    });

                this.form.controls['id'].disable();
            }
        });

        effect(() => {
            this.cargandoTemplatesExistentes.set(true);
            this.templateDao
                .obtenerPorVigencia(null)
                .subscribe({
                    next: (vigentes) => {
                        if (this.item()) {
                            vigentes = vigentes.filter((t) => t.id !== this.item()!.id);
                            vigentes = this.eliminarHijosComoPosiblesPadres(
                                vigentes,
                                this.item()!.id,
                            );
                            vigentes = vigentes.sort((a, b) =>
                                a.nombre
                                    .toLocaleLowerCase()
                                    .localeCompare(b.nombre.toLocaleLowerCase()),
                            );
                        }
                        this.templatesExistentes.set(vigentes);
                    },
                    error: (err) => {
                        console.error('Error al obtener templates', err);
                        this.error.set(err.error ?? 'Error al obtener templates');
                    },
                })
                .add(() => {
                    this.cargandoTemplatesExistentes.set(false);
                });

            if (this.item()) {
                this.form.patchValue({
                    id: this.item()!.id,
                    idTemplatePadre: this.item()!.idTemplatePadre,
                    nombre: this.item()!.nombre,
                    descripcion: this.item()!.descripcion,
                    vigencia: this.item()!.vigencia,
                });

                (this.form.get('templateNormas') as FormArray).clear();
                this.item()!.templateNormas?.forEach((norma) => {
                    (this.form.get('templateNormas') as FormArray).push(
                        this.buildNormaFormGroup(norma),
                    );
                });

                (this.form.get('templateActividades') as FormArray).clear();
                this.item()!.templateActividades?.forEach((actividad) => {
                    (this.form.get('templateActividades') as FormArray).push(
                        this.buildActividadFormGroup(actividad),
                    );
                });
            } else {
                this.form.patchValue({
                    id: null,
                    idTemplatePadre: null,
                    nombre: '',
                    descripcion: '',
                    vigencia: false,
                });

                (this.form.get('templateNormas') as FormArray).clear();
                (this.form.get('templateActividades') as FormArray).clear();
            }
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.error.set('');
            this.item.set(null);

            const param = params.get('idTemplate');
            if (param) {
                this.idTemplate.set(Number(param));
            } else {
                this.idTemplate.set(null);
            }
        });

        this.cargandoActividadesExistentes.set(true);
        forkJoin({
            tiposRubros: this.tipoRubroDao.obtenerPorVigencia(null),
            tiposActividades: this.tipoActividadDao.obtenerPorVigencia(null),
        })
            .subscribe({
                next: ({ tiposRubros, tiposActividades }) => {
                    const sortedActividades = tiposActividades.sort((a, b) =>
                        a.idTipoRubro == b.idTipoRubro
                            ? a.nombre
                                  .toLocaleLowerCase()
                                  .localeCompare(b.nombre.toLocaleLowerCase())
                            : a.idTipoRubro - b.idTipoRubro,
                    );

                    this.actividadesExistentes.set(sortedActividades);
                    this.rubrosExistentes.set(tiposRubros);
                },
                error: (err) => {
                    console.error('Error al obtener actividades', err);
                    this.error.set(err.error ?? 'Error al obtener actividades');
                },
            })
            .add(() => {
                this.cargandoActividadesExistentes.set(false);
            });

        this.cargandoCategoriasExistentes.set(true);
        this.categoriaNormaDao
            .obtenerPorVigencia(null)
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.categoriasExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener categorías', err);
                    this.error.set(err.error ?? 'Error al obtener categorías');
                },
            })
            .add(() => {
                this.cargandoCategoriasExistentes.set(false);
            });

        this.cargandoPeriodicidadExistentes.set(true);
        this.tipoPeriodicidadDao
            .obtenerPorVigencia(null)
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) => a.id - b.id);
                    this.periodicidadesExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener periodicidades', err);
                    this.error.set(err.error ?? 'Error al obtener periodicidades');
                },
            })
            .add(() => {
                this.cargandoPeriodicidadExistentes.set(false);
            });

        this.cargandoFiscalizadoresExistentes.set(true);
        this.tipoFiscalizadorDao
            .obtenerPorVigencia(null)
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.fiscalizadoresExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener fiscalizadores', err);
                    this.error.set(err.error ?? 'Error al obtener fiscalizadores');
                },
            })
            .add(() => {
                this.cargandoFiscalizadoresExistentes.set(false);
            });

        this.cargandoUnidadesTiempoExistentes.set(true);
        this.tipoUnidadTiempoDao
            .obtenerPorVigencia(null)
            .subscribe({
                next: (res) => {
                    res = res.sort((a, b) => a.id - b.id);
                    this.unidadesTiempoExistentes.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener unidades de tiempo', err);
                    this.error.set(err.error ?? 'Error al obtener unidades de tiempo');
                },
            })
            .add(() => {
                this.cargandoUnidadesTiempoExistentes.set(false);
            });
    }

    private eliminarHijosComoPosiblesPadres(
        vigentes: Template[],
        idTemplatePadre: number,
    ): Template[] {
        let casosConDichoPadre = vigentes.filter((t) => t.idTemplatePadre === idTemplatePadre);

        casosConDichoPadre.forEach((p) => {
            vigentes = this.eliminarHijosComoPosiblesPadres(vigentes, p.id);
        });

        let casosSinDichoPadre = vigentes.filter((t) => t.idTemplatePadre !== idTemplatePadre);
        return casosSinDichoPadre;
    }

    formFiscalizador = '';

    agregarFiscalizador(normaControl: FormGroup) {
        const idFiscalizador = this.formFiscalizador;

        this.formFiscalizador = '';

        const idx = (
            normaControl.controls['templateNormaFiscalizadores'] as FormArray
        ).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoFiscalizador']?.value === idFiscalizador,
        );

        if (idx !== -1) {
            return;
        }

        (normaControl.controls['templateNormaFiscalizadores'] as FormArray).push(
            new FormGroup({
                idTipoFiscalizador: new FormControl(idFiscalizador, {
                    nonNullable: true,
                }),
            }),
        );
    }

    quitarFiscalizador(normaControl: FormGroup, idFiscalizador: number) {
        const idx = (
            normaControl.controls['templateNormaFiscalizadores'] as FormArray
        ).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoFiscalizador']?.value === idFiscalizador,
        );

        if (idx !== -1) {
            (normaControl.controls['templateNormaFiscalizadores'] as FormArray).removeAt(idx);
        }
    }

    nombreFiscalizador(idFiscalizador: number): string {
        const fiscalizador = this.fiscalizadoresExistentes().find(
            (fiscalizador: TipoFiscalizador) => fiscalizador.id === idFiscalizador,
        );
        return fiscalizador?.nombreCorto && fiscalizador.nombreCorto.trim() !== ''
            ? fiscalizador.nombreCorto
            : fiscalizador?.nombre!;
    }

    formNotifCantTiempo = '';
    formNotifUnidadTiempo = '';

    agregarNotificacionPrevia(normaControl: FormGroup) {
        const cantTiempo = this.formNotifCantTiempo;
        const idUnidadTiempo = this.formNotifUnidadTiempo;

        this.formNotifCantTiempo = '';
        this.formNotifUnidadTiempo = '';

        const idx = (
            normaControl.controls['templateNormaNotificaciones'] as FormArray
        ).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['cantAntelacion']?.value === cantTiempo &&
                ctrl.controls['idTipoUnidadTiempoAntelacion']?.value === idUnidadTiempo,
        );

        if (idx !== -1) {
            return;
        }

        (normaControl.controls['templateNormaNotificaciones'] as FormArray).push(
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

    quitarNotificacionPrevia(
        normaControl: FormGroup,
        cantAntelacion: number,
        idTipoUnidadTiempoAntelacion: number,
    ) {
        const idx = (
            normaControl.controls['templateNormaNotificaciones'] as FormArray
        ).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['cantAntelacion']?.value === cantAntelacion &&
                ctrl.controls['idTipoUnidadTiempoAntelacion']?.value ===
                    idTipoUnidadTiempoAntelacion,
        );

        if (idx !== -1) {
            (normaControl.controls['templateNormaNotificaciones'] as FormArray).removeAt(idx);
        }
    }

    nombreUnidadTiempo(idUnidadTiempo: number, cantUnidadTiempo: number | null = null): string {
        const unidadTiempo = this.unidadesTiempoExistentes().find(
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

    toggleOpenedNorma(norma: FormGroup) {
        norma.controls['isOpened'].setValue(!norma.controls['isOpened'].value);
    }

    crearNorma() {
        (this.form.get('templateNormas') as FormArray).push(
            new FormGroup({
                idNorma: new FormControl(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                nombre: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                descripcion: new FormControl('', { nonNullable: true }),
                idTipoPeriodicidad: new FormControl(null, {
                    nonNullable: true,
                }),
                multa: new FormControl('', { nonNullable: true }),
                idCategoriaNorma: new FormControl(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                templateNormaFiscalizadores: this.buildFiscalizadores([]),
                templateNormaNotificaciones: this.buildNotificaciones([]),
                isOpened: new FormControl(true, { nonNullable: true }),
            }),
        );
    }

    quitarNorma(index: number) {
        this.form.controls['templateNormas'].removeAt(index);
    }

    formActividad = signal<number | null>(null);

    searchActividad = signal<string>('');
    filteredActividades = computed(() => {
        const filtrados = this.actividadesExistentes().filter(
            (actividad) =>
                (normalize(actividad.nombre).includes(normalize(this.searchActividad())) ||
                    normalize(this.nombreRubro(actividad.idTipoRubro)).includes(
                        normalize(this.searchActividad()),
                    )) &&
                (this.form.controls['templateActividades'] as FormArray).controls.findIndex(
                    (ctrl: AbstractControl) =>
                        ctrl instanceof FormGroup &&
                        ctrl.controls['idTipoActividad']?.value === actividad.id,
                ) === -1,
        );
        const categorizados: any[] = [];
        [...new Set(filtrados.map((f) => f.idTipoRubro))].forEach((idTipoRubro) => {
            categorizados.push({
                nombreRubro: this.nombreRubro(idTipoRubro),
                items: filtrados.filter((f) => f.idTipoRubro === idTipoRubro),
            });
        });

        return categorizados;
    });
    itemToStringActividades = (idTipoActividad: number) => {
        const item = this.actividadesExistentes().find((x) => x.id === idTipoActividad);
        return `${item?.nombre}`;
    };
    isItemEqualToValueActividades = (itemValue: number, idSelectedActividad: number | null) => {
        return itemValue === idSelectedActividad;
    };

    crearActividad() {
        const idTipoActividad = this.formActividad();

        this.searchActividad.set('');
        this.formActividad.set(null);

        const idx = (this.form.controls['templateActividades'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoActividad']?.value === idTipoActividad,
        );

        if (idx !== -1) {
            return;
        }

        (this.form.controls['templateActividades'] as FormArray).push(
            new FormGroup({
                idTipoActividad: new FormControl(idTipoActividad, { nonNullable: true }),
            }),
        );
    }

    quitarActividad(idTipoActividad: number) {
        const idx = (this.form.controls['templateActividades'] as FormArray).controls.findIndex(
            (ctrl: AbstractControl) =>
                ctrl instanceof FormGroup &&
                ctrl.controls['idTipoActividad']?.value === idTipoActividad,
        );

        if (idx !== -1) {
            (this.form.controls['templateActividades'] as FormArray).removeAt(idx);
        }
    }

    nombreActividad(idTipoActividad: number): string {
        const tipoActividad = this.actividadesExistentes().find(
            (actividad: TipoActividad) => actividad.id === idTipoActividad,
        );
        return tipoActividad?.nombre!;
    }

    nombreRubroPorActividad(idTipoActividad: number): string {
        const tipoActividad = this.actividadesExistentes().find(
            (actividad: TipoActividad) => actividad.id === idTipoActividad,
        );
        const tipoRubro = this.rubrosExistentes().find(
            (rubro: TipoRubro) => rubro.id === tipoActividad?.idTipoRubro,
        );
        return tipoRubro?.nombre!;
    }

    nombreRubro(idTipoRubro: number): string {
        const tipoRubro = this.rubrosExistentes().find(
            (rubro: TipoRubro) => rubro.id === idTipoRubro,
        );
        return tipoRubro?.nombre!;
    }

    private buildNormaFormGroup(norma: TemplateNorma) {
        return new FormGroup({
            idNorma: new FormControl(norma.idNorma, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            nombre: new FormControl(norma.nombre, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            descripcion: new FormControl(norma.descripcion, { nonNullable: true }),
            idTipoPeriodicidad: new FormControl(norma.idTipoPeriodicidad, { nonNullable: true }),
            multa: new FormControl(norma.multa, { nonNullable: true }),
            idCategoriaNorma: new FormControl(norma.idCategoriaNorma, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            templateNormaFiscalizadores: this.buildFiscalizadores(
                norma.templateNormaFiscalizadores ?? [],
            ),
            templateNormaNotificaciones: this.buildNotificaciones(
                norma.templateNormaNotificaciones ?? [],
            ),
            isOpened: new FormControl(false, { nonNullable: true }),
        });
    }

    private buildActividadFormGroup(actividad: TemplateActividad) {
        return new FormGroup({
            idTipoActividad: new FormControl(actividad.idTipoActividad, {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private buildFiscalizadores(list: TemplateNormaFiscalizador[]) {
        return new FormArray(
            list?.map(
                (x) =>
                    new FormGroup({
                        idTipoFiscalizador: new FormControl(x.idTipoFiscalizador, {
                            nonNullable: true,
                        }),
                    }),
            ) ?? [],
        );
    }

    private buildNotificaciones(list: TemplateNormaNotificacion[]) {
        return new FormArray(
            list.map(
                (x) =>
                    new FormGroup({
                        idTipoUnidadTiempoAntelacion: new FormControl(
                            x.idTipoUnidadTiempoAntelacion,
                            { nonNullable: true, validators: [Validators.required] },
                        ),
                        cantAntelacion: new FormControl(x.cantAntelacion, {
                            nonNullable: true,
                            validators: [Validators.required],
                        }),
                    }),
            ) ?? [],
        );
    }

    clickConfirmar() {
        const template: Template = {
            id: this.form.controls['id'].value!,
            idTemplatePadre: this.form.controls['idTemplatePadre'].value,
            nombre: this.form.controls['nombre'].value!,
            descripcion: this.form.controls['descripcion'].value!,
            vigencia: this.form.controls['vigencia'].value!,
            templateNormas: [],
            templateActividades: [],
        };

        this.form.controls['templateNormas'].controls.forEach((normaControl) => {
            const norma = {
                idTemplate: template.id,
                idNorma: normaControl.controls['idNorma'].value!,
                nombre: normaControl.controls['nombre'].value,
                descripcion: normaControl.controls['descripcion'].value,
                idTipoPeriodicidad: normaControl.controls['idTipoPeriodicidad'].value,
                multa: normaControl.controls['multa'].value,
                idCategoriaNorma: normaControl.controls['idCategoriaNorma'].value!,
                templateNormaFiscalizadores: [],
                templateNormaNotificaciones: [],
            } as TemplateNorma;

            normaControl.controls['templateNormaFiscalizadores'].controls.forEach(
                (fiscalizadorControl) => {
                    norma.templateNormaFiscalizadores?.push({
                        idTemplate: norma.idTemplate,
                        idNorma: norma.idNorma,
                        idTipoFiscalizador:
                            fiscalizadorControl.controls['idTipoFiscalizador'].value!,
                    });
                },
            );

            normaControl.controls['templateNormaNotificaciones'].controls.forEach(
                (notificacionControl) => {
                    norma.templateNormaNotificaciones?.push({
                        idTemplate: norma.idTemplate,
                        idNorma: norma.idNorma,
                        idTipoUnidadTiempoAntelacion:
                            notificacionControl.controls['idTipoUnidadTiempoAntelacion'].value!,
                        cantAntelacion: notificacionControl.controls['cantAntelacion'].value!,
                    });
                },
            );

            template.templateNormas?.push(norma);
        });

        this.form.controls['templateActividades'].controls.forEach((actividadControl) => {
            const actividad = {
                idTemplate: template.id,
                idTipoActividad: actividadControl.controls['idTipoActividad'].value!,
            } as TemplateActividad;

            template.templateActividades?.push(actividad);
        });

        if (this.idTemplate()) {
            this.editar(template);
        } else {
            this.crear(template);
        }
    }

    editar(item: Template) {
        this.procesando.set(true);
        this.templateDao
            .actualizar(item)
            .subscribe({
                next: () => {
                    this.router.navigate(['/administracion/mantenedores/template']);
                },
                error: (err) => {
                    console.error('Error al editar el template', err);
                    this.error.set(err.error ?? 'Error al editar el template');
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
    }

    crear(item: Template) {
        this.procesando.set(true);
        this.templateDao
            .crear(item)
            .subscribe({
                next: () => {
                    this.router.navigate(['/administracion/mantenedores/template']);
                },
                error: (err) => {
                    console.error('Error al crear el template', err);
                    this.error.set(err.error ?? 'Error al crear el template');
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
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
