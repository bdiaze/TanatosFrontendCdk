import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { VideoTutorialDao } from '@/app/daos/video-tutorial-dao';
import { EntVideoTutorialActualizar } from '@/app/entities/others/ent-video-tutorial-actualizar';
import { EntVideoTutorialCrear } from '@/app/entities/others/ent-video-tutorial-crear';
import { SalVideoTutorial } from '@/app/entities/others/sal-video-tutorial';
import { getErrorMessage } from '@/app/helpers/error-message';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX, lucideEllipsis, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-video-tutorial',
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
        HlmScrollAreaImports,
        HlmSkeletonImports,
    ],
    templateUrl: './mantenedor-video-tutorial.html',
    styleUrl: './mantenedor-video-tutorial.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX })],
})
export class MantenedorVideoTutorial implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly dao: VideoTutorialDao = inject(VideoTutorialDao);

    listado = signal([] as SalVideoTutorial[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'titulo',
            nombre: 'Título',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'descripcion',
            nombre: 'Descripción',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'url',
            nombre: 'URL',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'orden',
            nombre: 'Orden',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'habilitado',
            nombre: 'Visible',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    camposCreacion = signal<CampoDinamico[]>([
        {
            llave: 'titulo',
            nombre: 'Título',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'descripcion',
            nombre: 'Descripción',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'url',
            nombre: 'URL',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'orden',
            nombre: 'Orden',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'habilitado',
            nombre: 'Visible',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<SalVideoTutorial | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.orden - b.orden);
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener videos tutoriales', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener videos tutoriales');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalVideoTutorial) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalVideoTutorial) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el video tutorial', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el video tutorial');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: SalVideoTutorial) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: SalVideoTutorial) {
        this.cargando.set(true);

        this.dao
            .actualizar({
                id: item.id,
                titulo: item.titulo,
                descripcion: item.descripcion,
                url: item.url,
                habilitado: item.habilitado,
                orden: item.orden,
            } as EntVideoTutorialActualizar)
            .subscribe({
                next: () => {
                    this.obtenerTodos();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al editar el video tutorial', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al editar el video tutorial');
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

    crear(item: SalVideoTutorial) {
        this.cargando.set(true);

        this.dao
            .crear({
                titulo: item.titulo,
                descripcion: item.descripcion,
                url: item.url,
                habilitado: item.habilitado,
                orden: item.orden,
            } as EntVideoTutorialCrear)
            .subscribe({
                next: () => {
                    this.obtenerTodos();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al crear el video tutorial', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al crear el video tutorial');
                },
            });
        this.showModalCrear.set(false);
    }
}
