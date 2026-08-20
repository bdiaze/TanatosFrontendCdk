import { FadeIn } from '@/app/directives/fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarClock, lucideEarth } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH4, HlmButtonImports, RouterLink, HlmIcon, NgIcon, FadeIn],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
    host: {
        class: 'inline-block h-full w-full',
    },
    providers: [
        provideIcons({
            lucideCalendarClock,
            lucideEarth,
        }),
    ],
})
export class Hero implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
