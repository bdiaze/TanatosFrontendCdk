import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { ModalMantenedorEmpleado } from '@/app/components/modal-mantenedor-empleado/modal-mantenedor-empleado';
import { CargoDao } from '@/app/daos/cargo-dao';
import { EmpleadoDao } from '@/app/daos/empleado-dao';
import { SalCargo } from '@/app/entities/others/sal-cargo';
import { SalEmpleado, SalEmpleadoDestinatario } from '@/app/entities/others/sal-empleado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { FormatearTelefonoPipe } from '@/app/pipes/formatear-telefono-pipe';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideClockAlert,
    lucideContactRound,
    lucideEllipsis,
    lucideGem,
    lucidePencil,
    lucideTrash2,
    lucideTriangleAlert,
    lucideX,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

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
        HlmBreadcrumbImports,
        HlmSeparatorImports,
        HlmBadgeImports,
        FormatearTelefonoPipe,
        HlmTooltipImports,
        RouterLink,
    ],
    templateUrl: './mantenedor-empleado.html',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideContactRound,
            lucidePencil,
            lucideTrash2,
            lucideX,
            lucideBadgeCheck,
            lucideClockAlert,
            lucideGem,
        }),
    ],
})
export class MantenedorEmpleado {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    private readonly empleadoDao: EmpleadoDao = inject(EmpleadoDao);
    private readonly cargoDao = inject(CargoDao);
    negocioStore = inject(NegocioStore);

    empleados = signal([] as SalEmpleado[]);
    empleadosMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    nombre: 'Juan Pérez',
                    nombreCargo: 'Cargo de Ejemplo',
                    destinatarios: [
                        {
                            id: -1,
                            nombreTipoReceptor: 'Correo Electrónico',
                            destino: 'correo_ejemplo@ejemplo.cl',
                            validado: true,
                        },
                        {
                            id: -2,
                            nombreTipoReceptor: 'Correo Electrónico',
                            destino: 'otro_correo_ejemplo@ejemplo.cl',
                            validado: false,
                        },
                    ] as SalEmpleadoDestinatario[],
                },
            ] as SalEmpleado[];
        }
        return this.empleados();
    });
    cargos = signal([] as SalCargo[]);
    cargosMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    nombre: 'Cargo de Ejemplo',
                },
            ] as SalCargo[];
        }
        return this.cargos();
    });

    private readonly cargandoEmpleados = signal(false);
    private readonly cargandoCargos = signal(false);
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

        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    tienePlanEmpresa = computed(() => {
        return this.negocioStore.informacionUsuario()?.tienePlanEmpresa ?? false;
    });

    obtenerEmpleados() {
        this.cargandoEmpleados.set(true);
        this.empleados.set([]);

        this.empleadoDao
            .obtenerVigentes(this.negocioStore.negocioSeleccionado()?.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res
                        .map((empleado) => ({
                            ...empleado,
                            destinatarios: empleado.destinatarios.sort((a, b) =>
                                a.nombreTipoReceptor.toLocaleLowerCase().localeCompare(b.nombreTipoReceptor.toLocaleLowerCase()),
                            ),
                        }))
                        .sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()));
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
            .pipe(takeUntilDestroyed(this.destroyRef))
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

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mi Equipo',
                    description: 'Ahora que ya estamos en Mi Equipo, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá está tu equipo de trabajo',
                    description: 'Aquí podrás administrar a los integrantes de tu equipo, además de añadir medios de notificación para ellos.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#tabla_empleados',
                    popover: {
                        title: '¿Quiénes integran mi equipo?',
                        description: 'Acá encontrarás a todos los integrantes de tu equipo.',
                    },
                },
                {
                    element: '#celda_cargo',
                    popover: {
                        title: 'Cargo del integrante',
                        description: 'Puedes ver el cargo que tiene cada integrante.',
                    },
                },
                {
                    element: '#celda_destinos',
                    popover: {
                        title: 'Destinos de notificaciones',
                        description: 'Además, puedes ver los destinos de notificaciones asociados a dicho integrante.',
                    },
                },
                {
                    element: '#correo_validado',
                    popover: {
                        title: 'Correo ya validado',
                        description:
                            'El check verde indica los destinos de notificaciones ya validados, es decir, el receptor acepto recibir las notificaciones.',
                    },
                },
                {
                    element: '#correo_invalido',
                    popover: {
                        title: 'Correo pendiente',
                        description: 'Y con un reloj gris se indican los destinos que aún están a la espera de ser validados.',
                    },
                },
                {
                    element: '#opciones',
                    popover: {
                        title: 'Actualiza al integrante',
                        description: 'Desde aquí puedes modificar la información de un integrante, cambiar su cargo, e incluso sus destinos de notificaciones.',
                    },
                },
                {
                    element: '#seccion_cargos',
                    popover: {
                        title: 'Administra tus cargos',
                        description:
                            'Por acá, todos los cargos de tu negocio con la opción de quitarlos si deseas. Al quitar un cargo, los integrantes que lo poseían quedarán sin cargo.',
                    },
                },
                {
                    element: '#nuevo_empleado',
                    popover: {
                        title: 'Nuevo integrante',
                        description: 'Desde este botón podrás añadir un nuevo integrante al equipo, ¡Vamos allá!',
                    },
                    onHighlightStarted: () => {
                        this.closeModalCrearEmpleado();
                    },
                },
                {
                    popover: {
                        title: 'Datos del nuevo integrante',
                        description: 'A continuación, podrás ingresar los datos del nuevo integrante.',
                    },
                    onHighlightStarted: () => {
                        this.openModalCrearEmpleado();
                    },
                },
                {
                    element: '#nombre_empleado',
                    popover: {
                        title: 'Nombre del integrante',
                        description: 'Comenzando por el nombre del nuevo integrante.',
                    },
                },
                {
                    element: '#cargo_empleado',
                    popover: {
                        title: 'Cargo del integrante',
                        description: 'Seguido del cargo que tiene el integrante. Si el cargo no existe, se creará.',
                    },
                },
                {
                    element: '#nuevo_destino',
                    popover: {
                        title: 'Destinos de notificaciones',
                        description: 'Y por último, puedes añadir los destinos de notificaciones con el botón azul que tiene el símbolo "+".',
                    },
                    onHighlightStarted: (element) => {
                        const parent = element?.parentElement;
                        if (parent) {
                            parent.style.setProperty('overflow', 'visible', 'important');
                        }
                    },
                    onDeselected: (element) => {
                        const parent = element?.parentElement;
                        if (parent) {
                            parent.style.removeProperty('overflow');
                        }
                    },
                },
                {
                    element: '#guardar_empleado',
                    popover: {
                        title: 'Guardar',
                        description: '¡Ah! y que no se te olvide guardar a tu nuevo integrante.',
                    },
                },
            ] as DriveStep[]),
        );

        let config: {
            pasos: DriveStep[];
            onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
            showProgress?: boolean;
            doneBtnText?: string;
            onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
        } = {
            pasos: steps,
            onFinish: () => {
                this.ayudaRunning.set(false);
                this.closeModalCrearEmpleado();
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
