import { environment } from '@/environments/environment';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideHeartHandshake,
    lucideMapPinCheck,
    lucideMedal,
    lucidePencilRuler,
    lucideReceipt,
    lucideRoute,
    lucideSearchCheck,
    lucideStore,
    lucideUsers,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-nosotros',
    imports: [HlmIcon, NgIcon],
    templateUrl: './nosotros.html',
    styleUrl: './nosotros.scss',
    providers: [
        provideIcons({
            lucideStore,
            lucideHeartHandshake,
            lucideMapPinCheck,
            lucideRoute,
            lucideSearchCheck,
            lucideReceipt,
            lucidePencilRuler,
            lucideUsers,
            lucideMedal,
        }),
    ],
})
export class Nosotros {
    urlFondo1 = `${environment.urlImages}/images/latina-morena-posando-en-interiores.jpg`;
    urlVideo1 = `${environment.urlImages}/videos/mujer-tomando-nota-en-planilla.mp4`;
}
