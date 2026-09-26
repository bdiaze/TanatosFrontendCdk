import { environment } from '@/environments/environment';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
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

    private previousPageLocation: string | undefined;
    private hasTrackedInitialPage = false;

    trackPage(pageTitle: string, pageLocation: string, pagePath: string): void {
        if (!this.isEnabled) {
            return;
        }

        if (this.previousPageLocation === pageLocation) {
            return;
        }

        const pageReferrer = this.hasTrackedInitialPage ? this.previousPageLocation : this.getInitialPageReferrer();

        this.event('page_view', {
            page_title: pageTitle,
            page_location: pageLocation,
            page_path: pagePath,
            page_referrer: pageReferrer,
        });

        this.previousPageLocation = pageLocation;
        this.hasTrackedInitialPage = true;
    }

    private getInitialPageReferrer(): string | undefined {
        const referrer = document.referrer;

        if (!referrer) {
            return undefined;
        }

        // Si venimos de nuestro propio sitio, no lo consideramos referrer externo de la primera carga.
        if (referrer.startsWith(window.location.origin)) {
            return undefined;
        }

        return referrer;
    }
}
