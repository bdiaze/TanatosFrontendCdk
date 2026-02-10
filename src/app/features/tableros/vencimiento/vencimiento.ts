import { DocumentoAdjuntoDao } from '@/app/daos/documento-adjunto-dao';
import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscritaObtenerPorIdConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-por-id-con-vencimiento';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { S3Service } from '@/app/services/s3-service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideCalendarCheck,
    lucideDownload,
    lucidePlus,
    lucideTrash,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH2, HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { SalFiscalizadorNormaSuscrita } from '@/app/entities/others/sal-norma-suscrita';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HttpEventType } from '@angular/common/http';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { EntDocumentoAdjuntoGenerarUrlBajada } from '@/app/entities/others/ent-documento-adjunto-generar-url-bajada';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { EntNormaSuscritaCompletarNorma } from '@/app/entities/others/ent-norma-suscrita-completar-norma';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
    selector: 'app-vencimiento',
    imports: [
        ModalEliminacion,
        NgIcon,
        HlmIcon,
        HlmH2,
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
        }),
    ],
})
export class Vencimiento implements OnInit {
    private route = inject(ActivatedRoute);
    negocioStore = inject(NegocioStore);

    idNormaSuscrita = signal<number | null>(null);
    idHistorialNormaSuscrita = signal<number | null>(null);

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

    completando = signal<boolean>(false);

    constructor() {
        effect(() => {
            if (this.idNormaSuscrita() && this.idHistorialNormaSuscrita()) {
                this.error.set('');
                this.showModalEliminar.set(false);
                this.itemSeleccionado.set(null);
                this.item.set(null);
                this.documentosAdjuntos.set([]);
                this.documentosEnProgreso.set([]);
                this.cargandoNormaSuscritaConVencimiento.set(true);
                this.obtenerNormaConVencimiento();
            }
        });
    }

    obtenerNormaConVencimiento() {
        this.normaSuscritaDao
            .obtenerPorIdConVencimiento(this.idNormaSuscrita()!, this.idHistorialNormaSuscrita()!)
            .subscribe({
                next: (cargandoNormaSuscritaConVencimiento) => {
                    cargandoNormaSuscritaConVencimiento.documentosAdjuntos =
                        cargandoNormaSuscritaConVencimiento.documentosAdjuntos?.sort((a, b) => {
                            const fechaA = a.fechaSubida ? new Date(a.fechaSubida) : new Date();
                            const fechaB = b.fechaSubida ? new Date(b.fechaSubida) : new Date();
                            return fechaA.getTime() - fechaB.getTime();
                        }) ?? null;

                    this.documentosAdjuntos.set(
                        cargandoNormaSuscritaConVencimiento.documentosAdjuntos?.map(
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
                    this.item.set(cargandoNormaSuscritaConVencimiento);
                },
                error: (err) => {
                    console.error('Error al obtener norma suscrita por ID con vencimiento', err);
                    this.error.set(
                        getErrorMessage(err) ??
                            'Error al obtener norma suscrita por ID con vencimiento',
                    );
                },
            })
            .add(() => {
                this.cargandoNormaSuscritaConVencimiento.set(false);
            });
    }

    private refrescarAdjuntos$ = new Subject<void>();

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.error.set('');
            this.item.set(null);

            const paramIdNormaSuscrita = params.get('idNormaSuscrita');
            const paramIdHistorialNormaSuscrita = params.get('idHistorialNormaSuscrita');
            if (paramIdNormaSuscrita && paramIdHistorialNormaSuscrita) {
                this.idNormaSuscrita.set(Number(paramIdNormaSuscrita));
                this.idHistorialNormaSuscrita.set(Number(paramIdHistorialNormaSuscrita));
            } else {
                this.idNormaSuscrita.set(null);
                this.idHistorialNormaSuscrita.set(null);
            }
        });

        this.refrescarAdjuntos$
            .pipe(
                debounceTime(500),
                switchMap(() =>
                    this.normaSuscritaDao.obtenerPorIdConVencimiento(
                        this.idNormaSuscrita()!,
                        this.idHistorialNormaSuscrita()!,
                    ),
                ),
            )
            .subscribe({
                next: (cargandoNormaSuscritaConVencimiento) => {
                    // Al obtener el listado de documentos adjuntos, se limpian los documentos retornados desde el listado de documentos en progreso...
                    cargandoNormaSuscritaConVencimiento.documentosAdjuntos?.forEach(
                        (documentoAdjunto) => {
                            this.documentosEnProgreso.update((docs) =>
                                docs.filter((d) => d.idDocumentoAdjunto !== documentoAdjunto.id),
                            );
                        },
                    );

                    cargandoNormaSuscritaConVencimiento.documentosAdjuntos =
                        cargandoNormaSuscritaConVencimiento.documentosAdjuntos?.sort((a, b) => {
                            const fechaA = a.fechaSubida ? new Date(a.fechaSubida) : new Date();
                            const fechaB = b.fechaSubida ? new Date(b.fechaSubida) : new Date();
                            return fechaA.getTime() - fechaB.getTime();
                        }) ?? null;

                    this.documentosAdjuntos.set(
                        cargandoNormaSuscritaConVencimiento.documentosAdjuntos?.map(
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
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener los documentos adjuntos',
                    );
                },
            });
    }

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

