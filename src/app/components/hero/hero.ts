import { RouterListener } from '@/app/services/router-listener';
import { Component, inject } from '@angular/core';
import { HlmH1, HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH1, HlmH4],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
})
export class Hero {
    urlLogo = inject(RouterListener).urlLogo;
}
