import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-redirect-to-home',
    imports: [],
    templateUrl: './redirect-to-home.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './redirect-to-home.scss',
})
export class RedirectToHome {
    private readonly router = inject(Router);

    constructor() {
        this.router.navigateByUrl('/', {
            replaceUrl: true,
        });
    }
}
