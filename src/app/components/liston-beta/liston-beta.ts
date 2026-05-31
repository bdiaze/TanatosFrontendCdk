import { redireccionarALogin } from '@/app/features/auth/login/login';
import { AuthStore } from '@/app/services/auth-store';
import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePartyPopper, lucideThumbsUp } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-liston-beta',
    imports: [HlmP, NgClass],
    templateUrl: './liston-beta.html',
    providers: [provideIcons({})],
})
export class ListonBeta {
    private readonly authStore = inject(AuthStore);
    sesionIniciada = computed(() => {
        return this.authStore.sesionIniciada() || this.authStore.logoutRunning() || this.authStore.callbackRunning();
    });

    async unirseBeta() {
        await redireccionarALogin(true);
    }
}
