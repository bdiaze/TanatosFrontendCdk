import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
    private initialized = false;

    initialize(): void {
        if (this.initialized || !environment.google.analytics.id || !environment.production) {
            return;
        }

        this.initialized = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.google.analytics.id}`;

        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];

        window.gtag = (...args: unknown[]) => {
            window.dataLayer.push(args);
        };

        window.gtag('js', new Date());
        window.gtag('config', environment.google.analytics.id);
    }

    event(eventName: string, parameters?: Record<string, unknown>): void {
        if (!environment.production) {
            return;
        }

        window.gtag?.('event', eventName, parameters);
    }
}
