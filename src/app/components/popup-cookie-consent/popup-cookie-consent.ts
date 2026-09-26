import { Component, inject, OnInit, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCookie } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-popup-cookie-consent',
    imports: [HlmButtonImports, NgIcon, HlmIcon, HlmH3, HlmH4, HlmP, HlmSwitch, HlmSeparatorImports],
    templateUrl: './popup-cookie-consent.html',
    styleUrl: './popup-cookie-consent.scss',
    providers: [
        provideIcons({
            lucideCookie,
        }),
    ],
})
export class PopupCookieConsent implements OnInit {
    private readonly storageKey = 'todoenorden_cookie_consent';

    readonly consentChange = output<CookieConsent>();

    readonly isOpen = signal(false);

    readonly consent = signal<CookieConsent>({
        analytics: true,
        advertising: true,
    });

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
        const consent = this.consent();

        localStorage.setItem(this.storageKey, JSON.stringify(consent));

        this.isOpen.set(false);
        this.consentChange.emit(consent);
    }

    acceptAll(): void {
        this.consent.set({
            analytics: true,
            advertising: true,
        });

        this.save();
    }

    rejectNonEssential(): void {
        this.consent.set({
            analytics: false,
            advertising: false,
        });

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

            if (typeof parsed !== 'object' || parsed === null || typeof parsed.analytics !== 'boolean' || typeof parsed.advertising !== 'boolean') {
                return null;
            }

            return {
                analytics: parsed.analytics,
                advertising: parsed.advertising,
            };
        } catch {
            return null;
        }
    }
}

export interface CookieConsent {
    analytics: boolean;
    advertising: boolean;
}
