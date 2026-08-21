import { RedirectToLogin } from '@/app/services/redirect-to-login';
import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-liston-beta',
    imports: [HlmP],
    templateUrl: './liston-beta.html',
    providers: [provideIcons({})],
})
export class ListonBeta {
    private readonly redirectToLogin = inject(RedirectToLogin);

    async unirseBeta() {
        await this.redirectToLogin.redireccionarALogin('signup');
    }
}
