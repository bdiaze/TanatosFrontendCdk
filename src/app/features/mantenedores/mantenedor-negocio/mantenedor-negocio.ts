import { CampoDinamico, ModalEdicion, PosiblesValores } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PopupFuncionalidadBloqueada } from '@/app/components/popup-funcionalidad-bloqueada/popup-funcionalidad-bloqueada';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { TipoActividadDao } from '@/app/daos/tipo-actividad-dao';
import { TipoRubroDao } from '@/app/daos/tipo-rubro-dao';
import { TipoActividad } from '@/app/entities/models/tipo-actividad';
import { TipoRubro } from '@/app/entities/models/tipo-rubro';
import { EntNegocioActualizar } from '@/app/entities/others/ent-negocio-actualizar';
import { EntNegocioCrear } from '@/app/entities/others/ent-negocio-crear';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX, lucideEllipsis, lucideGem, lucideSquarePen, lucideStore, lucideTrash2, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmP, HlmH4 } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { forkJoin, map } from 'rxjs';

@Component({
    selector: 'app-mantenedor-negocio',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmButtonImports,
        HlmTableImports,
        HlmH3,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmSkeletonImports,
        HlmBreadcrumbImports,
        HlmTooltipImports,
        PopupFuncionalidadBloqueada,
        RouterModule,
    ],
    templateUrl: './mantenedor-negocio.html',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideBadgeCheck,
            lucideBadgeX,
            lucideStore,
            lucideGem,
            lucideTrash2,
            lucideSquarePen,
        }),
    ],
})
export class MantenedorNegocio implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    private readonly dao: NegocioDao = inject(NegocioDao);
    private readonly tipoRubroDao: TipoRubroDao = inject(TipoRubroDao);
    private readonly tipoActividadDao: TipoActividadDao = inject(TipoActividadDao);
    negocioStore: NegocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    listado = signal([] as SalNegocio[]);
    listadoMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    nombre: 'Negocio de ejemplo',
                    direccion: 'Av. de Ejemplo 123, Comuna de Ejemplo',
                    idTipoActividad: -1,
                },
            ] as SalNegocio[];
        }
        return this.listado();
    });

    tiposRubros = signal([] as TipoRubro[]);
    tiposRubrosMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    id: -1,
                    nombre: 'Ejemplo',
                },
            ] as TipoRubro[];
        }
        return this.tiposRubros();
    });

    tiposActividades = signal([] as TipoActividad[]);
    tiposActividadesMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    id: -1,
                    idTipoRubro: -1,
                    nombre: 'Actividad',
                },
            ] as TipoActividad[];
        }
        return this.tiposActividades();
    });

    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        {
            llave: 'id',
            nombre: 'ID',
            tipo: 'oculto',
            requerido: true,
            deshabilitado: true,
        },
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'direccion',
            nombre: 'Dirección',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'idTipoActividad',
            nombre: 'Actividad',
            tipo: 'autocomplete',
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
            llave: 'direccion',
            nombre: 'Dirección',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'idTipoActividad',
            nombre: 'Actividad',
            tipo: 'autocomplete',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [],
        },
    ]);

    itemSeleccionado = signal<SalNegocio | null>(null);

    constructor() {
        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        forkJoin({
            negocios: this.dao.obtenerVigentes(),
            tiposRubros: this.tipoRubroDao.obtenerVigentes(),
            tiposActividades: this.tipoActividadDao.obtenerVigentes(),
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ negocios, tiposRubros, tiposActividades }) => {
                    this.tiposRubros.set(tiposRubros);
                    this.tiposActividades.set(tiposActividades);

                    const sorted = negocios.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
                    this.listado.set(sorted);

                    const sortedActividades = tiposActividades.sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));

                    const posiblesValoresActividades = [] as PosiblesValores[];
                    sortedActividades.forEach((tipoActividad) => {
                        const tipoRubro = tiposRubros.find((u) => u.id === tipoActividad.idTipoRubro);
                        if (tipoRubro) {
                            posiblesValoresActividades.push({
                                id: tipoActividad.id,
                                valor: tipoActividad.nombre,
                                categoria: tipoRubro.nombre,
                            });
                        }
                    });

                    this.camposEdicion.update((lista) =>
                        lista.map((u) => (u.llave === 'idTipoActividad' ? { ...u, posiblesValores: posiblesValoresActividades } : u)),
                    );

                    this.camposCreacion.update((lista) =>
                        lista.map((u) => (u.llave === 'idTipoActividad' ? { ...u, posiblesValores: posiblesValoresActividades } : u)),
                    );
                },
                error: (err) => {
                    console.error('Error al obtener los negocios', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los negocios');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    puedeCrear = computed(() => {
        if (this.ayudaRunning()) return true;

        const tienePlanEmpresa = this.negocioStore.informacionUsuario()?.tienePlanEmpresa ?? false;
        const negocios = this.listadoMostrar();
        if (negocios.length > 0 && !tienePlanEmpresa) {
            return false;
        }
        return true;
    });

    obtenerNombreRubro(idTipoActividad: number | null): string {
        const tipoActividad = this.tiposActividadesMostrar().find((u) => u.id === idTipoActividad);
        return this.tiposRubrosMostrar().find((u) => u.id === tipoActividad?.idTipoRubro)?.nombre ?? '';
    }

    obtenerNombreActividad(idTipoActividad: number | null): string {
        return this.tiposActividadesMostrar().find((u) => u.id === idTipoActividad)?.nombre ?? '';
    }

    openModalEliminar(item: SalNegocio) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalNegocio) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el negocio', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el negocio');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: SalNegocio) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: EntNegocioActualizar) {
        this.cargando.set(true);
        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el negocio', err);
                this.error.set(getErrorMessage(err) ?? 'Error al editar el negocio');
            },
        });
        this.showModalEditar.set(false);
    }

    openModalCrear() {
        this.itemSeleccionado.set(null);
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
        this.itemSeleccionado.set(null);
    }

    crear(item: EntNegocioCrear) {
        this.cargando.set(true);
        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el negocio', err);
                this.error.set(getErrorMessage(err) ?? 'Error al crear el negocio');
            },
        });
        this.showModalCrear.set(false);
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mis Negocios',
                    description: 'Ahora que ya estamos en Mis Negocios, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá están tus negocios',
                    description: 'Aquí podrás administrar todos tus negocios, registrar nuevos, modificar existentes e incluso eliminarlos.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#tabla_negocios',
                    popover: {
                        title: 'Resumen de tus negocios',
                        description: 'Acá encontrarás los datos más importantes de tus negocios.',
                    },
                },
                {
                    element: '#nombre',
                    popover: {
                        title: 'Primero, el nombre',
                        description: 'Comenzamos por el nombre de tu negocio.',
                    },
                },
                {
                    element: '#direccion',
                    popover: {
                        title: 'Luego, la dirección',
                        description: 'Si ingresaste una dirección al crear tu negocio, se mostrará acá.',
                    },
                },
                {
                    element: '#actividad',
                    popover: {
                        title: 'Y la actividad/rubro',
                        description: 'Y al final, te mostramos la actividad y rubro asociado a tu negocio.',
                    },
                },
                {
                    element: '#opciones',
                    popover: {
                        title: 'Modifica el negocio',
                        description: 'Desde aquí puedes modificar la información de tu negocio, o incluso eliminarlo ¡Cuidado!.',
                    },
                },
                {
                    element: '#boton_crear',
                    popover: {
                        title: 'Registrar un nuevo negocio',
                        description: 'Y desde acá, ¡crear uno nuevo! Cada negocio posee sus propias obligaciones y equipo, ¡Vamos allá!',
                    },
                    onHighlightStarted: () => {
                        this.closeModalCrear();
                    },
                },
                {
                    popover: {
                        title: 'Datos del nuevo negocio',
                        description: 'A continuación, podrás ingresar los datos del negocio que deseas registrar.',
                    },
                    onHighlightStarted: () => {
                        this.openModalCrear();
                    },
                },
                {
                    element: '#input_nombre',
                    popover: {
                        title: 'Nombre del negocio',
                        description: 'Comenzando por el nombre del nuevo negocio.',
                    },
                },
                {
                    element: '#input_direccion',
                    popover: {
                        title: 'La dirección del negocio',
                        description: 'Seguido, opcionalmente, por la dirección del negocio.',
                    },
                },
                {
                    element: '#input_idTipoActividad',
                    popover: {
                        title: 'Actividad y rubro',
                        description: 'Y por último, deberás seleccionar la actividad a la que se dedica tu negocio.',
                    },
                },
                {
                    element: '#boton_confirmar',
                    popover: {
                        title: 'Guardar',
                        description: '¡Ah! y que no se te olvide guardar tu nuevo negocio.',
                    },
                },
            ] as DriveStep[]),
        );

        let config: {
            pasos: DriveStep[];
            onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
            showProgress?: boolean;
            doneBtnText?: string;
            onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
        } = {
            pasos: steps,
            onFinish: () => {
                this.ayudaRunning.set(false);
                this.closeModalCrear();
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: true,
            };
        }

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
