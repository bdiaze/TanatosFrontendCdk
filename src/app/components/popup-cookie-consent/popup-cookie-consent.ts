import { Component, inject, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCookie, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-popup-cookie-consent',
    imports: [HlmButtonImports, NgIcon, HlmIcon, HlmH3, HlmH4, HlmP, HlmSwitch, HlmSeparatorImports, RouterLink],
    templateUrl: './popup-cookie-consent.html',
    styleUrl: './popup-cookie-consent.scss',
    providers: [
        provideIcons({
            lucideCookie,
            lucideX,
        }),
    ],
})
export class PopupCookieConsent implements OnInit {
    private readonly storageKey = 'todoenorden_cookie_consent';
    private readonly consentVersion = 1;
    private readonly monthsExpiration = 12;

    readonly consentChange = output<CookieConsent>();

    readonly isOpen = signal(false);
    readonly isPersonalizacionOpen = signal(false);

    readonly consent = signal<CookieConsent>({
        analytics: true,
        advertising: true,
    } as CookieConsent);

    ngOnInit(): void {
        const storedConsent = this.loadConsent();

        if (storedConsent) {
            this.consent.set(storedConsent);
            this.consentChange.emit(storedConsent);
        } else {
            this.isOpen.set(true);
        }
    }

    open(): void {
        this.isOpen.set(true);
    }

    save(): void {
        const consent: CookieConsent = {
            ...this.consent(),
            consentedAt: new Date().toISOString(),
            version: this.consentVersion,
        };

        localStorage.setItem(this.storageKey, JSON.stringify(consent));

        this.isOpen.set(false);
        this.isPersonalizacionOpen.set(false);
        this.consentChange.emit(consent);
    }

    openPersonalizacion(): void {
        this.isPersonalizacionOpen.set(true);
    }

    cerrarPersonalizacion(): void {
        this.isPersonalizacionOpen.set(false);
    }

    acceptAll(): void {
        this.consent.set({
            analytics: true,
            advertising: true,
        } as CookieConsent);

        this.save();
    }

    rejectNonEssential(): void {
        this.consent.set({
            analytics: false,
            advertising: false,
        } as CookieConsent);

        this.save();
    }

    setAnalytics(value: boolean): void {
        this.consent.update((consent) => ({
            ...consent,
            analytics: value,
        }));
    }

    setAdvertising(value: boolean): void {
        this.consent.update((consent) => ({
            ...consent,
            advertising: value,
        }));
    }

    private loadConsent(): CookieConsent | null {
        const stored = localStorage.getItem(this.storageKey);

        if (!stored) {
            return null;
        }

        try {
            const parsed = JSON.parse(stored);

            if (
                typeof parsed !== 'object' ||
                parsed === null ||
                typeof parsed.analytics !== 'boolean' ||
                typeof parsed.advertising !== 'boolean' ||
                typeof parsed.consentedAt !== 'string' ||
                typeof parsed.version !== 'number'
            ) {
                return null;
            }

            if (parsed.version !== this.consentVersion) {
                return null;
            }

            const consentedAt = new Date(parsed.consentedAt);
            if (Number.isNaN(consentedAt.getTime())) {
                return null;
            }

            const expiration = new Date(consentedAt);
            expiration.setMonth(expiration.getMonth() + this.monthsExpiration);

            if (new Date() >= expiration) {
                return null;
            }

            return {
                analytics: parsed.analytics,
                advertising: parsed.advertising,
                consentedAt: parsed.consentedAt,
                version: parsed.version,
            };
        } catch {
            return null;
        }
    }
}

export interface CookieConsent {
    analytics: boolean;
    advertising: boolean;
    consentedAt: string;
    version: number;
}
