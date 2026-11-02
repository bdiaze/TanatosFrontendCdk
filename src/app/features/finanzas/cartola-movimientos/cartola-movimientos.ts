import { Component, DestroyRef, inject, signal, viewChild, ChangeDetectionStrategy, effect, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideWallet } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4 } from '@spartan-ng/helm/typography';
import { CuentasFinancieras } from '../cuentas-financieras/cuentas-financieras';
import { NegocioStore } from '@/app/services/negocio-store';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DriveStep } from 'driver.js';
import { TourService } from '@/app/helpers/tour-service';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { MovimientosFinancieros } from '../movimientos-financieros/movimientos-financieros';
import { SalMovimientoFinanciero } from '@/app/entities/others/sal-movimiento-financiero';

@Component({
    selector: 'app-cartola-movimientos',
    imports: [HlmH3, HlmH4, HlmIcon, NgIcon, CuentasFinancieras, MovimientosFinancieros, HlmBreadcrumbImports, HlmButtonImports],
    templateUrl: './cartola-movimientos.html',
    styleUrl: './cartola-movimientos.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [provideIcons({ lucideWallet })],
})
export class CartolaMovimientos {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tourService = inject(TourService);
    private readonly router = inject(Router);

    negocioStore = inject(NegocioStore);

    private readonly route = inject(ActivatedRoute);
    private readonly ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    constructor() {
        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    idCuentaFinancieraSeleccionada = signal<number | null>(null);

    cuentaFinancieraCambiada(idCuentaFinanciera: number | null) {
        this.idCuentaFinancieraSeleccionada.set(idCuentaFinanciera);
    }

    readonly cuentasFinancierasComponent = viewChild.required(CuentasFinancieras);
    readonly movimientosFinancierosComponent = viewChild.required(MovimientosFinancieros);
    movimientoActualizado() {
        this.cuentasFinancierasComponent().refreshInformacionCuentas();
    }

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mis Finanzas',
                    description: 'Ahora que ya estamos en Mis Finanzas, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Acá están tus finanzas',
                    description:
                        'Aquí podrás administrar las cuentas financieras de tu negocio y sus respectivos movimientos, como ingresos por ventas o pago de proveedores.',
                },
            });
        }

        steps.push(
            ...([
                {
                    element: '#cuenta_financiera',
                    popover: {
                        title: 'Primero, tus cuentas',
                        description: 'En la parte superior te mostraremos tus cuentas financieras, con sus respectivos saldos.',
                    },
                },
                {
                    element: '#accion_cuenta',
                    popover: {
                        title: 'Modificar o eliminar',
                        description: 'Si deseas modificar o eliminar la cuenta, lo puedes hacer haciendo click acá.',
                    },
                },
                {
                    element: '#nueva_cuenta',
                    popover: {
                        title: 'Agregar una cuenta',
                        description: 'Si deseas crear una nueva cuenta, deberás hacer click acá.',
                    },
                },
                {
                    element: '#filtro_fechas',
                    popover: {
                        title: 'Filtrar movimientos',
                        description: 'Usa los siguientes filtros para buscar los movimientos que te interesan.',
                    },
                },
                {
                    element: '#movimiento',
                    popover: {
                        title: 'Los movimientos',
                        description: 'Por acá encontrarás los movimientos de la cuenta, con su fecha, descripción y monto.',
                    },
                },
                {
                    element: '#acciones_movimiento',
                    popover: {
                        title: 'Modificar o eliminar',
                        description: 'Si necesitas modificar o eliminar un movimiento, lo puedes hacer desde acá.',
                    },
                    onHighlightStarted: () => {
                        this.movimientosFinancierosComponent().toggleAdjuntosAbiertos(-2, false);
                    },
                },
                {
                    element: '#toggle_documentos',
                    popover: {
                        title: 'Mostrar documentos adjuntos',
                        description: 'Además, si necesitas ver los documentos asociados a un movimiento, puedes hacer click acá.',
                    },
                    onHighlightStarted: () => {
                        window.scrollTo({ top: 150, behavior: 'instant' });
                    },
                    onHighlighted: () => {
                        this.movimientosFinancierosComponent().toggleAdjuntosAbiertos(-2, true);
                    },
                },
                {
                    element: '#nombre_documento',
                    popover: {
                        title: 'Nombre del documento',
                        description: 'Tendrás el nombre del documento asociado al movimiento.',
                    },
                },
                {
                    element: '#ver_documento',
                    popover: {
                        title: 'Ver el documento',
                        description: 'La opción de visualizar el documento del movimiento.',
                    },
                },
                {
                    element: '#descargar_documento',
                    popover: {
                        title: 'Descarga del documento',
                        description: 'Y si necesitas descargar el documento, lo podrás hacer desde acá.',
                    },
                },
                {
                    element: '#otras_configuraciones',
                    popover: {
                        title: 'Otras configuraciones',
                        description: 'Por acá podrás gestionar otras configuraciones, como administrar tus categorías financieras.',
                    },
                },
                {
                    element: '#nuevo_movimiento',
                    popover: {
                        title: 'Nuevo movimiento',
                        description: 'Y por último, podrás crear nuevos movimientos desde este botón. ¡Vamos allá!',
                    },
                    onHighlightStarted: () => {
                        this.movimientosFinancierosComponent().closeModalCrear();
                    },
                },
                {
                    popover: {
                        title: 'Creación de un movimiento',
                        description: 'Ahora veremos los datos que debes rellenar para registrar un nuevo movimiento.',
                    },
                    onHighlightStarted: () => {
                        this.movimientosFinancierosComponent().openModalCrear();
                    },
                },
                {
                    element: '#tipo_movimiento',
                    popover: {
                        title: 'Ingreso o gasto',
                        description: 'Primero debes seleccionar si el movimiento corresponde a un ingreso o a un gasto.',
                    },
                },
                {
                    element: '#fecha_movimiento_modal',
                    popover: {
                        title: 'Fecha del movimiento',
                        description: 'Luego tendrás que definir la fecha en que se llevó a cabo el movimiento.',
                    },
                },
                {
                    element: '#monto_movimiento_modal',
                    popover: {
                        title: 'Monto del movimiento',
                        description: 'Y, por supuesto, también deberás indicar el monto asociado al movimiento.',
                    },
                },
                {
                    element: '#descripcion_movimiento_modal',
                    popover: {
                        title: 'Añade una descripción',
                        description: 'Opcionalmente, podrás añadir una descripción que te ayude a identificar el movimiento.',
                    },
                },
                {
                    element: '#categoria_movimiento_modal',
                    popover: {
                        title: 'Asociar a una categoría',
                        description: 'Opcionalmente, también podrás asociar el movimiento a una categoría. Muy útil para mantener todo organizado.',
                    },
                },
                {
                    element: '#subida_archivos_modal',
                    popover: {
                        title: 'Documentos adjuntos',
                        description:
                            'Y, opcionalmente, podrás adjuntar documentos, como facturas o comprobantes. Se aceptan archivos PDF e imagenes JPEG/PNG/WEBP, con un tamaño máximo de 10 MB.',
                    },
                },
                {
                    element: '#guardar_movimiento',
                    popover: {
                        title: '¡Guardar!',
                        description: '¡Ah! y no te olvides de guardar antes de salir.',
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
                this.movimientosFinancierosComponent().closeModalCrear();
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
