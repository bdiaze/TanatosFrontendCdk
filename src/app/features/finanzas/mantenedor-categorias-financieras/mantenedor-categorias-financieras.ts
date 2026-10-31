import { CampoDinamico, ModalEdicion, PosiblesValores } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { CategoriaFinancieraDao } from '@/app/daos/categoria-financiera-dao';
import { EntCategoriaFinancieraActualizar } from '@/app/entities/others/ent-categoria-financiera-actualizar';
import { EntCategoriaFinancieraCrear } from '@/app/entities/others/ent-categoria-financiera-crear';
import { SalCategoriaFinanciera } from '@/app/entities/others/sal-categoria-financiera';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDiff, lucideEllipsis, lucideMinus, lucidePlus, lucideTag, lucideTags, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

@Component({
    selector: 'app-mantenedor-categorias-financieras',
    imports: [
        HlmP,
        HlmH3,
        HlmH4,
        HlmIcon,
        NgIcon,
        HlmBreadcrumbImports,
        HlmButtonImports,
        ModalEliminacion,
        ModalEdicion,
        HlmTableImports,
        HlmAlertImports,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmScrollAreaImports,
        HlmSkeletonImports,
    ],
    templateUrl: './mantenedor-categorias-financieras.html',
    styleUrl: './mantenedor-categorias-financieras.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideEllipsis, lucidePlus, lucideMinus, lucideDiff, lucideTags })],
})
export class MantenedorCategoriasFinancieras {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    negocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    private readonly categoriaFinancieraDao = inject(CategoriaFinancieraDao);

    listado = signal([] as SalCategoriaFinanciera[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'tipoMovimiento',
            nombre: 'Tipo',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [
                {
                    id: 1,
                    valor: 'Ingreso',
                } as PosiblesValores,
                {
                    id: 2,
                    valor: 'Gasto',
                } as PosiblesValores,
                {
                    id: 3,
                    valor: 'Ambos',
                } as PosiblesValores,
            ],
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
            llave: 'tipoMovimiento',
            nombre: 'Tipo',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [
                {
                    id: 1,
                    valor: 'Ingreso',
                } as PosiblesValores,
                {
                    id: 2,
                    valor: 'Gasto',
                } as PosiblesValores,
                {
                    id: 3,
                    valor: 'Ambos',
                } as PosiblesValores,
            ],
        },
    ]);

    itemSeleccionado = signal<SalCategoriaFinanciera | null>(null);

    constructor() {
        effect(() => {
            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
            untracked(() => {
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            });
        });
    }

    obtenerCategorias(idNegocio: number) {
        this.cargando.set(true);
        this.listado.set([]);

        this.categoriaFinancieraDao
            .obtenerVigentes(idNegocio)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener las categorías financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las categorías financieras');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalCategoriaFinanciera) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalCategoriaFinanciera) {
        this.cargando.set(true);
        this.categoriaFinancieraDao.eliminar(item.id).subscribe({
            next: () => {
                const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar la categoría financiera', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar la categoría financiera');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: SalCategoriaFinanciera) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: EntCategoriaFinancieraActualizar) {
        this.cargando.set(true);

        this.categoriaFinancieraDao.actualizar(item).subscribe({
            next: () => {
                const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar la categoría financiera', err);
                this.error.set(getErrorMessage(err) ?? 'Error al editar la categoría financiera');
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

    crear(item: EntCategoriaFinancieraCrear) {
        this.cargando.set(true);

        item.idNegocio = this.negocioStore.negocioSeleccionado()!.id;

        this.categoriaFinancieraDao.crear(item).subscribe({
            next: () => {
                const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear la categoría financiera', err);
                this.error.set(getErrorMessage(err) ?? 'Error al crear la categoría financiera');
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
                    title: '¡Listo! Llegamos a Mi Equipo',
                    description: 'Ahora que ya estamos en Mi Equipo, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá está tu equipo de trabajo',
                    description: 'Aquí podrás administrar a los integrantes de tu equipo, además de añadir medios de notificación para ellos.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#tabla_empleados',
                    popover: {
                        title: '¿Quiénes integran mi equipo?',
                        description: 'Acá encontrarás a todos los integrantes de tu equipo.',
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
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
