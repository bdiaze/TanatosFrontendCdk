import { environment } from '@/environments/environment';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
    private readonly router = inject(Router);
    private readonly title = inject(Title);

    constructor() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            this.event('page_view', {
                page_location: window.location.href,
                page_path: event.urlAfterRedirects,
            });
        });
    }

    private loadPromise?: Promise<void>;

    load(): Promise<void> {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise((resolve, reject) => {
            if (!environment.google.analytics.id || !environment.production) {
                resolve();
                return;
            }

            if (document.getElementById('google-analytics-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-analytics-script';
            script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.google.analytics.id}`;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('No se pudo cargar Google Analytics'));

            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = (...args: unknown[]) => {
                window.dataLayer.push(args);
            };
            window.gtag('js', new Date());
            window.gtag('config', environment.google.analytics.id, {
                send_page_view: false,
            });
        });

        return this.loadPromise;
    }

    event(eventName: string, parameters?: Record<string, unknown>): void {
        if (!environment.production) {
            return;
        }

        window.gtag?.('event', eventName, parameters);
    }
}
