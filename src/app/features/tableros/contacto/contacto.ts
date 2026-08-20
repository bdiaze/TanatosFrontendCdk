import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormularioContacto } from '@/app/components/formulario-contacto/formulario-contacto';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMailbox } from '@ng-icons/lucide';
import { HlmH3 } from '@spartan-ng/helm/typography';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { FadeIn } from '@/app/directives/fade-in';

@Component({
    selector: 'app-contacto',
    imports: [FormularioContacto, HlmIcon, NgIcon, HlmH3, FadeIn],
    templateUrl: './contacto.html',
    providers: [
        provideIcons({
            lucideMailbox,
        }),
    ],
})
export class Contacto implements OnInit, OnDestroy {
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }
}
