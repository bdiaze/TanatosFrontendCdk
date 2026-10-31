import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { TipoCuentaFinancieraDao } from '@/app/daos/tipo-cuenta-financiera-dao';
import { TipoCuentaFinanciera } from '@/app/entities/models/tipo-cuenta-financiera';
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
import { HlmH3, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-tipo-cuenta-financiera',
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
    templateUrl: './mantenedor-tipo-cuenta-financiera.html',
    styleUrl: './mantenedor-tipo-cuenta-financiera.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX })],
})
export class MantenedorTipoCuentaFinanciera implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly dao: TipoCuentaFinancieraDao = inject(TipoCuentaFinancieraDao);

    listado = signal([] as TipoCuentaFinanciera[]);
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
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<TipoCuentaFinanciera | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao
            .obtenerTodos()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los tipos de cuentas financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los tipos de cuentas financieras');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: TipoCuentaFinanciera) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: TipoCuentaFinanciera) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo de cuenta financiera', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el tipo de cuenta financiera');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: TipoCuentaFinanciera) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: TipoCuentaFinanciera) {
        this.cargando.set(true);

        this.dao
            .actualizar({
                id: item.id,
                nombre: item.nombre,
                vigencia: item.vigencia,
            } as TipoCuentaFinanciera)
            .subscribe({
                next: () => {
                    this.obtenerTodos();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al editar el tipo de cuenta financiera', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al editar el tipo de cuenta financiera');
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

    crear(item: TipoCuentaFinanciera) {
        this.cargando.set(true);

        this.dao
            .crear({
                id: item.id,
                nombre: item.nombre,
                vigencia: item.vigencia,
            } as TipoCuentaFinanciera)
            .subscribe({
                next: () => {
                    this.obtenerTodos();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al crear el tipo de cuenta financiera', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al crear el tipo de cuenta financiera');
                },
            });
        this.showModalCrear.set(false);
    }
}
