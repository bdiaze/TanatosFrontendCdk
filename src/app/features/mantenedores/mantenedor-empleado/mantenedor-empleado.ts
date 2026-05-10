import { CampoDinamico, ModalEdicion, PosiblesValores } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { ModalMantenedorEmpleado } from '@/app/components/modal-mantenedor-empleado/modal-mantenedor-empleado';
import { CargoDao } from '@/app/daos/cargo-dao';
import { EmpleadoDao } from '@/app/daos/empleado-dao';
import { EntEmpleadoActualizar } from '@/app/entities/others/ent-empleado-actualizar';
import { EntEmpleadoCrear } from '@/app/entities/others/ent-empleado-crear';
import { SalCargo } from '@/app/entities/others/sal-cargo';
import { SalEmpleado } from '@/app/entities/others/sal-empleado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideContactRound, lucideEllipsis, lucidePencil, lucideTrash2, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-empleado',
    imports: [
        ModalEliminacion,
        ModalMantenedorEmpleado,
        HlmButtonImports,
        HlmTableImports,
        HlmH3,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
        HlmSeparatorImports,
        HlmBadgeImports,
    ],
    templateUrl: './mantenedor-empleado.html',
    styleUrl: './mantenedor-empleado.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideContactRound,
            lucidePencil,
            lucideTrash2,
            lucideX,
        }),
    ],
})
export class MantenedorEmpleado {
    empleadoDao: EmpleadoDao = inject(EmpleadoDao);
    cargoDao = inject(CargoDao);
    negocioStore = inject(NegocioStore);

    empleados = signal([] as SalEmpleado[]);
    cargos = signal([] as SalCargo[]);

    cargandoEmpleados = signal(false);
    cargandoCargos = signal(false);
    cargando = computed(() => {
        return this.cargandoEmpleados() || this.cargandoCargos();
    });
    error = signal('');

    showModalEliminarEmpleado = signal(false);
    showModalEditarEmpleado = signal(false);
    showModalCrearEmpleado = signal(false);
    showModalEliminarCargo = signal(false);

    empleadoSeleccionado = signal<SalEmpleado | null>(null);
    cargoSeleccionado = signal<SalCargo | null>(null);

    constructor() {
        effect(() => {
            const negocioSeleccionado = this.negocioStore.negocioSeleccionado();

            untracked(() => {
                if (negocioSeleccionado) {
                    this.obtenerEmpleados();
                    this.obtenerCargos();
                }
            });
        });
    }

    obtenerEmpleados() {
        this.cargandoEmpleados.set(true);
        this.empleados.set([]);

        this.empleadoDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));
                    this.empleados.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los empleados', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los empleados');
                },
            })
            .add(() => {
                this.cargandoEmpleados.set(false);
            });
    }

    obtenerCargos() {
        this.cargandoCargos.set(true);
        this.cargos.set([]);

        this.cargoDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));
                    this.cargos.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los cargos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los cargos');
                },
            })
            .add(() => {
                this.cargandoCargos.set(false);
            });
    }

    openModalEliminarEmpleado(item: SalEmpleado) {
        this.empleadoSeleccionado.set(item);
        this.showModalEliminarEmpleado.set(true);
    }

    closeModalEliminarEmpleado() {
        this.showModalEliminarEmpleado.set(false);
        this.empleadoSeleccionado.set(null);
    }

    eliminarEmpleado(item: SalEmpleado) {
        this.cargandoEmpleados.set(true);
        this.empleadoDao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerEmpleados();
            },
            error: (err) => {
                this.cargandoEmpleados.set(false);
                console.error('Error al borrar al empleado', err);
                this.error.set(getErrorMessage(err) ?? 'Error al borrar al empleado');
            },
        });
        this.showModalEliminarEmpleado.set(false);
    }

    openModalEditarEmpleado(item: SalEmpleado) {
        this.empleadoSeleccionado.set(item);
        this.showModalEditarEmpleado.set(true);
    }

    closeModalEditarEmpleado() {
        this.showModalEditarEmpleado.set(false);
        this.empleadoSeleccionado.set(null);
    }

    openModalCrearEmpleado() {
        this.empleadoSeleccionado.set(null);
        this.showModalCrearEmpleado.set(true);
    }

    closeModalCrearEmpleado() {
        this.showModalCrearEmpleado.set(false);
        this.empleadoSeleccionado.set(null);
    }

    postGuardar() {
        this.obtenerEmpleados();
        this.obtenerCargos();
    }

    openModalEliminarCargo(item: SalCargo) {
        this.cargoSeleccionado.set(item);
        this.showModalEliminarCargo.set(true);
    }

    closeModalEliminarCargo() {
        this.showModalEliminarCargo.set(false);
        this.cargoSeleccionado.set(null);
    }

    eliminarCargo(item: SalEmpleado) {
        this.cargandoCargos.set(true);
        this.cargandoEmpleados.set(true);
        this.cargoDao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerCargos();
                this.obtenerEmpleados();
            },
            error: (err) => {
                this.cargandoCargos.set(false);
                this.cargandoEmpleados.set(false);
                console.error('Error al borrar el cargo', err);
                this.error.set(getErrorMessage(err) ?? 'Error al borrar el cargo');
            },
        });
        this.showModalEliminarCargo.set(false);
    }
}
