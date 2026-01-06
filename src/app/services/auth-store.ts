import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthClaims } from '@/app/entities/others/auth-claims';
import { jwtDecode } from 'jwt-decode';
import { AuthDao } from '@daos/auth-dao';
import { getCookie } from '@helpers/cookie-helper';

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    private authDao = inject(AuthDao);

    private _accessToken = signal<string | null>(null);

    constructor() {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            this.setAccessToken(token);
        }
    }

    accessToken() {
        return this._accessToken();
    }

    setAccessToken(token: string | null) {
        this._accessToken.set(token);

        if (token) {
            sessionStorage.setItem('access_token', token);
            if (this.sesionIniciada() !== true) {
                this.sesionIniciada.set(true);
            }
        } else {
            sessionStorage.removeItem('access_token');
            this.sesionIniciada.set(false);
        }
    }

    sesionIniciada = signal<boolean>(false);

    claims = computed<AuthClaims | null>(() => {
        const token = this._accessToken();
        if (!token) return null;

        return jwtDecode<AuthClaims>(token);
    });

    sub = computed<string | null>(() => {
        return this.claims()?.sub ?? null;
    });

    backgroundRefreshRunning = signal<boolean>(false);

    backgroundRefresh() {
        if (!this.backgroundRefreshRunning() && !this._accessToken()) {
            const csrfToken = getCookie('csrf_token');
            if (csrfToken) {
                this.backgroundRefreshRunning.set(true);

                this.authDao
                    .refreshAccessToken()
                    .subscribe({
                        next: (newToken) => {
                            this.setAccessToken(newToken.accessToken);
                        },
                        error: (err) => {
                            console.warn(
                                'No se logra hacer refresh inicial del access token...',
                                err
                            );
                        },
                    })
                    .add(() => {
                        this.backgroundRefreshRunning.set(false);
                    });
            }
        }
    }

    callbackRunning = signal<boolean>(false);

    logoutRunning = signal<boolean>(false);
}
