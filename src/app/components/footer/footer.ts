import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideFacebook, lucideInstagram, lucideTwitter } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { FadeIn } from '@/app/directives/fade-in';
import { Icon } from '@components/icon/icon';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink, NgIcon, HlmIcon, FadeIn, Icon],
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
    urlLogoTikTok = `${environment.urlImages}/images/redes-sociales/logo-tiktok.svg`;
    urlLogoLinkedIn = `${environment.urlImages}/images/redes-sociales/logo-linkedin.svg`;
    urlLogoYouTube = `${environment.urlImages}/images/redes-sociales/logo-youtube.svg`;
}
