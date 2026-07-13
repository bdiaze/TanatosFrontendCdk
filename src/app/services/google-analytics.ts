import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
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

            window.dataLayer = window.dataLayer || [];

            window.gtag = (...args: unknown[]) => {
                window.dataLayer.push(args);
            };

            const script = document.createElement('script');
            script.id = 'google-analytics-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.google.analytics.id}`;

            script.onload = () => {
                window.gtag('js', new Date());
                window.gtag('config', environment.google.analytics.id);
                resolve();
            };
            script.onerror = () => reject(new Error('No se pudo cargar Google Analytics'));

            document.head.appendChild(script);
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
