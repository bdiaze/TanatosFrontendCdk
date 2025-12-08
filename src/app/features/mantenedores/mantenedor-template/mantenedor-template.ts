import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { TemplateDao } from '@/app/daos/template-dao';
import { Template } from '@/app/entities/models/template';
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
import { ModalEdicionTemplate } from '@/app/components/modal-edicion-template/modal-edicion-template';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
    selector: 'app-mantenedor-template',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        ModalEdicionTemplate,
        HlmBadgeImports,
    ],
    templateUrl: './mantenedor-template.html',
    styleUrl: './mantenedor-template.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }),
    ],
})
export class MantenedorTemplate implements OnInit {
    private dao: TemplateDao = inject(TemplateDao);

    listado = signal<Template[]>([]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<Template | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        const obsVigentes = this.dao.obtenerPorVigencia(true).pipe(
            catchError((err) => {
                console.error('Error al obtener templates vigentes', err);
                this.error.set(err.error ?? 'Error al obtener templates vigentes');
                return of([]);
            })
        );
        const obsNoVigente = this.dao.obtenerPorVigencia(false).pipe(
            catchError((err) => {
                console.error('Error al obtener templates no vigentes', err);
                this.error.set(err.error ?? 'Error al obtener templates no vigentes');
                return of([]);
            })
        );

        combineLatest([obsVigentes, obsNoVigente]).subscribe({
            next: ([resA, resB]) => {
                const sorted = [...resA, ...resB].sort((a, b) => a.id! - b.id!);
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

    obtenerPadre(id: number): Template | undefined {
        return this.listado().find((t) => t.id === id);
    }

    openModalEliminar(item: Template) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: Template) {
        this.cargando.set(true);
        this.dao.eliminar(item.id!).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el template', err);
                this.error.set(err.error ?? 'Error al eliminar el template');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: Template) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: Template) {
        this.cargando.set(true);
        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el template', err);
                this.error.set(err.error ?? 'Error al editar el template');
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

    crear(item: Template) {
        this.cargando.set(true);
        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el template', err);
                this.error.set(err.error ?? 'Error al crear el template');
            },
        });
        this.showModalCrear.set(false);
    }
}
