import { computed, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RouterListener {
    variacion = signal<string | null>(null);
    urlLogo = computed<string>(() => {
        switch (this.variacion()) {
            case '1':
                return '/images/logo1.svg';
            case '2':
                return '/images/logo2.svg';
            case '3':
                return '/images/logo3.svg';
            case '4':
                return '/images/logo4.svg';
            default:
                return '/images/logo.svg';
        }
    });

    constructor(router: Router) {
        router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
            const parsedUrl = router.parseUrl(router.url);

            const variacion = parsedUrl.queryParams['variacion'];

            this.variacion.set(variacion ?? null);
        });
    }
}
