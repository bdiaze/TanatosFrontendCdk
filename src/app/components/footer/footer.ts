import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {}
