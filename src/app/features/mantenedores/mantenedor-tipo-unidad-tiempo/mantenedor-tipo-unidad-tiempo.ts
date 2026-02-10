import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { TipoUnidadTiempoDao } from '@/app/daos/tipo-unidad-tiempo-dao';
import { TipoUnidadTiempo } from '@/app/entities/models/tipo-unidad-tiempo';
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
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { catchError, combineLatest, of } from 'rxjs';

@Component({
    selector: 'app-mantenedor-tipo-unidad-tiempo',
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
        DecimalPipe,
        HlmSkeletonImports,
    ],
    templateUrl: './mantenedor-tipo-unidad-tiempo.html',
    styleUrl: './mantenedor-tipo-unidad-tiempo.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorTipoUnidadTiempo implements OnInit {
    private dao: TipoUnidadTiempoDao = inject(TipoUnidadTiempoDao);

    listado = signal([] as TipoUnidadTiempo[]);
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
            llave: 'nombrePlural',
            nombre: 'Plural',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'cantSegundos',
            nombre: 'Cant. Segundos',
            tipo: 'number',
            requerido: true,
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
            llave: 'nombrePlural',
            nombre: 'Plural',
            tipo: 'string',
            requerido: false,
            deshabilitado: false,
        },
        {
            llave: 'cantSegundos',
            nombre: 'Cant. Segundos',
            tipo: 'number',
            requerido: true,
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

    itemSeleccionado = signal<TipoUnidadTiempo | null>(null);

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
                console.error('Error al obtener tipos de unidad de tiempo', err);
                this.error.set(err.error ?? 'Error al obtener tipos de unidad de tiempo');
                this.cargando.set(false);
            },
        });
    }

    openModalEliminar(item: TipoUnidadTiempo) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: TipoUnidadTiempo) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo unidad de tiempo', err);
                this.error.set(err.error ?? 'Error al eliminar el tipo unidad de tiempo');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: TipoUnidadTiempo) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: TipoUnidadTiempo) {
        this.cargando.set(true);

        if (item.nombrePlural?.trim().length == 0) {
            item.nombrePlural = null;
        }

        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el tipo unidad de tiempo', err);
                this.error.set(err.error ?? 'Error al editar el tipo unidad de tiempo');
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

    crear(item: TipoUnidadTiempo) {
        this.cargando.set(true);

        if (item.nombrePlural?.trim().length == 0) {
            item.nombrePlural = null;
        }

        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el tipo unidad de tiempo', err);
                this.error.set(err.error ?? 'Error al crear el tipo unidad de tiempo');
            },
        });
        this.showModalCrear.set(false);
    }
}
