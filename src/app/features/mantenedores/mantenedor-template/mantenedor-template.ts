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
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { RouterLink } from '@angular/router';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-mantenedor-template',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmP,
        HlmH3,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmBadgeImports,
        RouterLink,
        HlmSkeletonImports,
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

    itemSeleccionado = signal<Template | null>(null);

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
                console.error('Error al obtener templates', err);
                this.error.set(err.error ?? 'Error al obtener templates');
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
}
