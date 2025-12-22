import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { RouterListener } from '@/app/services/router-listener';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    urlLogo = inject(RouterListener).urlLogo;
}
