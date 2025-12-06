import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [HlmButtonImports, RouterLink],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {}
