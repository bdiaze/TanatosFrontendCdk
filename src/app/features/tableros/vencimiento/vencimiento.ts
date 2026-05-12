import { DocumentoAdjuntoDao } from '@/app/daos/documento-adjunto-dao';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscritaObtenerPorIdConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-por-id-con-vencimiento';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { S3Service } from '@/app/services/s3-service';
import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, signal, untracked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideCalendarCheck, lucideDownload, lucideGem, lucidePlus, lucideTrash, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { SalFiscalizadorNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HttpEventType } from '@angular/common/http';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { EntDocumentoAdjuntoGenerarUrlBajada } from '@/app/entities/others/ent-documento-adjunto-generar-url-bajada';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { EntNormaSuscritaCompletarNorma } from '@/app/entities/others/ent-norma-suscrita-completar-norma';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { PopupFuncionalidadBloqueada } from '@/app/components/popup-funcionalidad-bloqueada/popup-funcionalidad-bloqueada';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntNormaSuscritaCompletarNormaPorCodigoAcceso } from '@/app/entities/others/ent-norma-suscrita-completar-norma-por-codigo-acceso';
import { SalDocumentoAdjuntoGenerarUrlBajada } from '@/app/entities/others/sal-documento-adjunto-generar-url-bajada';
import { SalDocumentoAdjuntoGenerarUrlSubida } from '@/app/entities/others/sal-documento-adjunto-generar-url-subida';
import { EntDocumentoAdjuntoGenerarUrlSubidaPorCodigoAcceso } from '@/app/entities/others/ent-documento-adjunto-generar-url-subida-por-codigo-acceso';
import { EntDocumentoAdjuntoGenerarUrlSubida } from '@/app/entities/others/ent-documento-adjunto-generar-url-subida';
import { EntDocumentoAdjuntoConfirmarSubidaPorCodigoAcceso } from '@/app/entities/others/ent-documento-adjunto-confirmar-subida-por-codigo-acceso';
import { EntDocumentoAdjuntoConfirmarSubida } from '@/app/entities/others/ent-documento-adjunto-confirmar-subida';
import { EntDocumentoAdjuntoGenerarUrlBajadaPorCodigoAcceso } from '@/app/entities/others/ent-documento-adjunto-generar-url-bajada-por-codigo-acceso';

@Component({
    selector: 'app-vencimiento',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        NgIcon,
        HlmIcon,
        HlmH3,
        HlmH4,
        HlmP,
        HlmSpinnerImports,
        HlmSeparatorImports,
        HlmItemImports,
        HlmButton,
        DatePipe,
        HlmAlertImports,
        HlmSkeletonImports,
        HlmBadgeImports,
        HlmTableImports,
        HlmProgressImports,
        CommonModule,
        HlmBreadCrumbImports,
        RouterLink,
        EditorTexto,
        PopupFuncionalidadBloqueada,
        RouterModule,
    ],
    templateUrl: './vencimiento.html',
    styleUrl: './vencimiento.scss',
    providers: [
        provideIcons({
            lucideCalendarCheck,
            lucideBadgeCheck,
            lucidePlus,
            lucideDownload,
            lucideTrash,
            lucideGem,
            lucideTriangleAlert,
        }),
        DatePipe,
    ],
})
export class Vencimiento implements OnInit {
    @ViewChild(PopupFuncionalidadBloqueada) popupFuncionalidadBloqueada?: any;

    private destroyRef = inject(DestroyRef);
    private route = inject(ActivatedRoute);
    // negocioStore = inject(NegocioStore);

    codigoAcceso = signal<string | null>(null);
    idNormaSuscrita = signal<number | null>(null);
    idHistorialNormaSuscrita = signal<number | null>(null);

    datePipe = inject(DatePipe);

    normaSuscritaDao = inject(NormaSuscritaDao);
    documentoAdjuntoDao = inject(DocumentoAdjuntoDao);
    s3Service = inject(S3Service);

    error = signal<string>('');

    showModalEliminar = signal(false);
    itemSeleccionado = signal<DocumentoAdjunto | null>(null);

    item = signal<SalNormaSuscritaObtenerPorIdConVencimiento | null>(null);
    fiscalizadores = computed<SalFiscalizadorNormaSuscrita[]>(() => {
        let listado = this.item()?.fiscalizadores;
        if (!listado || listado.length == 0) {
            listado = this.item()?.templateNorma?.fiscalizadores;
        }

        if (!listado) {
            listado = [];
        }

        return listado;
    });
    documentosAdjuntos = signal<DocumentoAdjunto[]>([]);
    documentosEnProgreso = signal<DocumentoEnProgreso[]>([]);

