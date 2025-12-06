import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { CategoriaNormaDao } from '@/app/daos/categoria-norma-dao';
import { CategoriaNorma } from '@/app/entities/models/categoria-norma';
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
    selector: 'app-mantenedor-categoria-norma',
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
    templateUrl: './mantenedor-categoria-norma.html',
    styleUrl: './mantenedor-categoria-norma.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorCategoriaNorma implements OnInit {
    private dao: CategoriaNormaDao = inject(CategoriaNormaDao);

    listado = signal([] as CategoriaNorma[]);
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
            llave: 'nombreCorto',
            nombre: 'Nombre Corto',
            tipo: 'string',
            requerido: false,
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
            llave: 'nombreCorto',
            nombre: 'Nombre Corto',
            tipo: 'string',
            requerido: false,
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
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<CategoriaNorma | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        const obsVigentes = this.dao.obtenerPorVigencia(true).pipe(
            catchError((err) => {
                console.error('Error al obtener categorías normas vigentes', err);
                this.error.set(err.error ?? 'Error al obtener categorías normas vigentes');
                return of([]);
            })
        );
        const obsNoVigente = this.dao.obtenerPorVigencia(false).pipe(
            catchError((err) => {
                console.error('Error al obtener categorías normas no vigentes', err);
                this.error.set(err.error ?? 'Error al obtener categorías normas no vigentes');
                return of([]);
            })
        );

        combineLatest([obsVigentes, obsNoVigente]).subscribe({
            next: ([resA, resB]) => {
                const sorted = [...resA, ...resB].sort((a, b) => a.id - b.id);
                this.listado.set(sorted);
                this.cargando.set(false);
            },
            error: (err) => {
                console.error('Error inesperado', err);
                this.error.set('Error inesperado');
                this.cargando.set(false);
            },
        });
    }

    openModalEliminar(item: CategoriaNorma) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: CategoriaNorma) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar la categoría de norma', err);
                this.error.set(err.error ?? 'Error al eliminar la categoría de norma');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: CategoriaNorma) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: CategoriaNorma) {
        this.cargando.set(true);
        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar la categoría de norma', err);
                this.error.set(err.error ?? 'Error al editar la categoría de norma');
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

    crear(item: CategoriaNorma) {
        this.cargando.set(true);
        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear la categoría de norma', err);
                this.error.set(err.error ?? 'Error al crear la categoría de norma');
            },
        });
        this.showModalCrear.set(false);
    }
}
