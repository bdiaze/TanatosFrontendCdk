import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { getErrorMessage } from '@/app/helpers/error-message';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucideCalendarCog,
    lucideClipboardList,
    lucideClipboardPaste,
    lucideEllipsis,
    lucideFrown,
    lucideLayers,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
    selector: 'app-mantenedor-norma-suscrita',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmP,
        HlmH3,
        HlmH4,
        RouterLink,
        HlmSeparatorImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
    ],
    templateUrl: './mantenedor-norma-suscrita.html',
    styleUrl: './mantenedor-norma-suscrita.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideBadgeCheck,
            lucideBadgeX,
            lucideCalendarCog,
            lucideLayers,
            lucideFrown,
            lucideClipboardList,
            lucideClipboardPaste,
        }),
    ],
})
export class MantenedorNormaSuscrita {
    normaSuscritaDao: NormaSuscritaDao = inject(NormaSuscritaDao);
    authStore = inject(AuthStore);
    negocioStore = inject(NegocioStore);

    listado = signal([] as SalNormaSuscrita[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<SalNormaSuscrita | null>(null);

    constructor() {
        effect(() => {
            if (this.negocioStore.negocioSeleccionado()) {
                this.obtenerTodos();
            }
        });
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.normaSuscritaDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) =>
                        a.nombre && b.nombre
                            ? a.nombre
                                  .toLocaleLowerCase()
                                  .localeCompare(b.nombre.toLocaleLowerCase())
                            : a.id - b.id,
                    );
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener las normas vigentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las normas vigentes');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalNormaSuscrita) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalNormaSuscrita) {
        this.cargando.set(true);
        this.normaSuscritaDao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar la obligación', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar la obligación');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalCrear() {
        this.itemSeleccionado.set(null);
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
        this.itemSeleccionado.set(null);
    }

    openModalEditar(item: SalNormaSuscrita) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    confirmar(item: SalNormaSuscrita) {
        this.obtenerTodos();
        this.showModalCrear.set(false);
        this.showModalEditar.set(false);
    }

    truncarDescripcion(texto: string | null | undefined, max: number = 90): string {
        if (!texto) return '';

        if (texto.length <= max) {
            return texto;
        }

        const cortado = texto.slice(0, max);
        const ultimoEspacio = cortado.lastIndexOf(' ');

        if (ultimoEspacio < max - 12) {
            return cortado + '...';
        }

        return cortado.slice(0, ultimoEspacio).trim() + '...';
    }

    obtenerNormasPropias(listado: SalNormaSuscrita[]): SalNormaSuscrita[] {
        return listado.filter((x) => x.templateNorma == null);
    }

    obtenerNormasSegunTemplate(
        listado: SalNormaSuscrita[],
        nombreTemplate: string,
    ): SalNormaSuscrita[] {
        return listado.filter(
            (x) => x.templateNorma != null && x.templateNorma.nombreTemplate === nombreTemplate,
        );
    }

    obtenerTemplatesSuscritos(listado: SalNormaSuscrita[]): string[] {
        const normasConTemplate = listado.filter((x) => x.templateNorma != null);

        const templates: string[] = [
            ...new Set(normasConTemplate.map((n) => n.templateNorma?.nombreTemplate!)),
        ];
        const retorno: string[] = templates.sort((a, b) =>
            a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()),
        );

        return retorno;
    }
}
