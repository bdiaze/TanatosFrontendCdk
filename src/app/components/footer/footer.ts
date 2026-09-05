import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram, lucideTwitter } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { FadeIn } from '@/app/directives/fade-in';
import { Icon } from '@components/icon/icon';
import { AuthStore } from '@/app/services/auth-store';

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
    private readonly authStore = inject(AuthStore);
    sesionIniciada = this.authStore.sesionIniciada;
}
