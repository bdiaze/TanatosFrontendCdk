import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { TipoPeriodicidadDao } from '@/app/daos/tipo-periodicidad-dao';
import { TipoPeriodicidad } from '@/app/entities/models/tipo-periodicidad';
import { getErrorMessage } from '@/app/helpers/error-message';
import { DecimalPipe } from '@angular/common';
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
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH4 } from '@spartan-ng/helm/typography';
import { catchError, combineLatest, of } from 'rxjs';

@Component({
    selector: 'app-mantenedor-tipo-periodicidad',
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
    templateUrl: './mantenedor-tipo-periodicidad.html',
    styleUrl: './mantenedor-tipo-periodicidad.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorTipoPeriodicidad implements OnInit {
    private dao: TipoPeriodicidadDao = inject(TipoPeriodicidadDao);

    listado = signal([] as TipoPeriodicidad[]);
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
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'cron',
            nombre: 'Cron',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaDias',
            nombre: 'Delta Días',
            tipo: 'number',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaMeses',
            nombre: 'Delta Meses',
            tipo: 'number',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaAnnos',
            nombre: 'Delta Años',
            tipo: 'number',
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
            llave: 'descripcion',
            nombre: 'Descripción',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'cron',
            nombre: 'Cron',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaDias',
            nombre: 'Delta Días',
            tipo: 'number',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaMeses',
            nombre: 'Delta Meses',
            tipo: 'number',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'deltaAnnos',
            nombre: 'Delta Años',
            tipo: 'number',
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

    itemSeleccionado = signal<TipoPeriodicidad | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao.obtenerPorVigencia(null).subscribe({
            next: (res) => {
                const sorted = res.sort((a, b) => a.id - b.id);
                this.listado.set(sorted);
                this.cargando.set(false);
            },
            error: (err) => {
                console.error('Error al obtener tipos de periodicidad', err);
                this.error.set(
                    getErrorMessage(err.error) ?? 'Error al obtener tipos de periodicidad',
                );
                this.cargando.set(false);
            },
        });
    }

    openModalEliminar(item: TipoPeriodicidad) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: TipoPeriodicidad) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo de periodicidad', err);
                this.error.set(
                    getErrorMessage(err.error) ?? 'Error al eliminar el tipo de periodicidad',
                );
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: TipoPeriodicidad) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: TipoPeriodicidad) {
        this.cargando.set(true);

        if (item.cron?.trim().length === 0) {
            item.cron = null;
        }

        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el tipo de periodicidad', err);
                this.error.set(
                    getErrorMessage(err.error) ?? 'Error al editar el tipo de periodicidad',
                );
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

    crear(item: TipoPeriodicidad) {
        this.cargando.set(true);

        if (item.cron?.trim().length === 0) {
            item.cron = null;
        }

        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el tipo de periodicidad', err);
                this.error.set(
                    getErrorMessage(err.error) ?? 'Error al crear el tipo de periodicidad',
                );
            },
        });
        this.showModalCrear.set(false);
    }
}
