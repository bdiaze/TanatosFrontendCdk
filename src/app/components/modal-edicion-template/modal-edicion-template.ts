import { Template } from '@/app/entities/models/template';
import {
    Component,
    computed,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    signal,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { TemplateDao } from '@/app/daos/template-dao';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { TemplateNormaFiscalizador } from '@/app/entities/models/template-norma-fiscalizador';
import { TemplateNormaNotificacion } from '@/app/entities/models/template-norma-notificacion';
import { TemplateNorma } from '@/app/entities/models/template-norma';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { CategoriaNorma } from '@/app/entities/models/categoria-norma';
import { CategoriaNormaDao } from '@/app/daos/categoria-norma-dao';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { TipoPeriodicidadDao } from '@/app/daos/tipo-periodicidad-dao';
import { TipoPeriodicidad } from '@/app/entities/models/tipo-periodicidad';

@Component({
    selector: 'app-modal-edicion-template',
    imports: [
        ReactiveFormsModule,
        HlmButtonImports,
        HlmCardImports,
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
        HlmH3,
        HlmH4,
        HlmP,
        HlmAccordionImports,
        HlmIconImports,
        HlmScrollAreaImports,
    ],
    templateUrl: './modal-edicion-template.html',
    styleUrl: './modal-edicion-template.scss',
    providers: [provideIcons({ lucideBadgeCheck, lucideBadgeX, lucideChevronDown })],
})
export class ModalEdicionTemplate implements OnInit {
    @Input() item: Template | null | undefined;

    @Output() cerrar = new EventEmitter<void>();
    @Output() confirmar = new EventEmitter<Template>();

    templateDao = inject(TemplateDao);
    categoriaNormaDao = inject(CategoriaNormaDao);
    tipoPeriodicidadDao = inject(TipoPeriodicidadDao);

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
            }
        ),
        descripcion: new FormControl<string>(
            { value: '', disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            }
        ),
        vigencia: new FormControl<boolean>(
            { value: false, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            }
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
            }>
        >([]),
    });

    titulo = computed<string>(() => {
        if (this.item) {
            return `Actualizar el template "${this.item.nombre}":`;
        }
        return `Crear un template nuevo:`;
    });

    error = signal<string>('');

    cargandoTemplatesExistentes = signal<boolean>(true);
    templatesExistentes = signal<Template[]>([]);

    cargandoDetalleTemplate = signal<boolean>(false);

    cargandoCategoriasExistentes = signal<boolean>(true);
    categoriasExistentes = signal<CategoriaNorma[]>([]);

    cargandoPeriodicidadExistentes = signal<boolean>(true);
    periodicidadesExistentes = signal<TipoPeriodicidad[]>([]);

    ngOnInit(): void {
        this.cargandoTemplatesExistentes.set(true);
        this.templateDao
            .obtenerPorVigencia(true)
            .subscribe({
                next: (vigentes) => {
                    if (this.item) {
                        vigentes = vigentes.filter((t) => t.id !== this.item?.id);
                        vigentes = this.eliminarHijosComoPosiblesPadres(vigentes, this.item?.id);
                    }
                    this.templatesExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener templates vigentes', err);
                    this.error.set(err.error ?? 'Error al obtener templates vigentes');
                },
            })
            .add(() => {
                this.cargandoTemplatesExistentes.set(false);
            });

        this.cargandoCategoriasExistentes.set(true);
        this.categoriaNormaDao
            .obtenerPorVigencia(true)
            .subscribe({
                next: (vigentes) => {
                    this.categoriasExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener categorías vigentes', err);
                    this.error.set(err.error ?? 'Error al obtener categorías vigentes');
                },
            })
            .add(() => {
                this.cargandoCategoriasExistentes.set(false);
            });

        this.cargandoPeriodicidadExistentes.set(true);
        this.tipoPeriodicidadDao
            .obtenerPorVigencia(true)
            .subscribe({
                next: (vigentes) => {
                    this.periodicidadesExistentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener periodicidades vigentes', err);
                    this.error.set(err.error ?? 'Error al obtener periodicidades vigentes');
                },
            })
            .add(() => {
                this.cargandoPeriodicidadExistentes.set(false);
            });

        if (this.item) {
            this.cargandoDetalleTemplate.set(true);
            this.templateDao
                .obtener(this.item.id)
                .subscribe({
                    next: (detalleTemplate) => {
                        detalleTemplate?.templateNormas?.forEach((norma) => {
                            (this.form.get('templateNormas') as FormArray).push(
                                this.buildNormaFormGroup(norma)
                            );
                        });
                    },
                    error: (err) => {
                        console.error('Error al obtener los detalles del template', err);
                        this.error.set(err.error ?? 'Error al obtener los detalles del template');
                    },
                })
                .add(() => {
                    this.cargandoDetalleTemplate.set(false);
                });

            this.form.patchValue({
                id: this.item.id,
                idTemplatePadre: this.item.idTemplatePadre,
                nombre: this.item.nombre,
                descripcion: this.item.descripcion,
                vigencia: this.item.vigencia,
            });
            this.form.controls['id'].disable();
        }
    }

    private eliminarHijosComoPosiblesPadres(
        vigentes: Template[],
        idTemplatePadre: number
    ): Template[] {
        let casosConDichoPadre = vigentes.filter((t) => t.idTemplatePadre === idTemplatePadre);

        casosConDichoPadre.forEach((p) => {
            vigentes = this.eliminarHijosComoPosiblesPadres(vigentes, p.id);
        });

        let casosSinDichoPadre = vigentes.filter((t) => t.idTemplatePadre !== idTemplatePadre);
        return casosSinDichoPadre;
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
                templateNormaFiscalizadores: new FormControl(this.buildFiscalizadores([])),
                templateNormaNotificaciones: new FormControl(this.buildNotificaciones([])),
            })
        );
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
            templateNormaFiscalizadores: new FormControl(
                this.buildFiscalizadores(norma.templateNormaFiscalizadores ?? [])
            ),
            templateNormaNotificaciones: new FormControl(
                this.buildNotificaciones(norma.templateNormaNotificaciones ?? [])
            ),
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
                    })
            ) ?? []
        );
    }

    private buildNotificaciones(list: TemplateNormaNotificacion[]) {
        return new FormArray(
            list.map(
                (x) =>
                    new FormGroup({
                        idTipoUnidadTiempoAntelacion: new FormControl(
                            x.idTipoUnidadTiempoAntelacion,
                            { nonNullable: true, validators: [Validators.required] }
                        ),
                        cantAntelacion: new FormControl(x.cantAntelacion, {
                            nonNullable: true,
                            validators: [Validators.required],
                        }),
                    })
            ) ?? []
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
        };

        this.form.controls['templateNormas'].controls.forEach((normaControl) => {
            template.templateNormas?.push({
                idTemplate: template.id,
                idNorma: normaControl.controls['idNorma'].value!,
                nombre: normaControl.controls['nombre'].value,
                descripcion: normaControl.controls['descripcion'].value,
                idTipoPeriodicidad: normaControl.controls['idTipoPeriodicidad'].value,
                multa: normaControl.controls['multa'].value,
                idCategoriaNorma: normaControl.controls['idCategoriaNorma'].value!,
            } as TemplateNorma);
        });

        this.confirmar.emit(template);
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
