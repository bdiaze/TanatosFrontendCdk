import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    urlLogo = `${environment.urlImages}/images/logo.svg`;
}
