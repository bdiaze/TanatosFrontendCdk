import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideFacebook, lucideInstagram, lucideTwitter } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { FadeIn } from '@/app/directives/fade-in';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink, NgIcon, HlmIcon, FadeIn],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
    providers: [
        provideIcons({
            lucideInstagram,
            lucideTwitter,
            lucideFacebook,
        }),
    ],
})
export class Footer {
    urlLogo = `${environment.urlImages}/images/logo-blanco.svg`;
}
