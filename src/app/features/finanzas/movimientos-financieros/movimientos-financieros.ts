import { ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { CategoriaFinancieraDao } from '@/app/daos/categoria-financiera-dao';
import { MovimientoFinancieroDao } from '@/app/daos/movimiento-financiero-dao';
import { SalMovimientoFinanciero } from '@/app/entities/others/sal-movimiento-financiero';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal, untracked, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideDownload,
    lucideEllipsis,
    lucideFile,
    lucideMinus,
    lucidePaperclip,
    lucidePlus,
    lucideSearch,
    lucideSettings,
    lucideSquareChevronDown,
    lucideTags,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmP } from '@spartan-ng/helm/typography';
import { ModalNuevoMovimiento } from '../modal-nuevo-movimiento/modal-nuevo-movimiento';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { RouterLink } from '@angular/router';
import { DocumentoAdjuntoDao } from '@/app/daos/documento-adjunto-dao';
import { EntDocumentoAdjuntoGenerarUrlBajada } from '@/app/entities/others/ent-documento-adjunto-generar-url-bajada';
import { S3Service } from '@/app/services/s3-service';
import { SalDocumentoAdjunto } from '@/app/entities/others/sal-documento-adjunto';
import { HistoryService } from '@/app/services/history-service';
import { ModalVisualizadorDocumento } from '@/app/components/modal-visualizador-documento/modal-visualizador-documento';

@Component({
    selector: 'app-movimientos-financieros',
    imports: [
        ModalEliminacion,
        ModalVisualizadorDocumento,
        RouterLink,
        HlmIcon,
        NgIcon,
        HlmSkeletonImports,
        HlmAlertImports,
        NgClass,
        DecimalPipe,
        HlmP,
        HlmButtonImports,
        HlmDropdownMenuImports,
        DatePipe,
        HlmTableImports,
        HlmSpinnerImports,
        HlmScrollAreaImports,
        HlmDatePickerImports,
        ModalNuevoMovimiento,
        HlmTooltipImports,
    ],
    templateUrl: './movimientos-financieros.html',
    styleUrl: './movimientos-financieros.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        provideIcons({
            lucidePlus,
            lucideMinus,
            lucideSquareChevronDown,
            lucideTriangleAlert,
            lucideEllipsis,
            lucideTags,
            lucideSettings,
            lucidePaperclip,
            lucideFile,
            lucideSearch,
            lucideDownload,
        }),
        provideHlmDatePickerConfig({
            autoCloseOnSelect: true,
            formatDate: (date: Date) => {
                return new Intl.DateTimeFormat('es-CL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            },
        }),
        DatePipe,
        DecimalPipe,
    ],
})
export class MovimientosFinancieros implements OnInit {
    ayudaRunning = input<boolean>(false);
    idCuentaFinanciera = input.required<number>();
    notificarCambio = output<SalMovimientoFinanciero | null>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly movimientoFinancieroDao = inject(MovimientoFinancieroDao);
    private readonly documentoAdjuntoDao = inject(DocumentoAdjuntoDao);
    private readonly s3Service = inject(S3Service);
    private readonly historyService = inject(HistoryService);

    negocioStore = inject(NegocioStore);
    private readonly datePipe = inject(DatePipe);
    private readonly decimalPipe = inject(DecimalPipe);