    cargandoNormaSuscritaConVencimiento = signal<boolean>(true);

    constructor() {
        effect(() => {
            const codigoAcceso = this.codigoAcceso();
            const idNormaSuscrita = this.idNormaSuscrita();
            const idHistorialNormaSuscrita = this.idHistorialNormaSuscrita();

            untracked(() => {
                if (codigoAcceso || (idNormaSuscrita && idHistorialNormaSuscrita)) {
                    this.error.set('');
                    this.showModalEliminar.set(false);
                    this.itemSeleccionado.set(null);
                    this.item.set(null);
                    this.documentosAdjuntos.set([]);
                    this.documentosEnProgreso.set([]);
                    this.obtenerNormaConVencimiento();
                }
            });
        });
    }

    private refrescarAdjuntos$ = new Subject<void>();

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.error.set('');
            this.item.set(null);

            const paramCodigoAccesoOIdNormaSuscrita = params.get('codigoAccesoOIdNormaSuscrita');
            const paramIdHistorialNormaSuscrita = params.get('idHistorialNormaSuscrita');

            if (paramCodigoAccesoOIdNormaSuscrita && !paramIdHistorialNormaSuscrita) {
                this.codigoAcceso.set(paramCodigoAccesoOIdNormaSuscrita);
                this.idNormaSuscrita.set(null);
                this.idHistorialNormaSuscrita.set(null);
            } else if (paramCodigoAccesoOIdNormaSuscrita && paramIdHistorialNormaSuscrita) {
                this.codigoAcceso.set(null);
                this.idNormaSuscrita.set(Number(paramCodigoAccesoOIdNormaSuscrita));
                this.idHistorialNormaSuscrita.set(Number(paramIdHistorialNormaSuscrita));
            } else {
                this.codigoAcceso.set(null);
                this.idNormaSuscrita.set(null);
                this.idHistorialNormaSuscrita.set(null);
            }
        });

        this.refrescarAdjuntos$
            .pipe(
                debounceTime(500),
                switchMap(() =>
                    this.codigoAcceso()
                        ? this.normaSuscritaDao.obtenerPorCodigoAccesoConVencimiento(this.codigoAcceso()!)
                        : this.normaSuscritaDao.obtenerPorIdConVencimiento(this.idNormaSuscrita()!, this.idHistorialNormaSuscrita()!),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (normaSuscritaConVencimiento) => {
                    // Al obtener el listado de documentos adjuntos, se limpian los documentos retornados desde el listado de documentos en progreso...
                    normaSuscritaConVencimiento.documentosAdjuntos?.forEach((documentoAdjunto) => {
                        this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idDocumentoAdjunto !== documentoAdjunto.id));
                    });

                    normaSuscritaConVencimiento.documentosAdjuntos =
                        normaSuscritaConVencimiento.documentosAdjuntos?.sort((a, b) => {
                            const fechaA = a.fechaSubida ? new Date(a.fechaSubida) : new Date();
                            const fechaB = b.fechaSubida ? new Date(b.fechaSubida) : new Date();
                            return fechaA.getTime() - fechaB.getTime();
                        }) ?? null;

                    this.documentosAdjuntos.set(
                        normaSuscritaConVencimiento.documentosAdjuntos?.map(
                            (x) =>
                                ({
                                    id: x.id,
                                    nombreArchivo: x.nombreArchivo,
                                    fechaSubida: x.fechaSubida,
                                    descargando: false,
                                    borrando: false,
                                }) as DocumentoAdjunto,
                        ) ?? [],
                    );
                },
                error: (err) => {
                    console.error('Error al obtener los documentos adjuntos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los documentos adjuntos');
                },
            });
    }

    expandido = signal<boolean>(false);
    mostrarBotonExpandir = signal<boolean>(true);

    @ViewChild('contenedorDescripcion') set contenedorDescripcion(el: ElementRef | undefined) {
        if (el) {
            const mostrar = el.nativeElement.scrollHeight > 240;
            this.mostrarBotonExpandir.set(mostrar);
        }
    }

    mostrarMasMenos(masMenos: boolean) {
        this.expandido.set(masMenos);
    }

    obtenerNormaConVencimiento() {
        this.cargandoNormaSuscritaConVencimiento.set(true);

        if (this.codigoAcceso()) {
            this.normaSuscritaDao
                .obtenerPorCodigoAccesoConVencimiento(this.codigoAcceso()!)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (normaSuscritaConVencimiento) => {
                        this.setearNormaSuscritaConVencimiento(normaSuscritaConVencimiento);
                    },
                    error: (err) => {
                        console.error('Error al obtener obligación por código de acceso', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al obtener obligación por código de acceso');
                    },
                })
                .add(() => {
                    this.cargandoNormaSuscritaConVencimiento.set(false);
                });
        } else {
            this.normaSuscritaDao
                .obtenerPorIdConVencimiento(this.idNormaSuscrita()!, this.idHistorialNormaSuscrita()!)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (normaSuscritaConVencimiento) => {
                        this.setearNormaSuscritaConVencimiento(normaSuscritaConVencimiento);
                    },
                    error: (err) => {
                        console.error('Error al obtener obligación', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al obtener obligación');
                    },
                })
                .add(() => {
                    this.cargandoNormaSuscritaConVencimiento.set(false);
                });
        }
    }

    setearNormaSuscritaConVencimiento(normaSuscritaConVencimiento: SalNormaSuscritaObtenerPorIdConVencimiento) {
        normaSuscritaConVencimiento.documentosAdjuntos =
            normaSuscritaConVencimiento.documentosAdjuntos?.sort((a, b) => {
                const fechaA = a.fechaSubida ? new Date(a.fechaSubida) : new Date();
                const fechaB = b.fechaSubida ? new Date(b.fechaSubida) : new Date();
                return fechaA.getTime() - fechaB.getTime();
            }) ?? null;

        this.documentosAdjuntos.set(
            normaSuscritaConVencimiento.documentosAdjuntos?.map(
                (x) =>
                    ({
                        id: x.id,
                        nombreArchivo: x.nombreArchivo,
                        fechaSubida: x.fechaSubida,
                        descargando: false,
                        borrando: false,
                    }) as DocumentoAdjunto,
            ) ?? [],
        );
        this.item.set(normaSuscritaConVencimiento);
    }

    puedeSubirArchivos = computed(() => {
        return this.item()?.tienePlanEmpresa ?? false;
    });

    draggingFile = signal<boolean>(false);
    allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    maxFileSize = 10 * 1024 * 1024;

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.draggingFile.set(true);
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.draggingFile.set(false);
    }

    onDropFile(event: DragEvent) {
        event.preventDefault();

        let files = event.dataTransfer?.files;

        if (!files || files.length === 0) {
            return;
        }

        this.subirArchivos(files);
        this.draggingFile.set(false);
    }

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

            if (this.codigoAcceso()) {
                this.documentoAdjuntoDao
                    .generarUrlSubidaPorCodigoAcceso({
                        codigoAcceso: this.codigoAcceso()!,
                        nombreArchivo: archivoSeleccionado.name,
                        mime: archivoSeleccionado.type,
                        tamanno: archivoSeleccionado.size,
                    } as EntDocumentoAdjuntoGenerarUrlSubidaPorCodigoAcceso)
                    .subscribe({
                        next: (salidaUrlSubida) => {
                            this.procesarUrlGenerada(salidaUrlSubida, idTemporal, archivoSeleccionado);
                        },
                        error: (err) => {
                            // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                            this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                            console.error('Error al generar URL de subida de documento por código de acceso', err);
                            this.error.set(getErrorMessage(err) ?? 'Error al generar URL de subida de documento por código de acceso');
                        },
                    });
            } else {
                this.documentoAdjuntoDao
                    .generarUrlSubida({
                        idHistorialNormaSuscrita: this.idHistorialNormaSuscrita()!,
                        nombreArchivo: archivoSeleccionado.name,
                        mime: archivoSeleccionado.type,
                        tamanno: archivoSeleccionado.size,
                    } as EntDocumentoAdjuntoGenerarUrlSubida)
                    .subscribe({
                        next: (salidaUrlSubida) => {
                            this.procesarUrlGenerada(salidaUrlSubida, idTemporal, archivoSeleccionado);
                        },
                        error: (err) => {
                            // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                            this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                            console.error('Error al generar URL de subida de documento', err);
                            this.error.set(getErrorMessage(err) ?? 'Error al generar URL de subida de documento');
                        },
                    });
            }
        });
    }

    procesarUrlGenerada(
        salidaUrlSubida: SalDocumentoAdjuntoGenerarUrlSubida,
        idTemporal: `${string}-${string}-${string}-${string}-${string}`,
        archivoSeleccionado: File,
    ) {
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

        this.s3Service.subirArchivo(salidaUrlSubida.preSignedUrl, salidaUrlSubida.preSignedFields, archivoSeleccionado).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    // Se actualiza el progreso de avance del documento en progreso...
                    const porcentaje = Math.round((100 * event.loaded) / (event.total ?? archivoSeleccionado.size));

                    this.documentosEnProgreso.update((docsProgreso) =>
                        docsProgreso.map((doc) => (doc.idTemporal === idTemporal ? { ...doc, progreso: porcentaje } : doc)),
                    );
                } else if (event.type === HttpEventType.Response) {
                    if (this.codigoAcceso()) {
                        this.documentoAdjuntoDao
                            .confirmarSubidaPorCodigoAcceso({
                                codigoAcceso: this.codigoAcceso()!,
                                idDocumentoAdjunto: salidaUrlSubida.idDocumentoAdjunto,
                            } as EntDocumentoAdjuntoConfirmarSubidaPorCodigoAcceso)
                            .subscribe({
                                next: () => {
                                    // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                                    this.refrescarAdjuntos$.next();
                                },
                                error: (err) => {
                                    // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                                    this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                                    console.error('Error al confirmar la subida de documento por código de acceso', err);
                                    this.error.set(getErrorMessage(err) ?? 'Error al confirmar la subida de documento por código de acceso');
                                },
                            });
                    } else {
                        this.documentoAdjuntoDao
                            .confirmarSubida({
                                idDocumentoAdjunto: salidaUrlSubida.idDocumentoAdjunto,
                            } as EntDocumentoAdjuntoConfirmarSubida)
                            .subscribe({
                                next: () => {
                                    // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                                    this.refrescarAdjuntos$.next();
                                },
                                error: (err) => {
                                    // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                                    this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                                    console.error('Error al confirmar la subida de documento', err);
                                    this.error.set(getErrorMessage(err) ?? 'Error al confirmar la subida de documento');
                                },
                            });
                    }
                }
            },
            error: (err) => {
                // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                this.documentosEnProgreso.update((docs) => docs.filter((d) => d.idTemporal !== idTemporal));

                console.error('Error en subida del documento', err);
                this.error.set(getErrorMessage(err) ?? 'Error en subida del documento');
            },
        });
    }

    descargaArchivo(idDocumento: number) {
        // Se deja documento como "descargando"...
        this.documentosAdjuntos.update((docs) => docs.map((doc) => (doc.id === idDocumento ? { ...doc, descargando: true } : doc)));

        // Se obtiene URL prefirmada para descarga...
        if (this.codigoAcceso()) {
            this.documentoAdjuntoDao
                .generarUrlBajadaPorCodigoAcceso({
                    codigoAcceso: this.codigoAcceso(),
                    idDocumentoAdjunto: idDocumento,
                } as EntDocumentoAdjuntoGenerarUrlBajadaPorCodigoAcceso)
                .subscribe({
                    next: (salida) => {
                        // Se descarga el archivo...
                        this.s3Service.bajarArchivo(salida.preSignedUrl);

                        // Se deja spinner corriendo mientras navegador procesa la descarga...
                        setTimeout(() => {
                            this.documentosAdjuntos.update((docs) => docs.map((doc) => (doc.id === idDocumento ? { ...doc, descargando: false } : doc)));
                        }, 1500);
                    },
                    error: (err) => {
                        console.error('Error al generar URL de bajada de documento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al generar URL de bajada de documento');
                    },
                });
        } else {
            this.documentoAdjuntoDao
                .generarUrlBajada({
                    idDocumentoAdjunto: idDocumento,
                } as EntDocumentoAdjuntoGenerarUrlBajada)
                .subscribe({
                    next: (salida) => {
                        // Se descarga el archivo...
                        this.s3Service.bajarArchivo(salida.preSignedUrl);

                        // Se deja spinner corriendo mientras navegador procesa la descarga...
                        setTimeout(() => {
                            this.documentosAdjuntos.update((docs) => docs.map((doc) => (doc.id === idDocumento ? { ...doc, descargando: false } : doc)));
                        }, 1500);
                    },
                    error: (err) => {
                        console.error('Error al generar URL de bajada de documento', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al generar URL de bajada de documento');
                    },
                });
        }
    }

    openModalEliminar(item: DocumentoAdjunto) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: DocumentoAdjunto) {
        // Se deja documento como "borrando"...
        this.documentosAdjuntos.update((docs) => docs.map((doc) => (doc.id === item.id ? { ...doc, borrando: true } : doc)));

        if (this.codigoAcceso()) {
            this.documentoAdjuntoDao.eliminarPorCodigoAcceso(this.codigoAcceso()!, item.id).subscribe({
                next: () => {
                    // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                    this.refrescarAdjuntos$.next();
                },
                error: (err) => {
                    console.error('Error al borrar el documento adjunto', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al borrar el documento adjunto');
                },
            });
        } else {
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
        this.closeModalEliminar();
    }

    showModalConfirmar = signal<boolean>(false);
    textoModalConfirmar = computed(() => {
        const nombre = this.item()?.nombre ?? this.item()?.templateNorma?.nombre;
        let texto = `<p class='text-center'>¿Seguro que deseas dar por completada la obligación <b>${nombre}</b>?</p>`;

        const vencimiento = this.item()?.fechaVencimiento;
        let vencimientoTexto = this.datePipe.transform(vencimiento, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm") ?? '';
        vencimientoTexto = vencimientoTexto.charAt(0).toLocaleUpperCase() + vencimientoTexto.slice(1);
        texto += `<p class='mt-2 text-left'><b>Vencimiento:</b> ${vencimientoTexto}</p>`;

        let listadoDocumentos = '';
        if (this.documentosAdjuntos().length > 0) {
            listadoDocumentos += `<br/><span class='mt-2 text-left text-sm'><ul class='list-disc ml-7'>`;
            this.documentosAdjuntos().forEach((doc) => {
                const nombreArchivo = doc.nombreArchivo;
                listadoDocumentos += `<li>${nombreArchivo}</li>`;
            });
            listadoDocumentos += `</ul></span>`;
        } else {
            listadoDocumentos += `<span class='mt-2 text-center text-destructive text-sm italic'>Sin documentos adjuntos</span>`;
        }
        texto += `<div class='mt-2 text-left'><b>Documentos Adjuntos:</b> ${listadoDocumentos}</div>`;

        return texto;
    });

    openModalConfirmar() {
        this.showModalConfirmar.set(true);
    }

    closeModalConfirmar() {
        this.showModalConfirmar.set(false);
    }

    completando = signal<boolean>(false);

    completar() {
        this.closeModalConfirmar();
        this.completando.set(true);

        if (this.codigoAcceso()) {
            this.normaSuscritaDao
                .completarNormaPorCodigoAcceso({
                    codigoAcceso: this.codigoAcceso(),
                } as EntNormaSuscritaCompletarNormaPorCodigoAcceso)
                .subscribe({
                    next: (retorno) => {
                        this.item.update((normaSuscrita) => {
                            if (normaSuscrita) {
                                normaSuscrita.fechaCompletitud = retorno.fechaCompletitud;
                            }
                            return normaSuscrita;
                        });
                    },
                    error: (err) => {
                        console.error('Error al completar la obligación por código de acceso', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al completar la obligación por código de acceso');
                    },
                })
                .add(() => {
                    this.completando.set(false);
                });
        } else {
            this.normaSuscritaDao
                .completarNorma({
                    idNormaSuscrita: this.idNormaSuscrita(),
                    idHistorialNormaSuscrita: this.idHistorialNormaSuscrita(),
                } as EntNormaSuscritaCompletarNorma)
                .subscribe({
                    next: (retorno) => {
                        this.item.update((normaSuscrita) => {
                            if (normaSuscrita) {
                                normaSuscrita.fechaCompletitud = retorno.fechaCompletitud;
                            }
                            return normaSuscrita;
                        });
                    },
                    error: (err) => {
                        console.error('Error al completar la obligación', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al completar la obligación');
                    },
                })
                .add(() => {
                    this.completando.set(false);
                });
        }
    }
}

export interface DocumentoAdjunto {
    id: number;
    nombreArchivo: string;
    fechaSubida: string | null;
    descargando: boolean;
    borrando: boolean;
}

export interface DocumentoEnProgreso {
    idTemporal: string;
    idDocumentoAdjunto: number | null;
    nombre: string;
    progreso: number;
}
