import { redireccionarALogin } from '@/app/features/auth/login/login';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-liston-beta',
    imports: [HlmP],
    templateUrl: './liston-beta.html',
    providers: [provideIcons({})],
})
export class ListonBeta {
    async unirseBeta() {
        await redireccionarALogin('signup');
    }
}
