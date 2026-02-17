import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCookie } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-politica-de-cookies',
    imports: [HlmH3, HlmH4, HlmP, HlmButton, HlmIcon, NgIcon],
    templateUrl: './politica-de-cookies.html',
    styleUrl: './politica-de-cookies.scss',
    providers: [
        provideIcons({
            lucideCookie,
        }),
    ],
})
export class PoliticaDeCookies {}
