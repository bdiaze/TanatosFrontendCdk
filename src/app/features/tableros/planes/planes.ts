import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDot, lucideGem, lucideStar, lucideStore } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-planes',
    imports: [HlmItemImports, HlmH3, HlmH4, HlmP, HlmIcon, NgIcon, HlmButtonImports],
    templateUrl: './planes.html',
    styleUrl: './planes.scss',
    providers: [
        provideIcons({
            lucideGem,
            lucideDot,
            lucideStar,
        }),
    ],
})
export class Planes {}
