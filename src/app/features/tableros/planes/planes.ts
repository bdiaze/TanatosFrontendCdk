import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarHeart, lucideDot, lucideGem, lucideRocket, lucideStar, lucideStore } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-planes',
    imports: [HlmItemImports, HlmH3, HlmH4, HlmP, HlmIcon, NgIcon, HlmButtonImports, DecimalPipe, FadeIn, RouterLink],
    templateUrl: './planes.html',
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

    readonly valorMensualPlanEmpresa = signal<number>(9990);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
