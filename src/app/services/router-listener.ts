import { environment } from '@/environments/environment';
import { computed, effect, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RouterListener {
    logo = signal<string | null>(null);
    fondo = signal<string | null>(null);

    urlLogo = computed<string>(() => {
        switch (this.logo()) {
            case '1':
                return `${environment.urlImages}/images/logo1.svg`;
            case '2':
                return `${environment.urlImages}/images/logo2.svg`;
            case '3':
                return `${environment.urlImages}/images/logo3.svg`;
            case '4':
                return `${environment.urlImages}/images/logo4.svg`;
            default:
                return `${environment.urlImages}/images/logo.svg`;
            // return `${environment.urlImages}/images/logo.svg`;
        }
    });

    constructor(router: Router) {
        router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
            const parsedUrl = router.parseUrl(router.url);

            const logo = parsedUrl.queryParams['logo'];
            const fondo = parsedUrl.queryParams['fondo'];

            this.logo.set(logo ?? null);
            this.fondo.set(fondo ?? null);
        });

        effect(() => {
            switch (this.fondo()) {
                case '1':
                    document.documentElement.style.setProperty(
                        '--background',
                        'oklch(48.25% 0.154 254.11)'
                    );
                    document.documentElement.style.setProperty('--primary', 'oklch(1 0 0)');
                    document.documentElement.style.setProperty('--foreground', 'oklch(0.940 0 0)');
                    document.documentElement.style.setProperty(
                        '--primary-foreground',
                        'oklch(43.25% 0.154 254.11)'
                    );
                    break;
                case '2':
                    document.documentElement.style.setProperty(
                        '--background',
                        'oklch(65.35% 0.114 211.61)'
                    );
                    document.documentElement.style.setProperty('--primary', 'oklch(1 0 0)');
                    document.documentElement.style.setProperty('--foreground', 'oklch(0.940 0 0)');
                    document.documentElement.style.setProperty(
                        '--primary-foreground',
                        'oklch(60.35% 0.114 211.61)'
                    );
                    break;
                case '3':
                    document.documentElement.style.setProperty(
                        '--background',
                        'oklch(51.07% 0.158 273.14)'
                    );
                    document.documentElement.style.setProperty('--primary', 'oklch(1 0 0)');
                    document.documentElement.style.setProperty('--foreground', 'oklch(0.940 0 0)');
                    document.documentElement.style.setProperty(
                        '--primary-foreground',
                        'oklch(46.07% 0.158 273.14)'
                    );
                    break;
                default:
                    document.documentElement.style.setProperty('--background', 'oklch(1 0 0)');
                    document.documentElement.style.setProperty('--primary', 'oklch(0.205 0 0)');
                    document.documentElement.style.setProperty('--foreground', 'oklch(0.145 0 0)');
                    document.documentElement.style.setProperty(
                        '--primary-foreground',
                        'oklch(0.985 0 0)'
                    );
                    break;
            }
        });
    }
}
