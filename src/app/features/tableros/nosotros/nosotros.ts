import { environment } from '@/environments/environment';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
    urlFondo1_640 = `${environment.urlImages}/images/latina-morena-posando-en-interiores/640.webp`;
    urlFondo1_960 = `${environment.urlImages}/images/latina-morena-posando-en-interiores/960.webp`;
    urlFondo1_1280 = `${environment.urlImages}/images/latina-morena-posando-en-interiores/1280.webp`;
    urlFondo1_1920 = `${environment.urlImages}/images/latina-morena-posando-en-interiores/1920.webp`;

    @ViewChild('bgVideo') video!: ElementRef<HTMLVideoElement>;

    urlVideo1_Poster = `${environment.urlImages}/videos/mujer-tomando-nota-en-planilla/poster.webp`;
    urlVideo1_WebM = `${environment.urlImages}/videos/mujer-tomando-nota-en-planilla/720p.webm`;
    urlVideo1_MP4 = `${environment.urlImages}/videos/mujer-tomando-nota-en-planilla/720p.mp4`;

    ngAfterViewInit(): void {
        const vid = this.video.nativeElement;
        vid.muted = true;
        vid.play().catch(() => {});
    }
}
