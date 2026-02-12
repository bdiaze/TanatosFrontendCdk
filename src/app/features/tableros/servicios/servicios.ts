import { environment } from '@/environments/environment';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBellRing,
    lucideCalendar,
    lucideClipboardCheck,
    lucideClipboardPaste,
    lucideMail,
    lucideSend,
    lucideSmartphone,
    lucideSquarePen,
    lucideStore,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-servicios',
    imports: [HlmIcon, NgIcon],
    templateUrl: './servicios.html',
    styleUrl: './servicios.scss',
    providers: [
        provideIcons({
            lucideStore,
            lucideMail,
            lucideSmartphone,
            lucideSquarePen,
            lucideClipboardPaste,
            lucideSend,
            lucideCalendar,
            lucideClipboardCheck,
            lucideBellRing,
        }),
    ],
})
export class Servicios implements AfterViewInit {
    urlFondo1_640 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe/640.webp`;
    urlFondo1_960 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe/960.webp`;
    urlFondo1_1280 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe/1280.webp`;
    urlFondo1_1920 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe/1920.webp`;

    @ViewChild('bgVideo') video!: ElementRef<HTMLVideoElement>;

    urlVideo1_Poster = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/poster.webp`;
    urlVideo1_WebM = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/720p.webm`;
    urlVideo1_MP4 = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/720p.mp4`;

    ngAfterViewInit(): void {
        const vid = this.video.nativeElement;
        vid.muted = true;
        vid.play().catch(() => {});
    }
}
