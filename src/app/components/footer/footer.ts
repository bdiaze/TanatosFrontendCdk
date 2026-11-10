import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { FadeIn } from '@/app/directives/fade-in';
import { Icon } from '@components/icon/icon';
import { AuthStore } from '@/app/services/auth-store';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink, FadeIn, Icon],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    private readonly authStore = inject(AuthStore);
    sesionIniciada = this.authStore.sesionIniciada;
}
