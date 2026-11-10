import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { environment } from '@/environments/environment';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCalendarRange,
    lucideChartNoAxesCombined,
    lucideClipboardPaste,
    lucideFileCheck,
    lucideHandshake,
    lucideUserRoundArrowLeft,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    imports: [HlmH3, HlmH4, HlmP, HlmIcon, NgIcon, HlmButtonImports, FadeIn],
    selector: 'app-presentacion-piloto',
    styleUrl: './presentacion-piloto.scss',
    templateUrl: './presentacion-piloto.html',
    providers: [
        provideIcons({
            lucideHandshake,
            lucideCalendarRange,
            lucideChartNoAxesCombined,
            lucideFileCheck,
            lucideUserRoundArrowLeft,
            lucideClipboardPaste,
        }),
    ],
})
export class PresentacionPiloto implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    readonly formularioInscripcionUrl = environment.piloto.formInscripcion;

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