    private readonly movimientos = signal([] as SalMovimientoFinanciero[]);
    movimientosMostrar = computed(() => {
        if (this.ayudaRunning()) {
            const fechaActual = new Date();
            const fechaAnterior = new Date(fechaActual);
            fechaAnterior.setDate(fechaAnterior.getDate() - 1);

            return [
                {
                    id: -1,
                    nombreCategoriaFinanciera: 'Ventas',
                    tipoMovimiento: 1,
                    monto: 100_000,
                    saldo: 430_000,
                    fechaMovimiento: fechaActual.toISOString(),
                    descripcion: 'Venta de mercadería',
                    documentoAdjuntos: [] as SalDocumentoAdjunto[],
                },
                {
                    id: -2,
                    nombreCategoriaFinanciera: 'Proveedor',
                    tipoMovimiento: 2,
                    monto: 70_000,
                    saldo: 330_000,
                    fechaMovimiento: fechaAnterior.toISOString(),
                    descripcion: 'Pago de proveedor de matería prima',
                    documentoAdjuntos: [
                        {
                            id: -1,
                            nombreArchivo: 'Factura de proveedor de ejemplo.pdf',
                        },
                    ] as SalDocumentoAdjunto[],
                },
            ] as SalMovimientoFinanciero[];
        }
        return this.movimientos();
    });

    idMovimientosAdjuntosAbiertos = signal<Set<number>>(new Set());
    toggleAdjuntosAbiertos(idMovimiento: number, abierto: boolean | null = null) {
        this.idMovimientosAdjuntosAbiertos.update((ids) => {
            const estadoDeseado = abierto !== null ? abierto : !ids.has(idMovimiento);
            if (!estadoDeseado) {
                const nuevos = new Set(ids);
                nuevos.delete(idMovimiento);
                return nuevos;
            } else {
                return new Set(ids).add(idMovimiento);
            }
        });
    }

    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<SalMovimientoFinanciero | null>(null);

    fechaDesde = signal<Date | null>(null);
    fechaHasta = signal<Date | null>(null);

