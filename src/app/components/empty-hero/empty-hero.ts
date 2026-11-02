import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-empty-hero',
    imports: [HlmSkeletonImports],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './empty-hero.html',
})
export class EmptyHero {}
