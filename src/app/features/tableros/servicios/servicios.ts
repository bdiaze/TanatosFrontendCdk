import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    imports: [HlmIcon, NgIcon, FadeIn],
    templateUrl: './servicios.html',
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
export class Servicios implements AfterViewInit, OnInit, OnDestroy {
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
