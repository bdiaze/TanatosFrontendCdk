import { PopupFuncionalidadBloqueada } from '@/app/components/popup-funcionalidad-bloqueada/popup-funcionalidad-bloqueada';
import { CategoriaFinancieraDao } from '@/app/daos/categoria-financiera-dao';
import { DocumentoAdjuntoDao } from '@/app/daos/documento-adjunto-dao';
import { MovimientoFinancieroDao } from '@/app/daos/movimiento-financiero-dao';
import { FormatoDinero } from '@/app/directives/formato-dinero';
import { EntDocumentoAdjuntoConfirmarSubida } from '@/app/entities/others/ent-documento-adjunto-confirmar-subida';
import { EntDocumentoAdjuntoGenerarUrlSubida } from '@/app/entities/others/ent-documento-adjunto-generar-url-subida';
import { EntMovimientoFinancieroActualizar } from '@/app/entities/others/ent-movimiento-financiero-actualizar';
import { EntMovimientoFinancieroCrear } from '@/app/entities/others/ent-movimiento-financiero-crear';
import { SalCategoriaFinanciera } from '@/app/entities/others/sal-categoria-financiera';
import { SalDocumentoAdjunto } from '@/app/entities/others/sal-documento-adjunto';
import { SalDocumentoAdjuntoGenerarUrlSubida } from '@/app/entities/others/sal-documento-adjunto-generar-url-subida';
import { SalMovimientoFinanciero } from '@/app/entities/others/sal-movimiento-financiero';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { S3Service } from '@/app/services/s3-service';
import { NgClass } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    untracked,
    viewChild,
    ViewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideFile, lucideFileUp, lucideGem, lucideMinus, lucidePlus, lucideTrash2, lucideWallet } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmP } from '@spartan-ng/helm/typography';
import { catchError, debounceTime, defer, EMPTY, filter, map, mergeMap, Observable, of, shareReplay, Subject, switchMap, tap, throwError } from 'rxjs';

@Component({
    selector: 'app-modal-nuevo-movimiento',
    imports: [
        ReactiveFormsModule,
        HlmCardImports,
        HlmIcon,
        NgIcon,
        PopupFuncionalidadBloqueada,
        FormatoDinero,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmSkeletonImports,
        HlmSpinnerImports,
        HlmAlertImports,
        HlmButtonImports,
        HlmDatePickerImports,
        HlmSelectImports,
        HlmProgressImports,
        NgClass,
        HlmP,
        HlmTableImports,
        HlmDropdownMenuImports,
    ],
    templateUrl: './modal-nuevo-movimiento.html',
    styleUrl: './modal-nuevo-movimiento.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        provideIcons({ lucideWallet, lucidePlus, lucideMinus, lucideChevronDown, lucideFileUp, lucideFile, lucideTrash2, lucideGem }),
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
    ],
})
export class ModalNuevoMovimiento implements OnInit, OnDestroy {
    ayudaRunning = input<boolean>(false);
    idCuentaFinanciera = input.required<number>();
    movimiento = input<SalMovimientoFinanciero | null>(null);
    notificarCambio = output<SalMovimientoFinanciero>();
    cerrar = output<void>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly movimientoFinancieroDao = inject(MovimientoFinancieroDao);
    private readonly categoriaFinancieraDao = inject(CategoriaFinancieraDao);
    private readonly documentoAdjuntoDao = inject(DocumentoAdjuntoDao);

    private readonly s3Service = inject(S3Service);

    private readonly negocioStore = inject(NegocioStore);

    error = signal('');

