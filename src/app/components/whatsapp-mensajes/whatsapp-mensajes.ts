import { WhatsappDao } from '@/app/daos/whatsapp-dao';
import { SalWhatsappMensaje } from '@/app/entities/others/sal-whatsapp-mensaje';
import { getErrorMessage } from '@/app/helpers/error-message';
import { FormatearTelefonoPipe } from '@/app/pipes/formatear-telefono-pipe';
import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnInit, signal, untracked, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmInput } from '@spartan-ng/helm/input';
import { lucideCheck, lucideCheckCheck, lucideClock3, lucideDownload, lucideSendHorizonal, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { EMPTY, filter, interval, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { S3Service } from '@/app/services/s3-service';

@Component({
    selector: 'app-whatsapp-mensajes',
    imports: [
        HlmItemImports,
        HlmBadgeImports,
        DatePipe,
        HlmIcon,
        NgIcon,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmInputGroupImports,
        HlmIconImports,
        HlmPopoverImports,
        HlmButton,
        HlmSpinnerImports,
        ɵInternalFormsSharedModule,
        ReactiveFormsModule,
        HlmAlertImports,
    ],
    templateUrl: './whatsapp-mensajes.html',
    styleUrl: './whatsapp-mensajes.scss',
    providers: [
        provideIcons({
            lucideDownload,
            lucideSendHorizonal,
            lucideTriangleAlert,
            lucideCheck,
            lucideCheckCheck,
            lucideClock3,
        }),
    ],
})
export class WhatsappMensajes {
    numeroTelefono = input<string | null>();

    private destroyRef = inject(DestroyRef);
    whatsappDao: WhatsappDao = inject(WhatsappDao);
    s3Service: S3Service = inject(S3Service);

    mensajesObtenidos = signal([] as SalWhatsappMensaje[]);
    mensajesPendientes = signal([] as SalWhatsappMensaje[]);
    mensajes = computed(() => {
        const pendientesInvertidos = this.mensajesPendientes().reverse();
        return pendientesInvertidos.concat(this.mensajesObtenidos());
    });

    cargando = signal(true);
    error = signal('');

    random = signal([] as number[]);
    tiposDescarga = signal(['Documento', 'Imagen']);
    tiposFemeninos = signal(['Imagen']);

    constructor() {
        effect(() => {
            const numeroTelefono = this.numeroTelefono();

            untracked(() => {
                if (numeroTelefono && numeroTelefono!.length > 0) {
                    this.error.set('');
                    this.obtenerMensajes();
                }
            });
        });

        toObservable(this.numeroTelefono)
            .pipe(
                switchMap((numeroTelefono) =>
                    numeroTelefono && numeroTelefono.length > 0
                        ? interval(10 * 1000).pipe(switchMap(() => this.whatsappDao.obtenerMensajes(numeroTelefono)))
                        : EMPTY,
                ),
                takeUntilDestroyed(),
            )
            .subscribe({
                next: (res) => {
                    const idsAEliminar = new Set(res.map((e) => e.idMensaje));
                    this.mensajesObtenidos.set(res);
                    this.mensajesPendientes.update((actual) => {
                        return actual.filter((m) => !idsAEliminar.has(m.idMensaje));
                    });
                },
                error: (err) => {
                    console.error('Error al obtener mensajes de Whatsapp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener mensajes de Whatsapp');
                },
            });
    }

    generarRandomSkeleton() {
        const arreglo: number[] = Array.from({ length: this.randomEntre(3, 6) }, (_) => this.randomEntre(1, 4));
        this.random.set(arreglo);
    }

    obtenerMensajes() {
        this.generarRandomSkeleton();
        this.cargando.set(true);
        this.whatsappDao
            .obtenerMensajes(this.numeroTelefono()!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.mensajesObtenidos.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener mensajes de Whatsapp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener mensajes de Whatsapp');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    descargandoImagen = signal<Set<string>>(new Set());

    descargarImagen(whatsappMessageId: string) {
        this.descargandoImagen.update((prev) => {
            const nuevo = new Set(prev);
            nuevo.add(whatsappMessageId);
            return nuevo;
        });

        this.whatsappDao
            .obtenerMedia(whatsappMessageId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.s3Service.bajarArchivo(res.url);
                },
                error: (err) => {
                    console.error('Error al descargar media del mensaje de Whatsapp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al descargar media del mensaje de Whatsapp');
                },
            })
            .add(() => {
                this.descargandoImagen.update((prev) => {
                    const nuevo = new Set(prev);
                    nuevo.delete(whatsappMessageId);
                    return nuevo;
                });
            });
    }

    fueHoy(strFecha: string) {
        const hoy = new Date();
        const fecha = new Date(strFecha);

        return fecha.getUTCFullYear() === hoy.getUTCFullYear() && fecha.getUTCMonth() === hoy.getUTCMonth() && fecha.getUTCDate() === hoy.getUTCDate();
    }

    fueAyer(strFecha: string) {
        const hoy = new Date();
        const ayer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1);
        const fecha = new Date(strFecha);

        return fecha.getUTCFullYear() === ayer.getUTCFullYear() && fecha.getUTCMonth() === ayer.getUTCMonth() && fecha.getUTCDate() === ayer.getUTCDate();
    }

    randomEntre(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    form: FormGroup<{
        mensaje: FormControl<string>;
    }> = new FormGroup({
        mensaje: new FormControl<string>({ value: '', disabled: false }, { nonNullable: true }),
    });

    procesando = signal(false);

    enviarMensaje() {
        if (this.numeroTelefono()) {
            const mensaje = this.form.controls['mensaje'].value.trim();

            this.procesando.set(true);
            this.form.controls['mensaje'].disable();

            this.whatsappDao
                .enviar(this.numeroTelefono()!, mensaje)
                .subscribe({
                    next: (res) => {
                        this.mensajesPendientes.update((actual) => [
                            ...actual,
                            {
                                tenantId: '',
                                numeroTelefono: this.numeroTelefono()!,
                                idMensaje: res.idMensaje,
                                whatsappMessageId: '',
                                direccion: 'Salida',
                                tipo: 'Texto',
                                cuerpo: mensaje,
                                nombreTemplate: null,
                                estado: 'Enviado',
                                fechaCreacion: new Date().toISOString(),
                                rawPayload: null,
                            } as SalWhatsappMensaje,
                        ]);
                    },
                    error: (err) => {
                        console.error('Error al enviar el mensaje de Whatsapp', err);
                        this.error.set(getErrorMessage(err) ?? 'Error al enviar el mensaje de Whatsapp');
                    },
                })
                .add(() => {
                    this.procesando.set(false);
                    this.form.controls['mensaje'].enable();
                    this.form.setValue({ mensaje: '' });
                });
        }
    }
}
