import { Component } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-empty-hero',
    imports: [HlmSkeletonImports],
    templateUrl: './empty-hero.html',
    styleUrl: './empty-hero.scss',
})
export class EmptyHero {}
