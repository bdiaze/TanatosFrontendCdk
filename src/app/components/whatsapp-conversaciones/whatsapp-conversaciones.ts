import { WhatsappDao } from '@/app/daos/whatsapp-dao';
import { SalWhatsappConversacion } from '@/app/entities/others/sal-whatsapp-conversacion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { FormatearTelefonoPipe } from '@/app/pipes/formatear-telefono-pipe';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircleMore, lucideTag, lucideTriangleAlert } from '@ng-icons/lucide';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { interval, switchMap } from 'rxjs';

@Component({
    selector: 'app-whatsapp-conversaciones',
    imports: [
        HlmItemImports,
        HlmBadgeImports,
        FormatearTelefonoPipe,
        DatePipe,
        HlmIcon,
        NgIcon,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmAlertImports,
    ],
    templateUrl: './whatsapp-conversaciones.html',
    styleUrl: './whatsapp-conversaciones.scss',
    providers: [provideIcons({ lucideMessageCircleMore, lucideTag, lucideTriangleAlert })],
})
export class WhatsappConversaciones implements OnInit {
    @Output() selectionChanged = new EventEmitter<string>();

    tres = signal([0, 1, 2]);

    private destroyRef = inject(DestroyRef);
    whatsappDao: WhatsappDao = inject(WhatsappDao);

    conversaciones = signal([] as SalWhatsappConversacion[]);
    cargando = signal(true);
    error = signal('');

    numeroAbierto = signal('');

    formatoFechaRespuestaGratuita = "EEEE d 'a las' HH:mm";

    constructor() {
        interval(10 * 1000)
            .pipe(
                switchMap(() => this.whatsappDao.obtenerConversaciones()),
                takeUntilDestroyed(),
            )
            .subscribe({
                next: (res) => {
                    this.conversaciones.set(res);

                    const existente = res.find((x) => x.numeroTelefono == this.numeroAbierto());
                    if (!existente && res.length > 0) {
                        this.seleccionarConversacion(res[0].numeroTelefono);
                    }
                },
                error: (err) => {
                    console.error('Error al obtener conversaciones de Whatsapp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener conversaciones de Whatsapp');
                },
            });
    }

    ngOnInit(): void {
        this.obtenerConversaciones();
    }

    obtenerConversaciones() {
        this.cargando.set(true);
        this.whatsappDao
            .obtenerConversaciones()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.conversaciones.set(res);

                    const existente = res.find((x) => x.numeroTelefono == this.numeroAbierto());
                    if (!existente && res.length > 0) {
                        this.seleccionarConversacion(res[0].numeroTelefono);
                    }
                },
                error: (err) => {
                    console.error('Error al obtener conversaciones de Whatsapp', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener conversaciones de Whatsapp');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    seleccionarConversacion(numeroTelefono: string) {
        this.numeroAbierto.set(numeroTelefono);
        this.selectionChanged.emit(numeroTelefono);
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

    esMannana(strFecha: string) {
        const hoy = new Date();
        const mannana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
        const fecha = new Date(strFecha);

        return (
            fecha.getUTCFullYear() === mannana.getUTCFullYear() && fecha.getUTCMonth() === mannana.getUTCMonth() && fecha.getUTCDate() === mannana.getUTCDate()
        );
    }

    fechaFutura(strFecha: string) {
        const hoy = new Date();
        const fecha = new Date(strFecha);
        return fecha > hoy;
    }
}