    form: FormGroup<{
        descripcion: FormControl<string | null>;
        monto: FormControl<string | null>;
        tipoMovimiento: FormControl<number | null>;
        fechaMovimiento: FormControl<Date | null>;
        horaMovimiento: FormControl<string | null>;
        idCategoriaFinanciera: FormControl<number | null>;
    }> = new FormGroup({
        descripcion: new FormControl<string | null>({ value: null, disabled: false }),
        monto: new FormControl<string | null>({ value: null, disabled: false }, { validators: [Validators.required, Validators.min(0)] }),
        tipoMovimiento: new FormControl<number | null>({ value: 1, disabled: false }),
        fechaMovimiento: new FormControl<Date | null>({ value: new Date(), disabled: false }, { validators: [Validators.required] }),
        horaMovimiento: new FormControl<string | null>({ value: this.extraerHora(), disabled: false }, { validators: [Validators.required] }),
        idCategoriaFinanciera: new FormControl<number | null>({ value: 0, disabled: false }),
    });

    readonly tipoMovimiento = toSignal(this.form.controls.tipoMovimiento.valueChanges, { initialValue: this.form.controls.tipoMovimiento.value });
    readonly idCategoriaFinanciera = toSignal(this.form.controls.idCategoriaFinanciera.valueChanges, {
        initialValue: this.form.controls.idCategoriaFinanciera.value,
    });

    constructor() {
        effect(() => {
            const idNegocio = this.negocioStore.negocioSeleccionado()?.id;
            untracked(() => {
                if (idNegocio) {
                    this.obtenerCategorias(idNegocio);
                }
            });
        });

        effect(() => {
            const movimiento = this.movimiento();
            untracked(() => {
                if (movimiento) {
                    const fecha = new Date(movimiento.fechaMovimiento);

                    this.form.controls.descripcion.setValue(movimiento.descripcion);
                    this.form.controls.monto.setValue(String(movimiento.monto));
                    this.form.controls.tipoMovimiento.setValue(movimiento.tipoMovimiento);
                    this.form.controls.fechaMovimiento.setValue(fecha);
                    this.form.controls.horaMovimiento.setValue(this.extraerHora(fecha));
                    this.form.controls.idCategoriaFinanciera.setValue(movimiento.idCategoriaFinanciera ?? 0);

                    if (this.idMovimientoFinanciero()) {
                        this.cargandoDocumentos.set(true);
                        this.refrescarAdjuntos$.next();
                    }
                }
            });
        });
    }

    documentosAdjuntos = signal([] as DocumentoAdjunto[]);

    private readonly archivosPendientes$ = new Subject<{ archivo: File; idTemporal: string }>();
    private readonly refrescarAdjuntos$ = new Subject<void>();

    cargandoDocumentos = signal(false);

    puedeSubirArchivos = computed(() => {
        return this.negocioStore.resumenSuscripcionUsuario()?.tienePlanEmpresa ?? false;
    });

