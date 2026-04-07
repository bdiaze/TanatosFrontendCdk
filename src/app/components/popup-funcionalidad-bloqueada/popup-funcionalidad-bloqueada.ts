import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-popup-funcionalidad-bloqueada',
    imports: [HlmPopoverImports, RouterModule, HlmButtonImports, NgIcon, HlmIcon, HlmH4, HlmP],
    templateUrl: './popup-funcionalidad-bloqueada.html',
    styleUrl: './popup-funcionalidad-bloqueada.scss',
    providers: [
        provideIcons({
            lucideArrowRight,
            lucideArrowLeft,
        }),
    ],
    host: {
        class: 'inline-block',
    },
})
export class PopupFuncionalidadBloqueada {}
