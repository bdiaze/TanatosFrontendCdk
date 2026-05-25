import { redireccionarALogin } from '@/app/features/auth/login/login';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePartyPopper, lucideThumbsUp } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-liston-beta',
    imports: [HlmP, NgIcon, HlmIcon],
    templateUrl: './liston-beta.html',
    styleUrl: './liston-beta.scss',
    providers: [provideIcons({})],
})
export class ListonBeta {
    async unirseBeta() {
        await redireccionarALogin(true);
    }
}
