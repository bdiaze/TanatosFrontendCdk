import { environment } from '@/environments/environment';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
    private readonly title = inject(Title);

    private isInitialized = false;
    private isEnabled = false;

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

        this.isEnabled = true;

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
        if (!environment.production || !this.isEnabled) {
            return;
        }

        window.gtag?.('event', eventName, parameters);
    }

    trackCurrentPage(): void {
        this.event('page_view', {
            page_title: this.title.getTitle(),
            page_location: window.location.href,
            page_path: window.location.pathname,
        });
    }
}
