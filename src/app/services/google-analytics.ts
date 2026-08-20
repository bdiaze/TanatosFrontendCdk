import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
    private isInitialized = false;

    private initGtag(): void {
        if (this.isInitialized) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', environment.google.analytics.id, {
            send_page_view: false,
        });

        this.isInitialized = true;
    }

    load(): void {
        if (!environment.google.analytics.id || !environment.production) {
            return;
        }

        this.initGtag();

        if (document.getElementById('google-analytics-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-analytics-script';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.google.analytics.id}`;
        script.async = true;
        document.head.appendChild(script);
    }

    event(eventName: string, parameters?: Record<string, unknown>): void {
        if (!environment.production) {
            return;
        }

        this.initGtag();

        window.gtag?.('event', eventName, parameters);
    }
}
