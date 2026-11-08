import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandshake } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    imports: [HlmH3, HlmH4, HlmP, HlmIcon, NgIcon, HlmButtonImports, RouterLink],
    selector: 'app-presentacion-piloto',
    styleUrl: './presentacion-piloto.scss',
    templateUrl: './presentacion-piloto.html',
    providers: [
        provideIcons({
            lucideHandshake,
        }),
    ],
})
export class PresentacionPiloto implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
