import { WhatsappDao } from '@/app/daos/whatsapp-dao';
import { SalWhatsappMensaje } from '@/app/entities/others/sal-whatsapp-mensaje';
import { getErrorMessage } from '@/app/helpers/error-message';
import { FormatearTelefonoPipe } from '@/app/pipes/formatear-telefono-pipe';
import { DatePipe } from '@angular/common';
import {
    AfterViewChecked,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmInput } from '@spartan-ng/helm/input';
import { lucideDownload, lucideSendHorizonal } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
    selector: 'app-whatsapp-mensajes',
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
        HlmInput,
        HlmInputGroupImports,
        HlmIconImports,
        HlmPopoverImports,
    ],
    templateUrl: './whatsapp-mensajes.html',
    styleUrl: './whatsapp-mensajes.scss',
    providers: [provideIcons({ lucideDownload, lucideSendHorizonal })],
})
export class WhatsappMensajes {
    numeroTelefono = input<string | null>();

    whatsappDao: WhatsappDao = inject(WhatsappDao);

    mensajes = signal([] as SalWhatsappMensaje[]);
    cargando = signal(true);
    error = signal('');

    random = signal([] as number[]);
    tiposDescarga = signal(['Documento', 'Imagen']);
    tiposFemeninos = signal(['Imagen']);

    constructor() {
        effect(() => {
            if (this.numeroTelefono() && this.numeroTelefono()!.length > 0) {
                this.obtenerMensajes();
            }
        });
    }

    generarRandomSkeleton() {
        const arreglo: number[] = Array.from({ length: this.randomEntre(3, 6) }, (_) =>
            this.randomEntre(1, 4),
        );
        this.random.set(arreglo);
    }

    obtenerMensajes() {
        this.generarRandomSkeleton();
        this.cargando.set(true);
        this.whatsappDao
            .obtenerMensajes(this.numeroTelefono()!)
            .subscribe({
                next: (res) => {
                    this.mensajes.set(res);
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

    fueHoy(strFecha: string) {
        const hoy = new Date();
        const fecha = new Date(strFecha);

        return (
            fecha.getUTCFullYear() === hoy.getUTCFullYear() &&
            fecha.getUTCMonth() === hoy.getUTCMonth() &&
            fecha.getUTCDate() === hoy.getUTCDate()
        );
    }

    fueAyer(strFecha: string) {
        const hoy = new Date();
        const ayer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1);
        const fecha = new Date(strFecha);

        return (
            fecha.getFullYear() === ayer.getFullYear() &&
            fecha.getMonth() === ayer.getMonth() &&
            fecha.getDate() === ayer.getDate()
        );
    }

    randomEntre(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
