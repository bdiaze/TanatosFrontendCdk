import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserLock } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-privacidad',
    imports: [HlmH3, HlmH4, HlmP, HlmButton, HlmIcon, NgIcon],
    templateUrl: './privacidad.html',
    styleUrl: './privacidad.scss',
    providers: [
        provideIcons({
            lucideUserLock,
        }),
    ],
})
export class Privacidad {}
