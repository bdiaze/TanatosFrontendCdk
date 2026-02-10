import {
    CampoDinamico,
    ModalEdicion,
    PosiblesValores,
} from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { TipoActividadDao } from '@/app/daos/tipo-actividad-dao';
import { TipoRubroDao } from '@/app/daos/tipo-rubro-dao';
import { TipoActividad } from '@/app/entities/models/tipo-actividad';
import { TipoRubro } from '@/app/entities/models/tipo-rubro';
import { getErrorMessage } from '@/app/helpers/error-message';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucideEllipsis,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { forkJoin } from 'rxjs';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-mantenedor-tipo-actividad',
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
    templateUrl: './mantenedor-tipo-actividad.html',
    styleUrl: './mantenedor-tipo-actividad.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorTipoActividad implements OnInit {
    private dao: TipoActividadDao = inject(TipoActividadDao);
    private tipoRubroDao: TipoRubroDao = inject(TipoRubroDao);

    listado = signal([] as TipoActividad[]);
    tiposRubros = signal([] as TipoRubro[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'number', requerido: true, deshabilitado: true },
        {
            llave: 'nombre',
            nombre: 'Nombre',
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
            llave: 'idTipoRubro',
            nombre: 'Tipo Rubro',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [],
        },
        {
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    camposCreacion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'number', requerido: true, deshabilitado: false },
        {
            llave: 'nombre',
            nombre: 'Nombre',
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
            llave: 'idTipoRubro',
            nombre: 'Tipo Rubro',
            tipo: 'select',
            requerido: true,
            deshabilitado: false,
            posiblesValores: [],
        },
        {
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<TipoActividad | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);
        this.tiposRubros.set([]);

        forkJoin({
            tiposActividades: this.dao.obtenerPorVigencia(null),
            tiposRubros: this.tipoRubroDao.obtenerPorVigencia(null),
        })
            .subscribe({
                next: ({ tiposActividades, tiposRubros }) => {
                    const sorted = tiposActividades.sort((a, b) => a.id - b.id);
                    this.listado.set(sorted);

                    const sortedRubros = tiposRubros.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.tiposRubros.set(sortedRubros);

                    const posiblesValoresRubros = [] as PosiblesValores[];
                    sortedRubros.forEach((tipoRubro) => {
                        posiblesValoresRubros.push({
                            id: tipoRubro.id,
                            valor: tipoRubro.nombre,
                        });
                    });

                    this.camposEdicion.update((lista) =>
                        lista.map((u) =>
                            u.llave === 'idTipoRubro'
                                ? { ...u, posiblesValores: posiblesValoresRubros }
                                : u,
                        ),
                    );

                    this.camposCreacion.update((lista) =>
                        lista.map((u) =>
                            u.llave === 'idTipoRubro'
                                ? { ...u, posiblesValores: posiblesValoresRubros }
                                : u,
                        ),
                    );
                },
                error: (err) => {
                    console.error('Error al obtener tipos de actividades', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener tipos de actividades');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    nombreRubro(idTipoRubro: number) {
        const rubro = this.tiposRubros().find((u) => u.id === idTipoRubro);
        return rubro?.nombre;
    }

    openModalEliminar(item: TipoActividad) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: TipoActividad) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo de actividad', err);
                this.error.set(err.error ?? 'Error al eliminar el tipo de actividad');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: TipoActividad) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: TipoActividad) {
        this.cargando.set(true);
        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el tipo de actividad', err);
                this.error.set(err.error ?? 'Error al editar el tipo de actividad');
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

    crear(item: TipoActividad) {
        this.cargando.set(true);
        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el tipo de actividad', err);
                this.error.set(err.error ?? 'Error al crear el tipo de actividad');
            },
        });
        this.showModalCrear.set(false);
    }
}
