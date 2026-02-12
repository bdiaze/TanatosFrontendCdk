import { environment } from '@/environments/environment';
import { Component } from '@angular/core';
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
export class Servicios {
    urlFondo1 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe.jpg`;

    urlVideo1Poster = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/mujer-trabajando-en-tablet.webp`;
    urlVideo1WebM = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/mujer-trabajando-en-tablet_720p.webm`;
    urlVideo1MP4 = `${environment.urlImages}/videos/mujer-trabajando-en-tablet/mujer-trabajando-en-tablet_720p.mp4`;
}
