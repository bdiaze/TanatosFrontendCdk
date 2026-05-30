import { PosiblesValores } from '@/app/components/modal-edicion/modal-edicion';
import { TemplateDao } from '@/app/daos/template-dao';
import { TipoActividadDao } from '@/app/daos/tipo-actividad-dao';
import { TipoRubroDao } from '@/app/daos/tipo-rubro-dao';
import { Template } from '@/app/entities/models/template';
import { getErrorMessage } from '@/app/helpers/error-message';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { normalize } from '@/app/helpers/string-comparator';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, OnDestroy, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronRight, lucideGem, lucideMoveLeft, lucideMoveRight, lucideStar, lucideStore, lucideX } from '@ng-icons/lucide';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { forkJoin } from 'rxjs';
import { PlainTextPipe } from '@/app/pipes/plain-text-pipe';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { InscripcionTemplateDao } from '@/app/daos/inscripcion-template-dao';
import { EntNegocioCrear } from '@/app/entities/others/ent-negocio-crear';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { EntInscripcionTemplateActivar } from '@/app/entities/others/ent-inscripcion-template-activar';
import { Router } from '@angular/router';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-bienvenida',
    imports: [
        ReactiveFormsModule,
        HlmIcon,
        NgIcon,
        HlmP,
        HlmH3,
        HlmH4,
        HlmSeparatorImports,
        HlmInputImports,
        HlmAutocompleteImports,
        HlmButtonImports,
        HlmCardImports,
        PlainTextPipe,
        HlmSwitch,
        HlmTooltipImports,
        HlmSpinnerImports,
    ],
    templateUrl: './bienvenida.html',
    styleUrl: './bienvenida.scss',
    providers: [provideIcons({ lucideMoveLeft, lucideMoveRight, lucideX, lucideStar, lucideCheck, lucideGem, lucideStore })],
})
export class Bienvenida implements OnInit, OnDestroy {
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);
    negocioStore = inject(NegocioStore);
    tipoRubroDao = inject(TipoRubroDao);
    tipoActividadDao = inject(TipoActividadDao);
    plantillaDao = inject(TemplateDao);
    negocioDao = inject(NegocioDao);
    inscripcionTemplateDao = inject(InscripcionTemplateDao);

    formNegocio: FormGroup<{
        nombre: FormControl<string | null>;
        direccion: FormControl<string | null>;
        idActividad: FormControl<number | null>;
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
        direccion: new FormControl<string | null>({ value: null, disabled: false }),
        idActividad: new FormControl<number | null>({ value: null, disabled: false }, [Validators.required]),
    });

    idActividadSignal = toSignal(this.formNegocio.controls.idActividad.valueChanges, {
        initialValue: this.formNegocio.controls.idActividad.value,
    });

    constructor() {
        effect(() => {
            const idActividad = this.idActividadSignal();
            untracked(() => {
                if (idActividad) {
                    this.searchActividad.set(this.nombreActividad(idActividad));
                    this.obtenerPlantillas(idActividad);
                }
            });
        });
    }

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
        this.obtenerActividades();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }

    tienePlanEmpresa = computed(() => {
        return this.negocioStore.informacionUsuario()?.tienePlanEmpresa ?? false;
    });

    error = signal('');

    cargandoActividades = signal(false);
    actividades = signal<any[]>([]);

    obtenerActividades() {
        this.cargandoActividades.set(true);
        this.actividades.set([]);

        forkJoin({
            tiposRubros: this.tipoRubroDao.obtenerVigentes(),
            tiposActividades: this.tipoActividadDao.obtenerVigentes(),
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ tiposRubros, tiposActividades }) => {
                    const sortedActividades = tiposActividades.sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));

                    const actividades = [] as any[];
                    sortedActividades.forEach((tipoActividad) => {
                        const tipoRubro = tiposRubros.find((u) => u.id === tipoActividad.idTipoRubro);
                        if (tipoRubro) {
                            actividades.push({
                                idActividad: tipoActividad.id,
                                nombreActividad: tipoActividad.nombre,
                                nombreRubro: tipoRubro.nombre,
                            });
                        }
                    });

                    this.actividades.set(actividades);
                },
                error: (err) => {
                    console.error('Error al obtener las actividades', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las actividades');
                },
            })
            .add(() => {
                this.cargandoActividades.set(false);
            });
    }

    public readonly searchActividad = signal('');
    actividadAutocompleteFilteredOptions = computed(() => {
        const filtrados = this.actividades().filter(
            (option) =>
                normalize(option.nombreActividad).includes(normalize(this.searchActividad())) ||
                normalize(option.nombreRubro).includes(normalize(this.searchActividad())),
        );

        const categorizados: any[] = [];
        [...new Set(filtrados.map((f) => f.nombreRubro))].forEach((rubro) => {
            categorizados.push({
                rubro: rubro,
                items: filtrados.filter((f) => f.nombreRubro === rubro),
            });
        });

        return categorizados;
    });
    actividadAutocompleteItemToString = (id: number) => {
        const item = this.actividades().find((x) => x.idActividad === id);
        return `${item?.nombreActividad}`;
    };
    actividadAutocompleteIsItemEqualToValue = (itemValue: number, idSelectedValue: number | null) => {
        return itemValue === idSelectedValue;
    };
    nombreActividad(idActividad: number | null): string {
        return this.actividades().find((a) => a.idActividad === idActividad).nombreActividad;
    }
    nombreRubro(idActividad: number | null): string {
        return this.actividades().find((a) => a.idActividad === idActividad).nombreRubro;
    }

    cargandoPlantillas = signal(false);
    plantillas = signal<Template[]>([]);

    obtenerPlantillas(idActividad: number) {
        this.cargandoPlantillas.set(true);
        this.plantillas.set([]);

        this.plantillaDao
            .obtenerVigentesConNormasYRecomendacion(idActividad)
            .subscribe({
                next: (res) => {
                    let sortedRecomendadas = res.filter((p) => p.templateActividades?.find((t) => t.idTipoActividad === idActividad));

                    const recomendadosPorHijos = [] as Template[];
                    sortedRecomendadas.forEach((recomendado) => {
                        let aux: Template | undefined = recomendado;
                        while (aux?.idTemplatePadre) {
                            aux = res.find((t) => t.id == aux!.idTemplatePadre);
                            if (aux && !recomendadosPorHijos.find((r) => r.id === aux!.id)) {
                                recomendadosPorHijos.push(aux);
                            }
                        }
                    });
                    sortedRecomendadas = [...sortedRecomendadas, ...recomendadosPorHijos].sort((a, b) => a.id - b.id);

                    const sorted = res.filter((p) => !sortedRecomendadas.find((r) => r.id === p.id)).sort((a, b) => a.id - b.id);
                    this.plantillas.set([...sortedRecomendadas, ...sorted]);

                    // Se seleccionan por defecto las plantillas recomendadas...
                    this.idPlantillasSeleccionadas.set(new Set());
                    sortedRecomendadas.forEach((templateRecomendado) => {
                        if (this.tienePlanEmpresa() || !templateRecomendado.requierePlanEmpresa) {
                            this.togglePlantilla(templateRecomendado.id, true);
                        }
                    });
                },
                error: (err) => {
                    console.error('Error al obtener las plantillas de obligaciones', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las plantillas de obligaciones');
                },
            })
            .add(() => {
                this.cargandoPlantillas.set(false);
            });
    }

    plantillasSeleccionadas = computed(() => {
        return this.plantillas().filter((p) => this.idPlantillasSeleccionadas().has(p.id));
    });

    idPlantillasSeleccionadas = signal<Set<number>>(new Set());
    togglePlantilla(idTemplate: number, selected: boolean) {
        this.idPlantillasSeleccionadas.update((set) => {
            if (selected) {
                const newSet = new Set([...set, idTemplate]);
                return newSet;
            } else {
                const newSet = new Set(set);
                newSet.delete(idTemplate);
                return newSet;
            }
        });
    }

    invalid(llave: string, form: FormGroup) {
        const control = form.get(llave);
        return control?.invalid && control?.touched;
    }

    datosNegocioIngresado = signal(false);
    siguienteNegocio() {
        if (this.formNegocio.invalid) {
            this.formNegocio.markAllAsTouched();
            return;
        }
        this.datosNegocioIngresado.set(true);
    }

    datosPlantillasIngresado = signal(false);
    anteriorPlantillas() {
        this.datosNegocioIngresado.set(false);
    }
    siguientePlantillas() {
        this.datosPlantillasIngresado.set(true);
    }

    procesando = signal(false);
    anteriorGuardar() {
        this.datosPlantillasIngresado.set(false);
    }
    siguienteGuardar() {
        this.procesando.set(true);
        this.negocioDao
            .crear({
                nombre: this.formNegocio.controls.nombre.value,
                direccion: this.formNegocio.controls.direccion.value,
                idTipoActividad: this.formNegocio.controls.idActividad.value,
            } as EntNegocioCrear)
            .subscribe({
                next: (res: SalNegocio) => {
                    const requests = this.plantillasSeleccionadas().map((plantilla) =>
                        this.inscripcionTemplateDao.activar({
                            idNegocio: res.id,
                            idTemplate: plantilla.id,
                            activarPadres: false,
                        } as EntInscripcionTemplateActivar),
                    );

                    forkJoin(requests).subscribe({
                        next: (resultados) => {
                            this.negocioDao.obtenerVigentes().subscribe({
                                next: (res) => {
                                    this.router.navigateByUrl('/inicio');
                                },
                            });
                        },
                        error: (err) => {},
                    });
                },
                error: (err) => {},
            });
    }
}
