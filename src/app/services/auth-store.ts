import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AuthClaims } from '@models/auth-claims';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    private platformId = inject(PLATFORM_ID);

    private _accessToken = signal<string | null>(null);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const token = sessionStorage.getItem('access_token');
            if (token) {
                this._accessToken.set(token);
            }
        }
    }

    accessToken() {
        return this._accessToken();
    }

    setAccessToken(token: string | null) {
        this._accessToken.set(token);

        if (isPlatformBrowser(this.platformId)) {
            if (token) {
                sessionStorage.setItem('access_token', token);
            } else {
                sessionStorage.removeItem('access_token');
            }
        }
    }

    claims = computed<AuthClaims | null>(() => {
        const token = this._accessToken();
        if (!token) return null;

        return jwtDecode<AuthClaims>(token);
    });

    sub = computed<string | null>(() => {
        return this.claims()?.sub ?? null;
    });

    sesionIniciada = computed<boolean>(() => {
        const token = this._accessToken();
        if (!token) {
            return false;
        }

        return true;
    });
}
