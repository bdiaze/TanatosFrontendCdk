import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucideCalendarCog,
    lucideClipboardList,
    lucideClipboardPaste,
    lucideEllipsis,
    lucideFrown,
    lucideLayers,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { PlainTextPipe } from '@/app/pipes/plain-text-pipe';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DriveStep } from 'driver.js';
import { TourService } from '@/app/helpers/tour-service';
import { map } from 'rxjs';

@Component({
    selector: 'app-mantenedor-norma-suscrita',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmH3,
        HlmH4,
        RouterLink,
        HlmSeparatorImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
    ],
    templateUrl: './mantenedor-norma-suscrita.html',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideBadgeCheck,
            lucideBadgeX,
            lucideCalendarCog,
            lucideLayers,
            lucideFrown,
            lucideClipboardList,
            lucideClipboardPaste,
        }),
        PlainTextPipe,
    ],
})
export class MantenedorNormaSuscrita {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);
    private readonly normaSuscritaDao: NormaSuscritaDao = inject(NormaSuscritaDao);
    negocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    private readonly listado = signal([] as SalNormaSuscrita[]);
    listadoMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    nombre: 'Obligación de ejemplo',
                    descripcion: 'Esta es la descripcion de una obligación de ejemplo...',
                    nombreTipoPeriodicidad: 'Mensual',
                    activado: true,
                    editable: true,
                },
                {
                    templateNorma: {
                        nombreTemplate: 'Plantilla de ejemplo',
                        nombre: 'Obligación de plantilla',
                        descripcion: 'Esta es una obligación de ejemplo asociada a una plantilla...',
                        nombreTipoPeriodicidad: 'Semestral',
                    },
                    activado: true,
                    editable: true,
                } as SalNormaSuscrita,
            ] as SalNormaSuscrita[];
        }
        return this.listado();
    });
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<SalNormaSuscrita | null>(null);

    constructor(private readonly plainTextPipe: PlainTextPipe) {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.obtenerTodos();
                }
            });
        });

        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.normaSuscritaDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.listado.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener las normas vigentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las normas vigentes');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalNormaSuscrita) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalNormaSuscrita) {
        this.cargando.set(true);
        this.normaSuscritaDao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar la obligación', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar la obligación');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalCrear() {
        this.itemSeleccionado.set(null);
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
        this.itemSeleccionado.set(null);
    }

    openModalEditar(item: SalNormaSuscrita) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    confirmar(item: SalNormaSuscrita) {
        this.obtenerTodos();
        this.showModalCrear.set(false);
        this.showModalEditar.set(false);
    }

    truncarDescripcion(texto: string | null | undefined, max: number = 90): string {
        if (!texto) return '';

        // Se quitan elementos HTML del texto...
        texto = this.plainTextPipe.transform(texto);

        // Se limita el largo de la descripción...
        if (texto.length <= max) {
            return texto;
        }

        const cortado = texto.slice(0, max);
        const ultimoEspacio = cortado.lastIndexOf(' ');

        if (ultimoEspacio < max - 12) {
            return cortado + '...';
        }

        return cortado.slice(0, ultimoEspacio).trim() + '...';
    }

    obtenerNormasPropias = computed(() => {
        return this.listadoMostrar()
            .filter((x) => x.templateNorma == null)
            .sort((a, b) => (a.nombre && b.nombre ? a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()) : a.id - b.id));
    });

    obtenerNormasSegunTemplate = computed(() => {
        const resultado: Record<string, SalNormaSuscrita[]> = {};

        for (const norma of this.listadoMostrar()) {
            const template = norma.templateNorma?.nombreTemplate;
            if (!template) continue;

            if (!resultado[template]) {
                resultado[template] = [];
            }

            resultado[template].push(norma);
        }

        for (const key in resultado) {
            resultado[key].sort((a, b) => a.id - b.id);
        }

        return resultado;
    });

    obtenerTemplatesSuscritos = computed(() => {
        const normasConTemplate = this.listadoMostrar().filter((x) => x.templateNorma != null);

        const templates: string[] = [...new Set(normasConTemplate.map((n) => n.templateNorma?.nombreTemplate!))];
        return templates.sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
    });

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Ya estamos en Mis Obligaciones!',
                    description: 'Ahora que ya estamos en Mis Obligaciones, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá están tus obligaciones',
                    description: 'Aquí podrás configurar todas tus obligaciones, crear nuevas, modificar existentes e incluso eliminarlas.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#obligaciones-propias',
                    popover: {
                        title: 'Tus propias obligaciones',
                        description: 'Comenzamos mostrándote las obligaciones que tu has creado.',
                    },
                },
                {
                    element: '#obligaciones-plantillas',
                    popover: {
                        title: 'Obligaciones de plantillas',
                        description: 'En la parte inferior, te mostramos todas las obligaciones asociadas a las plantillas que tienes inscritas.',
                    },
                },
                {
                    element: '#inscripcion-plantilla',
                    popover: {
                        title: '¿Más plantillas?',
                        description: 'Si deseas inscribirte a más plantillas de obligaciones ¡Por acá!',
                    },
                    onHighlightStarted: (element) => {
                        const parent = element?.parentElement;
                        if (parent) {
                            parent.style.setProperty('overflow', 'visible', 'important');
                        }
                    },
                    onDeselected: (element) => {
                        const parent = element?.parentElement;
                        if (parent) {
                            parent.style.removeProperty('overflow');
                        }
                    },
                },
                {
                    element: '#boton-opciones',
                    popover: {
                        title: '¿Y cómo modifico una obligación?',
                        description: 'Con este botón puedes acceder a modificar o eliminar la obligación.',
                    },
                },
                {
                    element: '#creacion-obligacion',
                    popover: {
                        title: 'Click aquí para crear',
                        description: 'Y con este botón podrás crear las obligaciones que tu desees.',
                    },
                },
            ] as DriveStep[]),
        );

        let cambiandoASiguiente = false;

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
                if (!cambiandoASiguiente && this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
            onNextFromLast: () => {
                if (this.ayuda() === '1') {
                    cambiandoASiguiente = true;
                    this.router.navigate(['/crear-obligacion'], { queryParams: { ayuda: 1 } });
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: false,
                doneBtnText: 'Siguiente',
            };
        }

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
