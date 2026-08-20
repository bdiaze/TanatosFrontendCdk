import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    imports: [HlmIcon, NgIcon, FadeIn],
    templateUrl: './nosotros.html',
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
export class Nosotros implements OnInit, OnDestroy, AfterViewInit {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    @ViewChild('bgVideo') video!: ElementRef<HTMLVideoElement>;

    ngAfterViewInit(): void {
        const vid = this.video.nativeElement;
        vid.muted = true;
        vid.play().catch(() => {});
    }

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
