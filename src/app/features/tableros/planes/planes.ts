import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { environment } from '@/environments/environment';
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarHeart, lucideDot, lucideGem, lucideRocket, lucideStar, lucideStore } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-planes',
    imports: [HlmItemImports, HlmH3, HlmH4, HlmP, HlmIcon, NgIcon, HlmButtonImports, DecimalPipe, FadeIn],
    templateUrl: './planes.html',
    styleUrl: './planes.scss',
    providers: [
        provideIcons({
            lucideGem,
            lucideDot,
            lucideStar,
            lucideCalendarHeart,
            lucideRocket,
        }),
    ],
})
export class Planes implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    urlFondo1_640 = `${environment.urlImages}/images/hombre-con-delantal-ofreciendo-comida-para-llevar-empaquetada-clienta/640.webp`;
    urlFondo1_960 = `${environment.urlImages}/images/hombre-con-delantal-ofreciendo-comida-para-llevar-empaquetada-clienta/960.webp`;
    urlFondo1_1280 = `${environment.urlImages}/images/hombre-con-delantal-ofreciendo-comida-para-llevar-empaquetada-clienta/1280.webp`;
    urlFondo1_1920 = `${environment.urlImages}/images/hombre-con-delantal-ofreciendo-comida-para-llevar-empaquetada-clienta/1920.webp`;

    readonly valorMensualPlanEmpresa = signal<number>(9990);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