        if (
            archivosSeleccionados.some((archivo) => !this.allowedFileTypes.includes(archivo.type))
        ) {
            archivosSeleccionados
                .filter((archivo) => !this.allowedFileTypes.includes(archivo.type))
                .forEach((archivo) => {
                    errores += `- El archivo "${archivo.name}" no es de un tipo aceptado, es del tipo ${archivo.type}. \n`;
                });
        }

        if (errores.length > 0) {
            this.error.set(errores);
        }

        archivosSeleccionados = archivosSeleccionados.filter(
            (archivo) =>
                this.allowedFileTypes.includes(archivo.type) && archivo.size <= this.maxFileSize,
        );

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

            this.documentoAdjuntoDao
                .generarUrlSubida({
                    idHistorialNormaSuscrita: this.idHistorialNormaSuscrita()!,
                    nombreArchivo: archivoSeleccionado.name,
                    mime: archivoSeleccionado.type,
                    tamanno: archivoSeleccionado.size,
                })
                .subscribe({
                    next: (salidaUrlSubida) => {
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

                        this.s3Service
                            .subirArchivo(
                                salidaUrlSubida.preSignedUrl,
                                salidaUrlSubida.preSignedFields,
                                archivoSeleccionado,
                            )
                            .subscribe({
                                next: (event) => {
                                    if (event.type === HttpEventType.UploadProgress) {
                                        // Se actualiza el progreso de avance del documento en progreso...
                                        const porcentaje = Math.round(
                                            (100 * event.loaded) /
                                                (event.total ?? archivoSeleccionado.size),
                                        );

                                        this.documentosEnProgreso.update((docsProgreso) =>
                                            docsProgreso.map((doc) =>
                                                doc.idTemporal === idTemporal
                                                    ? { ...doc, progreso: porcentaje }
                                                    : doc,
                                            ),
                                        );
                                    } else if (event.type === HttpEventType.Response) {
                                        this.documentoAdjuntoDao
                                            .confirmarSubida({
                                                idDocumentoAdjunto:
                                                    salidaUrlSubida.idDocumentoAdjunto,
                                            })
                                            .subscribe({
                                                next: () => {
                                                    // Se obtiene la información nuevamente para actualizar lista de archivos adjuntos...
                                                    this.refrescarAdjuntos$.next();
                                                },
                                                error: (err) => {
                                                    // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                                                    this.documentosEnProgreso.update((docs) =>
                                                        docs.filter(
                                                            (d) => d.idTemporal !== idTemporal,
                                                        ),
                                                    );

                                                    console.error(
                                                        'Error al confirmar la subida de documento',
                                                        err,
                                                    );
                                                    this.error.set(
                                                        getErrorMessage(err) ??
                                                            'Error al confirmar la subida de documento',
                                                    );
                                                },
                                            });
                                    }
                                },
                                error: (err) => {
                                    // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                                    this.documentosEnProgreso.update((docs) =>
                                        docs.filter((d) => d.idTemporal !== idTemporal),
                                    );

                                    console.error('Error en subida del documento', err);
                                    this.error.set(
                                        getErrorMessage(err) ?? 'Error en subida del documento',
                                    );
                                },
                            });
                    },
                    error: (err) => {
                        // Dado que no se subió el documento en progreso, se elimina del listado en progreso...
                        this.documentosEnProgreso.update((docs) =>
                            docs.filter((d) => d.idTemporal !== idTemporal),
                        );

                        console.error('Error al generar URL de subida de documento', err);
                        this.error.set(
                            getErrorMessage(err) ?? 'Error al generar URL de subida de documento',
                        );
                    },
                });
        });
    }

    descargaArchivo(idDocumento: number) {
        // Se deja documento como "descargando"...
        this.documentosAdjuntos.update((docs) =>
            docs.map((doc) => (doc.id === idDocumento ? { ...doc, descargando: true } : doc)),
        );

        // Se obtiene URL prefirmada para descarga...
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
                        this.documentosAdjuntos.update((docs) =>
                            docs.map((doc) =>
                                doc.id === idDocumento ? { ...doc, descargando: false } : doc,
                            ),
                        );
                    }, 1500);
                },
                error: (err) => {
                    console.error('Error al generar URL de bajada de documento', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al generar URL de bajada de documento',
                    );
                },
            });
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
        this.documentosAdjuntos.update((docs) =>
            docs.map((doc) => (doc.id === item.id ? { ...doc, borrando: true } : doc)),
        );

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

        this.closeModalEliminar();
    }

    completar() {
        this.completando.set(true);
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
