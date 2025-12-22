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
    lucideEllipsis,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-norma-suscrita',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmP,
        RouterLink,
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
            if (this.authStore.sesionIniciada() && this.negocioStore.negocioSeleccionado()) {
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
                            : a.id - b.id
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
                console.error('Error al eliminar la norma', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar la norma');
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
}