    ngOnInit(): void {
        document.body.classList.add('overflow-hidden!', 'md:pr-1.25');

        this.archivosPendientes$
            .pipe(
                mergeMap(({ archivo, idTemporal }) =>
                    this.obtenerIdMovimiento$().pipe(
                        switchMap((idMovimiento) =>
                            this.documentoAdjuntoDao.generarUrlSubida({
                                nombreArchivo: archivo.name,
                                mime: archivo.type,
                                tamanno: archivo.size,
                                idMovimientoFinanciero: idMovimiento,
                            } as EntDocumentoAdjuntoGenerarUrlSubida),
                        ),
                        switchMap((salidaUrlSubida) => this.procesarUrlGenerada(salidaUrlSubida, idTemporal, archivo)),
                        catchError((err) => {
                            this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                            console.error(`Ocurrió un error al subir el documento ${archivo.name}`, err);
                            this.error.set(getErrorMessage(err) ?? `Ocurrió un error al subir el documento ${archivo.name}`);

                            return EMPTY;
                        }),
                    ),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.refrescarAdjuntos$
            .pipe(
                filter(() => this.idMovimientoFinanciero() !== null),
                debounceTime(500),
                switchMap(() => {
                    return this.documentoAdjuntoDao.obtenerVigentesPorMovimiento(this.idMovimientoFinanciero()!);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (documentos: SalDocumentoAdjunto[]) => {
                    documentos.forEach((doc) => {
                        this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idDocumentoAdjunto !== doc.id));
                    });

                    const sorted = documentos.sort((a, b) => {
                        const fechaA = a.fechaSubida ? new Date(a.fechaSubida) : new Date();
                        const fechaB = b.fechaSubida ? new Date(b.fechaSubida) : new Date();
                        return fechaA.getTime() - fechaB.getTime();
                    });

                    this.documentosAdjuntos.update((actuales) => {
                        const estadosActuales = new Map(actuales.map((doc) => [doc.id, doc]));
                        return sorted.map((x) => {
                            const actual = estadosActuales.get(x.id);

                            return {
                                id: x.id,
                                nombreArchivo: x.nombreArchivo,
                                mime: x.mime,
                                tamanno: x.tamanno,
                                fechaSubida: x.fechaSubida,
                                borrando: actual?.borrando ?? false,
                            } as DocumentoAdjunto;
                        });
                    });

                    this.cargandoDocumentos.set(false);
                },
                error: (err) => {
                    this.cargandoDocumentos.set(false);
                    console.error('Error al obtener los documentos adjuntos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los documentos adjuntos');
                },
            });
    }

    ngOnDestroy(): void {
        document.body.classList.remove('overflow-hidden!', 'md:pr-1.25');
    }

    categorias = signal([] as SalCategoriaFinanciera[]);
    categoriasMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return [
                {
                    id: 0,
                    nombre: 'Categoría de ejemplo',
                    tipoMovimiento: 3,
                } as SalCategoriaFinanciera,
                {
                    id: -1,
                    nombre: 'Otra categoría de ejemplo',
                    tipoMovimiento: 3,
                } as SalCategoriaFinanciera,
            ] as SalCategoriaFinanciera[];
        }

