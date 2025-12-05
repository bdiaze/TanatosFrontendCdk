import { Component } from '@angular/core';
import { HlmH1, HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH1, HlmH4],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
})
export class Hero {}