    constructor() {
        effect(() => {
            const idCuentaFinanciera = this.idCuentaFinanciera();
            const fechaDesde = this.fechaDesde();
            const fechaHasta = this.fechaHasta();

            untracked(() => {
                const negocioSeleccionado = this.negocioStore.negocioSeleccionado();
                if (negocioSeleccionado && idCuentaFinanciera && fechaDesde && fechaHasta) {
                    this.obtenerMovimientos(negocioSeleccionado.id, idCuentaFinanciera, fechaDesde, fechaHasta);
                }
            });
        });

        this.historyService.popState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
            this.closeModalVerDocumento();
        });
    }

    ngOnInit(): void {
        const hoy = new Date();
        const haceUnMes = this.restarMes(hoy);

        this.fechaHasta.set(hoy);
        this.fechaDesde.set(haceUnMes);
    }

    siguienteFecha = signal<Date | null>(null);
    siguienteId = signal<number | null>(null);

    obtenerMasMovimientos() {
        const negocioSeleccionado = this.negocioStore.negocioSeleccionado();
        const idCuentaFinanciera = this.idCuentaFinanciera();
        const fechaDesde = this.fechaDesde();
        const fechaHasta = this.fechaHasta();

        if (negocioSeleccionado && idCuentaFinanciera && fechaDesde && fechaHasta) {
            this.obtenerMovimientos(negocioSeleccionado.id, idCuentaFinanciera, fechaDesde, fechaHasta, this.siguienteFecha(), this.siguienteId());
        }
    }

    cargandoMasMovimientos = signal(false);

    obtenerMovimientos(
        idNegocio: number,
        idCuentaFinanciera: number,
        fechaDesde: Date,
        fechaHasta: Date,
        primeraFecha: Date | null = null,
        primerId: number | null = null,
    ) {
        if (primeraFecha && primerId) {
            this.cargandoMasMovimientos.set(true);
        } else {
            this.cargando.set(true);
        }

        // Se setean horas 00:00:00 y 23:59:59 a fecha "Desde" y "Hasta"...
        fechaDesde.setHours(0, 0, 0, 0);
        fechaHasta.setHours(23, 59, 59, 999);

        if (!primeraFecha && !primerId) {
            this.movimientos.set([]);
        }

        this.error.set('');

        this.movimientoFinancieroDao
            .obtenerVigentes(idNegocio, idCuentaFinanciera, fechaDesde, fechaHasta, primeraFecha, primerId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.movimientos.update((m) => [...m, ...res.items]);
                    this.siguienteFecha.set(res.siguienteFecha === null ? null : new Date(res.siguienteFecha));
                    this.siguienteId.set(res.siguienteId);
                },
                error: (err) => {
                    console.error('Error al obtener los movimientos financieros', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los movimientos financieros');
                },
            })
            .add(() => {
                this.cargando.set(false);
                this.cargandoMasMovimientos.set(false);
            });
    }

    restarMes(fecha: Date): Date {
        const resultado = new Date(fecha);
        const dia = resultado.getDate();

        resultado.setDate(1);
        resultado.setMonth(resultado.getMonth() - 1);

        const ultimoDia = new Date(resultado.getFullYear(), resultado.getMonth() + 1, 0).getDate();

        resultado.setDate(Math.min(dia, ultimoDia));

        return resultado;
    }

    descripcionModalEliminar = computed(() => {
        let texto = '¿Seguro que deseas eliminar el siguiente movimiento?';
        texto += "<div class='flex flex-col items-start w-full px-2 mt-2'>";
        texto += "<div class='flex flex-col md:flex-row justify-between w-full'>";
        texto += "<div class='flex flex-col'>";
        texto += `<p class='text-xs text-left text-wrap mt-1'>Tipo:</p>`;
        texto += `<p class='text-base text-left text-wrap font-semibold'>${this.itemSeleccionado()?.tipoMovimiento == 1 ? 'Ingreso' : 'Gasto'}</p>`;
        texto += '</div>';
        if (this.itemSeleccionado()?.nombreCategoriaFinanciera) {
            texto += "<div class='flex flex-col'>";
            texto += `<p class='text-xs text-left text-wrap mt-1'>Categoría:</p>`;
            texto += `<p class='text-base text-left text-wrap font-semibold'>${this.itemSeleccionado()?.nombreCategoriaFinanciera}</p>`;
            texto += '</div>';
        }
        texto += '</div>';
        if (this.itemSeleccionado()?.descripcion) {
            texto += `<p class='text-xs text-left text-wrap mt-1'>Descripción:</p>`;
            texto += `<p class='text-base text-left text-wrap font-semibold'>${this.itemSeleccionado()?.descripcion}</p>`;
        }
        texto += "<div class='flex flex-col md:flex-row justify-between w-full'>";
        texto += "<div class='flex flex-col'>";
        texto += `<p class='text-xs text-left text-wrap mt-1'>Fecha:</p>`;
        texto += `<p class='text-base text-left text-wrap font-semibold'>${this.datePipe.transform(this.itemSeleccionado()?.fechaMovimiento, 'dd MMMM yyyy HH:mm')}</p>`;
        texto += '</div>';
        texto += "<div class='flex flex-col'>";
        texto += `<p class='text-xs text-left text-wrap mt-1'>Monto:</p>`;
        texto += `<p class='text-base text-left text-wrap font-semibold'>$${this.decimalPipe.transform(this.itemSeleccionado()?.monto, '1.0-0')}</p>`;
        texto += '</div>';
        texto += '</div>';
        texto += '</div>';
        return texto;
    });

    openModalEliminar(item: SalMovimientoFinanciero) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalMovimientoFinanciero) {
        this.cargando.set(true);
        this.error.set('');

        this.movimientoFinancieroDao.eliminar(this.negocioStore.negocioSeleccionado()!.id, this.idCuentaFinanciera(), item.id).subscribe({
            next: () => {
                const negocioSeleccionado = this.negocioStore.negocioSeleccionado();
                const idCuentaFinanciera = this.idCuentaFinanciera();
                const fechaDesde = this.fechaDesde();
                const fechaHasta = this.fechaHasta();

                if (negocioSeleccionado && idCuentaFinanciera && fechaDesde && fechaHasta) {
                    this.obtenerMovimientos(negocioSeleccionado.id, idCuentaFinanciera, fechaDesde, fechaHasta);
                }

                this.notificarCambio.emit(item);
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el movimiento', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar el movimiento');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: SalMovimientoFinanciero) {
        this.itemSeleccionado.set(item);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    openModalCrear() {
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
    }

    movimientoActualizado(movimiento: SalMovimientoFinanciero | null) {
        const negocioSeleccionado = this.negocioStore.negocioSeleccionado();
        const idCuentaFinanciera = this.idCuentaFinanciera();
        const fechaDesde = this.fechaDesde();
        const fechaHasta = this.fechaHasta();

        if (negocioSeleccionado && idCuentaFinanciera && fechaDesde && fechaHasta) {
            this.obtenerMovimientos(negocioSeleccionado.id, idCuentaFinanciera, fechaDesde, fechaHasta);
        }

        this.notificarCambio.emit(movimiento);
    }

    urlDocumentoVisualizacion = signal<string | null>(null);
    documentoSeleccionadoVisualizacion = signal<SalDocumentoAdjunto | null>(null);
    verDocumento(url: string | null, documento: SalDocumentoAdjunto | null) {
        this.urlDocumentoVisualizacion.set(url);
        this.documentoSeleccionadoVisualizacion.set(documento);
        if (url && documento) {
            this.historyService.registrarEstado('verDocumentoOpen');
            document.body.classList.add('overflow-hidden!');
        }
    }
    closeModalVerDocumento() {
        this.verDocumento(null, null);
        this.historyService.removerEstado('verDocumentoOpen');
        document.body.classList.remove('overflow-hidden!');
    }

    idsDocumentosVisualizando = signal<Set<number>>(new Set());
    obtenerUrlVisualizacion(documento: SalDocumentoAdjunto) {
        // Se deja documento como "visualizando"...
        this.idsDocumentosVisualizando.update((ids) => {
            return new Set(ids).add(documento.id);
        });

        this.documentoAdjuntoDao
            .generarUrlBajada({
                idDocumentoAdjunto: documento.id,
                paraVisualizacion: true,
            } as EntDocumentoAdjuntoGenerarUrlBajada)
            .subscribe({
                next: (salida) => {
                    this.verDocumento(salida.preSignedUrl, documento);

                    this.idsDocumentosVisualizando.update((ids) => {
                        const nuevos = new Set(ids);
                        nuevos.delete(documento.id);
                        return nuevos;
                    });
                },
                error: (err) => {
                    console.error('Error al generar URL para visualizar documento', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al generar URL para visualizar documento');

                    this.idsDocumentosVisualizando.update((ids) => {
                        const nuevos = new Set(ids);
                        nuevos.delete(documento.id);
                        return nuevos;
                    });
                },
            });
    }

    idsDocumentosDescargando = signal<Set<number>>(new Set());
    descargaArchivo(idDocumento: number) {
        // Se deja documento como "descargando"...
        this.idsDocumentosDescargando.update((ids) => {
            return new Set(ids).add(idDocumento);
        });

        // Se obtiene URL prefirmada para descarga...
        this.documentoAdjuntoDao
            .generarUrlBajada({
                idDocumentoAdjunto: idDocumento,
                paraVisualizacion: false,
            } as EntDocumentoAdjuntoGenerarUrlBajada)
            .subscribe({
                next: (salida) => {
                    // Se descarga el archivo...
                    const timeout = this.s3Service.bajarArchivo(salida.preSignedUrl);

                    // Se deja spinner corriendo mientras navegador procesa la descarga...
                    setTimeout(() => {
                        this.idsDocumentosDescargando.update((ids) => {
                            const nuevos = new Set(ids);
                            nuevos.delete(idDocumento);
                            return nuevos;
                        });
                    }, timeout);
                },
                error: (err) => {
                    console.error('Error al generar URL de bajada de documento', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al generar URL de bajada de documento');

                    this.idsDocumentosDescargando.update((ids) => {
                        const nuevos = new Set(ids);
                        nuevos.delete(idDocumento);
                        return nuevos;
                    });
                },
            });
    }
}