        const categorias = this.categorias();
        const tipoMovimiento = this.tipoMovimiento(); // 1: Ingreso - 2: Gasto - 3: Ambos
        return [
            {
                id: 0,
                nombre: 'Sin categoría',
                tipoMovimiento: 3,
            } as SalCategoriaFinanciera,
            ...categorias
                .filter((c) => c.tipoMovimiento == tipoMovimiento || c.tipoMovimiento == 3)
                .sort((a, b) => a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())),
        ];
    });

    categoriaItemToString = (value: number) => {
        return this.categoriasMostrar().find((c) => c.id === value)?.nombre ?? '';
    };

    cargandoCategorias = signal(false);
    obtenerCategorias(idNegocio: number) {
        this.cargandoCategorias.set(true);
        this.categoriaFinancieraDao
            .obtenerVigentes(idNegocio)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.categorias.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener las categorías financieras', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener las categorías financieras');
                },
            })
            .add(() => {
                this.cargandoCategorias.set(false);
            });
    }

    readonly inputMonto = viewChild<ElementRef<HTMLInputElement>>('inputMonto');

    seleccionarTipoMovimiento(tipoMovimiento: 1 | 2) {
        this.form.controls.tipoMovimiento.setValue(tipoMovimiento);
        this.form.controls.idCategoriaFinanciera.setValue(0);
        this.inputMonto()?.nativeElement.focus();
    }

    private readonly idMovimientoPreliminar = signal<number | null>(null);
    private readonly idMovimientoFinanciero = computed(() => {
        return this.movimiento()?.id ?? this.idMovimientoPreliminar();
    });

    private crearMovimiento$?: Observable<number>;

    private obtenerIdMovimiento$(): Observable<number> {
        const idMovimiento = this.idMovimientoFinanciero();
        if (idMovimiento) {
            return of(idMovimiento);
        }

        if (!this.crearMovimiento$) {
            this.crearMovimiento$ = defer(() => {
                let idCategoriaFinanciera = this.form.controls.idCategoriaFinanciera.value;
                if (idCategoriaFinanciera === 0) idCategoriaFinanciera = null;
                const tipoMovimiento = this.form.controls.tipoMovimiento.value;
                const monto = Number(this.form.controls.monto.value?.replace(/\D+/g, '') ?? 0);
                const descripcion = this.form.controls.descripcion.value;
                const fechaMovimiento = this.form.controls.fechaMovimiento.value;
                const horaMovimiento = this.form.controls.horaMovimiento.value;
                if (fechaMovimiento && horaMovimiento) {
                    const [h, m] = horaMovimiento.split(':').map(Number);
                    fechaMovimiento.setHours(h, m, 0, 0);
                }

                return this.movimientoFinancieroDao.crear({
                    idCuentaFinanciera: this.idCuentaFinanciera(),
                    idCategoriaFinanciera: idCategoriaFinanciera,
                    tipoMovimiento: tipoMovimiento ?? 1,
                    monto: monto,
                    fechaMovimientoUtc: fechaMovimiento ?? new Date().toISOString(),
                    descripcion: descripcion,
                    estado: 0, // Preliminar
                } as EntMovimientoFinancieroCrear);
            }).pipe(
                map((movimiento: SalMovimientoFinanciero) => movimiento.id),
                tap((id) => {
                    this.idMovimientoPreliminar.set(id);
                }),
                catchError((err) => {
                    this.crearMovimiento$ = undefined;
                    return throwError(() => err);
                }),
                shareReplay({
                    bufferSize: 1,
                    refCount: false,
                }),
            );
        }

        return this.crearMovimiento$;
    }

    draggingFile = signal<boolean>(false);
    allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    maxFileSize = 10 * 1024 * 1024;

    deshabilitarBoton = computed(() => {
        return this.confirmando() || this.eliminandoPreliminar() || this.documentosEnProgreso().length > 0 || this.documentosAdjuntos().some((d) => d.borrando);
    });

    deshabilitarSubida = computed(() => {
        return this.confirmando() || this.eliminandoPreliminar();
    });

    onDragOver(event: DragEvent) {
        event.preventDefault();
        if (this.deshabilitarSubida()) return;

        this.draggingFile.set(true);
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        if (this.deshabilitarSubida()) return;

        this.draggingFile.set(false);
    }

    onDropFile(event: DragEvent) {
        event.preventDefault();
        if (this.deshabilitarSubida()) return;

        let files = event.dataTransfer?.files;

        if (!files || files.length === 0) {
            return;
        }

        this.subirArchivos(files);
        this.draggingFile.set(false);
    }

    @ViewChild(PopupFuncionalidadBloqueada) popupFuncionalidadBloqueada?: any;
    onDropRestringido(event: DragEvent) {
        event.preventDefault();
        this.popupFuncionalidadBloqueada?.openFromParent?.();
        this.draggingFile.set(false);
    }

    archivosSeleccionados(event: Event) {
        const input = event.target as HTMLInputElement;

        const files = input.files;
        if (!files || files.length === 0) {
            return;
        }

        this.subirArchivos(files);

        input.value = '';
    }

    documentosEnProgreso = signal<DocumentoEnProgreso[]>([]);

    subirArchivos(files: FileList) {
        let archivosSeleccionados = Array.from(files);

        let errores = '';
        if (archivosSeleccionados.some((archivo) => archivo.size > this.maxFileSize)) {
            archivosSeleccionados
                .filter((archivo) => archivo.size > this.maxFileSize)
                .forEach((archivo) => {
                    errores += `- El archivo "${archivo.name}" supera el tamaño máximo, tiene un tamaño de ${new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(archivo.size / (1024 * 1024))} MB. \n`;
                });
        }

        if (archivosSeleccionados.some((archivo) => !this.allowedFileTypes.includes(archivo.type))) {
            archivosSeleccionados
                .filter((archivo) => !this.allowedFileTypes.includes(archivo.type))
                .forEach((archivo) => {
                    errores += `- El archivo "${archivo.name}" no es de un tipo aceptado, es del tipo ${archivo.type}. \n`;
                });
        }

        if (errores.length > 0) {
            this.error.set(errores);
        }

        archivosSeleccionados = archivosSeleccionados.filter((archivo) => this.allowedFileTypes.includes(archivo.type) && archivo.size <= this.maxFileSize);

        archivosSeleccionados.forEach((archivoSeleccionado) => {
            // Se crea documento en progreso...
            const idTemporal = crypto.randomUUID();
            this.documentosEnProgreso.update((docs) => [
                ...docs,
                {
                    idTemporal: idTemporal,
                    nombre: archivoSeleccionado.name,
                    progreso: 0,
                } as DocumentoEnProgreso,
            ]);

            this.archivosPendientes$.next({
                archivo: archivoSeleccionado,
                idTemporal: idTemporal,
            });
        });
    }

    procesarUrlGenerada(salidaUrlSubida: SalDocumentoAdjuntoGenerarUrlSubida, idTemporal: string, archivoSeleccionado: File): Observable<void> {
        // Se actualiza ID del documento adjunto en el documento en progreso...
        this.documentosEnProgreso.update((docsProgreso) =>
            docsProgreso.map((doc) =>
                doc.idTemporal === idTemporal
                    ? {
                          ...doc,
                          idDocumentoAdjunto: salidaUrlSubida.idDocumentoAdjunto,
                      }
                    : doc,
            ),
        );

        return this.s3Service.subirArchivo(salidaUrlSubida.preSignedUrl, salidaUrlSubida.preSignedFields, archivoSeleccionado).pipe(
            tap((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    // Se actualiza el progreso de avance del documento en progreso...
                    const porcentaje = Math.round((100 * event.loaded) / (event.total ?? archivoSeleccionado.size));

                    this.documentosEnProgreso.update((docsProgreso) =>
                        docsProgreso.map((doc) => (doc.idTemporal === idTemporal ? { ...doc, progreso: porcentaje } : doc)),
                    );
                }
            }),
            filter((event) => event.type === HttpEventType.Response),
            switchMap(() =>
                this.documentoAdjuntoDao.confirmarSubida({
                    idDocumentoAdjunto: salidaUrlSubida.idDocumentoAdjunto,
                } as EntDocumentoAdjuntoConfirmarSubida),
            ),
            tap(() => {
                // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                this.refrescarAdjuntos$.next();
            }),
            map(() => undefined),
        );
    }

    eliminar(item: DocumentoAdjunto) {
        // Se deja documento como "borrando"...
        this.documentosAdjuntos.update((docs) => docs.map((doc) => (doc.id === item.id ? { ...doc, borrando: true } : doc)));
        this.documentoAdjuntoDao.eliminar(item.id).subscribe({
            next: () => {
                // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                this.refrescarAdjuntos$.next();
            },
            error: (err) => {
                console.error('Error al borrar el documento adjunto', err);
                this.error.set(getErrorMessage(err) ?? 'Error al borrar el documento adjunto');
            },
        });
    }

    confirmando = signal(false);

    clickConfirmar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.deshabilitarBoton()) {
            return;
        }

        let idCategoriaFinanciera = this.form.controls.idCategoriaFinanciera.value;
        if (idCategoriaFinanciera === 0) idCategoriaFinanciera = null;
        const tipoMovimiento = this.form.controls.tipoMovimiento.value!;
        const monto = Number(this.form.controls.monto.value!.replace(/\D+/g, ''));
        const descripcion = this.form.controls.descripcion.value;
        const fechaMovimiento = this.form.controls.fechaMovimiento.value!;
        const [h, m] = this.form.controls.horaMovimiento.value!.split(':').map(Number);
        fechaMovimiento.setHours(h, m, 0, 0);

        this.confirmando.set(true);

        if (this.idMovimientoFinanciero()) {
            this.movimientoFinancieroDao
                .actualizar({
                    idNegocio: this.negocioStore.negocioSeleccionado()!.id,
                    idCuentaFinanciera: this.idCuentaFinanciera(),
                    idMovimientoFinanciero: this.idMovimientoFinanciero(),
                    idCategoriaFinanciera: idCategoriaFinanciera,
                    tipoMovimiento: tipoMovimiento,
                    monto: monto,
                    fechaMovimiento: fechaMovimiento.toISOString(),
                    descripcion: descripcion,
                    estado: 1 /* Confirmado */,
                } as EntMovimientoFinancieroActualizar)
                .subscribe({
                    next: (res) => {
                        this.confirmando.set(false);
                        this.notificarCambio.emit(res);
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        this.confirmando.set(false);
                        console.error('Error al actualizar el movimiento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al actualizar el movimiento');
                    },
                });
        } else {
            this.movimientoFinancieroDao
                .crear({
                    idCuentaFinanciera: this.idCuentaFinanciera(),
                    idCategoriaFinanciera: idCategoriaFinanciera,
                    tipoMovimiento: tipoMovimiento,
                    monto: monto,
                    fechaMovimientoUtc: fechaMovimiento.toISOString(),
                    descripcion: descripcion,
                    estado: 1 /* Confirmado */,
                } as EntMovimientoFinancieroCrear)
                .subscribe({
                    next: (res) => {
                        this.confirmando.set(false);
                        this.notificarCambio.emit(res);
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        this.confirmando.set(false);
                        console.error('Error al registrar el movimiento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al registrar el movimiento');
                    },
                });
        }
    }

    eliminandoPreliminar = signal(false);

    ejecutarCerrado() {
        if (this.deshabilitarBoton()) {
            return;
        }

        if (this.idMovimientoPreliminar()) {
            this.eliminandoPreliminar.set(true);
            this.movimientoFinancieroDao
                .eliminar(this.negocioStore.negocioSeleccionado()!.id, this.idCuentaFinanciera(), this.idMovimientoPreliminar()!)
                .subscribe({
                    next: () => {
                        this.cerrar.emit();
                    },
                    error: (err) => {
                        console.error('Error al eliminar el movimiento preliminar', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al eliminar el movimiento preliminar');
                    },
                })
                .add(() => {
                    this.eliminandoPreliminar.set(false);
                });
        } else {
            this.cerrar.emit();
        }
    }

    invalid(llave: string, formGroup: FormGroup | null = null) {
        let control;
        if (formGroup != null) {
            control = formGroup.get(llave);
        } else {
            control = this.form.get(llave);
        }
        return control?.invalid && control?.touched;
    }

    extraerHora(fecha: Date | null = null): string {
        fecha ??= new Date();
        const hh = String(fecha.getHours()).padStart(2, '0');
        const mm = String(fecha.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    @ViewChild('overlay', { static: true })
    overlay!: ElementRef<HTMLDivElement>;

    private pointerStartedInOverlay = false;

    @HostListener('document:pointerdown', ['$event'])
    onPointerDown(event: PointerEvent) {
        this.pointerStartedInOverlay = event.target === this.overlay.nativeElement;
    }

    @HostListener('document:pointercancel')
    onPointerCancel() {
        this.pointerStartedInOverlay = false;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: PointerEvent) {
        if (this.pointerStartedInOverlay && event.target === this.overlay.nativeElement) {
            this.ejecutarCerrado();
        }

        this.pointerStartedInOverlay = false;
    }
}

export interface DocumentoAdjunto {
    id: number;
    nombreArchivo: string;
    mime: string;
    tamanno: number;
    fechaSubida: string | null;
    borrando: boolean;
}

export interface DocumentoEnProgreso {
    idTemporal: string;
    idDocumentoAdjunto: number | null;
    nombre: string;
    progreso: number;
}
