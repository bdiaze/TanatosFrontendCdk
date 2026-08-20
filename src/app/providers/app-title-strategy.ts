import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { GoogleAnalytics } from '../services/google-analytics';

@Injectable({
    providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
    private readonly googleAnalytics = inject(GoogleAnalytics);

    constructor(private readonly title: Title) {
        super();
    }

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const pageTitle = this.buildTitle(snapshot);
        const finalTitle = pageTitle ? `${pageTitle} - Todo en Orden` : 'Todo en Orden';

        this.title.setTitle(finalTitle);

        this.googleAnalytics.event('page_view', {
            page_title: finalTitle,
            page_location: window.location.href,
            page_path: snapshot.url,
        });
    }
}
