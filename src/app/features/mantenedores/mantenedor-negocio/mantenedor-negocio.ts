import {
    CampoDinamico,
    ModalEdicion,
    PosiblesValores,
} from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { TipoActividadDao } from '@/app/daos/tipo-actividad-dao';
import { TipoRubroDao } from '@/app/daos/tipo-rubro-dao';
import { TipoActividad } from '@/app/entities/models/tipo-actividad';
import { TipoRubro } from '@/app/entities/models/tipo-rubro';
import { EntNegocioActualizar } from '@/app/entities/others/ent-negocio-actualizar';
import { EntNegocioCrear } from '@/app/entities/others/ent-negocio-crear';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
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
import { HlmH4 } from '@spartan-ng/helm/typography';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-mantenedor-negocio',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmButtonImports,
        HlmTableImports,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
    ],
    templateUrl: './mantenedor-negocio.html',
    styleUrl: './mantenedor-negocio.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorNegocio implements OnInit {
    private dao: NegocioDao = inject(NegocioDao);
    private tipoRubroDao: TipoRubroDao = inject(TipoRubroDao);
    private tipoActividadDao: TipoActividadDao = inject(TipoActividadDao);

    listado = signal([] as SalNegocio[]);
    tiposRubros = signal([] as TipoRubro[]);
    tiposActividades = signal([] as TipoActividad[]);
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
            .subscribe({
                next: ({ negocios, tiposRubros, tiposActividades }) => {
                    this.tiposRubros.set(tiposRubros);
                    this.tiposActividades.set(tiposActividades);

                    const sorted = negocios.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );
                    this.listado.set(sorted);

                    const sortedActividades = tiposActividades.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );

                    const posiblesValoresActividades = [] as PosiblesValores[];
                    sortedActividades.forEach((tipoActividad) => {
                        const tipoRubro = tiposRubros.find(
                            (u) => u.id === tipoActividad.idTipoRubro
                        );
                        if (tipoRubro) {
                            posiblesValoresActividades.push({
                                id: tipoActividad.id,
                                valor: tipoActividad.nombre,
                                categoria: tipoRubro.nombre,
                            });
                        }
                    });

                    this.camposEdicion.update((lista) =>
                        lista.map((u) =>
                            u.llave === 'idTipoActividad'
                                ? { ...u, posiblesValores: posiblesValoresActividades }
                                : u
                        )
                    );

                    this.camposCreacion.update((lista) =>
                        lista.map((u) =>
                            u.llave === 'idTipoActividad'
                                ? { ...u, posiblesValores: posiblesValoresActividades }
                                : u
                        )
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

    obtenerNombreRubro(idTipoActividad: number | null): string {
        const tipoActividad = this.tiposActividades().find((u) => u.id === idTipoActividad);
        return this.tiposRubros().find((u) => u.id === tipoActividad?.idTipoRubro)?.nombre ?? '';
    }

    obtenerNombreActividad(idTipoActividad: number | null): string {
        return this.tiposActividades().find((u) => u.id === idTipoActividad)?.nombre ?? '';
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
}
