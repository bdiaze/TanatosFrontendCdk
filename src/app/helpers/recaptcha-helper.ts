import { environment } from '@/environments/environment';
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RecaptchaHelper {
    private loadPromise?: Promise<void>;

    siteKey = signal<string>(environment.google.recaptcha.siteKey);

    load(): Promise<void> {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise((resolve, reject) => {
            if (document.getElementById('recaptcha-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'recaptcha-script';
            script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey()}`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject();

            document.head.appendChild(script);
        });

        return this.loadPromise;
    }

    async execute(action: string): Promise<string> {
        await this.load();

        return new Promise((resolve, reject) => {
            window.grecaptcha.enterprise.ready(() => {
                window.grecaptcha.enterprise
                    .execute(environment.google.recaptcha.siteKey, { action })
                    .then((token: string) => resolve(token))
                    .catch((err: any) => reject(err));
            });
        });
    }
}
