import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PlanDao } from '@/app/daos/plan-dao';
import { Plan } from '@/app/entities/models/plan';
import { EntPlanCrearEditar } from '@/app/entities/others/ent-plan-crear-editar';
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
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-plan',
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
        DecimalPipe,
    ],
    templateUrl: './mantenedor-plan.html',
    styleUrl: './mantenedor-plan.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorPlan implements OnInit {
    private dao: PlanDao = inject(PlanDao);

    listado = signal([] as Plan[]);
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
            llave: 'precio',
            nombre: 'Precio',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'duracionMeses',
            nombre: 'Duración en Meses',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'suscripcionUnica',
            nombre: 'Suscripción Única',
            tipo: 'boolean',
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
            llave: 'precio',
            nombre: 'Precio',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'duracionMeses',
            nombre: 'Duración en Meses',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'suscripcionUnica',
            nombre: 'Suscripción Única',
            tipo: 'boolean',
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

    itemSeleccionado = signal<EntPlanCrearEditar | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao
            .obtenerPorVigencia(null)
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.id - b.id);
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener planes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener planes');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: Plan) {
        this.itemSeleccionado.set({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            duracionMeses: item.duracionMeses,
            suscripcionUnica: item.suscripcionUnica,
            vigencia: item.vigencia,
        } as EntPlanCrearEditar);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: EntPlanCrearEditar) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el plan', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el plan');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: Plan) {
        this.itemSeleccionado.set({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            duracionMeses: item.duracionMeses,
            suscripcionUnica: item.suscripcionUnica,
            vigencia: item.vigencia,
        } as EntPlanCrearEditar);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: EntPlanCrearEditar) {
        this.cargando.set(true);

        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el plan', err);
                this.error.set(getErrorMessage(err) ?? 'Error al editar el plan');
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

    crear(item: EntPlanCrearEditar) {
        this.cargando.set(true);

        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el plan', err);
                this.error.set(getErrorMessage(err) ?? 'Error al crear el plan');
            },
        });
        this.showModalCrear.set(false);
    }
}
