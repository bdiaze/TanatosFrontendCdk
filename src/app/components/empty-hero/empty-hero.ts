import { Component } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-empty-hero',
    imports: [HlmSkeletonImports],
    templateUrl: './empty-hero.html',
})
export class EmptyHero {}
