import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideScale, lucideUserLock } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-aviso-legal',
    imports: [HlmH3, HlmP, HlmButton, HlmIcon, NgIcon],
    templateUrl: './aviso-legal.html',
    styleUrl: './aviso-legal.scss',
    providers: [
        provideIcons({
            lucideScale,
        }),
    ],
})
export class AvisoLegal implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
