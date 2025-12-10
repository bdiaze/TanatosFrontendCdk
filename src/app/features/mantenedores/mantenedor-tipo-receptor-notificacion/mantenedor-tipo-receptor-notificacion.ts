import { TipoReceptorNotificacionDao } from '@/app/daos/tipo-receptor-notificacion-dao';
import { TipoReceptorNotificacion } from '@/app/entities/models/tipo-receptor-notificacion';
import { Component, inject, OnInit, signal } from '@angular/core';
import { catchError, combineLatest, of } from 'rxjs';
import { ModalEliminacion } from '@components/modal-eliminacion/modal-eliminacion';
import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH4 } from '@spartan-ng/helm/typography';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideTriangleAlert,
    lucideEllipsis,
    lucideBadgeCheck,
    lucideBadgeX,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
    selector: 'app-mantenedor-tipo-receptor-notificacion',
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
    ],
    templateUrl: './mantenedor-tipo-receptor-notificacion.html',
    styleUrl: './mantenedor-tipo-receptor-notificacion.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorTipoReceptorNotificacion implements OnInit {
    private tipoReceptorNotificacionDao: TipoReceptorNotificacionDao = inject(
        TipoReceptorNotificacionDao
    );

    tiposReceptoresNotificacion = signal([] as TipoReceptorNotificacion[]);
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
            llave: 'regexValidacion',
            nombre: 'Regex',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
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
            llave: 'regexValidacion',
            nombre: 'Regex',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<TipoReceptorNotificacion | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.tiposReceptoresNotificacion.set([]);

        this.tipoReceptorNotificacionDao.obtenerPorVigencia(null).subscribe({
            next: (res) => {
                const sorted = res.sort((a, b) => a.id - b.id);
                this.tiposReceptoresNotificacion.set(sorted);
                this.cargando.set(false);
            },
            error: (err) => {
                console.error('Error al obtener tipos de receptores', err);
                this.error.set(err.error ?? 'Error al obtener tipos de receptores');
                this.cargando.set(false);
            },
        });
    }

    openModalEliminar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.itemSeleccionado.set(tipoReceptorNotificacion);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.eliminar(tipoReceptorNotificacion.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo de receptor de notificación', err);
                this.error.set(
                    err.error ?? 'Error al eliminar el tipo de receptor de notificación'
                );
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.itemSeleccionado.set(tipoReceptorNotificacion);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.actualizar(tipoReceptorNotificacion).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el tipo de receptor de notificación', err);
                this.error.set(err.error ?? 'Error al editar el tipo de receptor de notificación');
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

    crear(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.crear(tipoReceptorNotificacion).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el tipo de receptor de notificación', err);
                this.error.set(err.error ?? 'Error al crear el tipo de receptor de notificación');
            },
        });
        this.showModalCrear.set(false);
    }
}
