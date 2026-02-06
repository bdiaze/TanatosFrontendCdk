import { environment } from '@/environments/environment';
import { Component, inject } from '@angular/core';
import { HlmH1, HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH4],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
})
export class Hero {
    urlLogo = `${environment.urlImages}/images/logo.svg`;
}
