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

    sesionIniciada = signal<boolean>(false);

    groups = signal<Set<string>>(new Set<string>());

    setAccessToken(token: string | null) {
        this._accessToken.set(token);

        if (token) {
            sessionStorage.setItem('access_token', token);

            // Se valida si cambiaron los groups del token...
            let mismosGrupos = true;
            const groupsNuevoToken = new Set<string>(jwtDecode<AuthClaims>(token)['cognito:groups'] ?? []);
            const groupsActuales = this.groups();
            if (groupsNuevoToken.size !== groupsActuales.size) {
                mismosGrupos = false;
            } else {
                for (const valor of groupsNuevoToken) {
                    if (!groupsActuales.has(valor)) {
                        mismosGrupos = false;
                        break;
                    }
                }
            }
            if (!mismosGrupos) {
                this.groups.set(groupsNuevoToken);
            }

            if (!this.sesionIniciada()) {
                this.sesionIniciada.set(true);
            }
        } else {
            sessionStorage.removeItem('access_token');
            this.groups.set(new Set<string>());
            this.sesionIniciada.set(false);
        }
    }

    backgroundRefreshRunning = signal<boolean>(false);

    backgroundRefresh() {
        if (!this.backgroundRefreshRunning() && !this._accessToken()) {
            this.backgroundRefreshRunning.set(true);

            this.authDao
                .refreshAccessToken()
                .subscribe({
                    next: (newToken) => {
                        this.setAccessToken(newToken.accessToken);
                    },
                    error: (err) => {
                        console.warn('No se logra hacer refresh inicial del access token...');
                    },
                })
                .add(() => {
                    this.backgroundRefreshRunning.set(false);
                });
        }
    }

    callbackRunning = signal<boolean>(false);

    logoutRunning = signal<boolean>(false);

    tokenPorExpirar(margenSegundos = 30): boolean {
        const token = this._accessToken();
        if (!token) return true;

        const decoded = jwtDecode<AuthClaims>(token);
        if (!decoded.exp) return true;

        const ahora = Math.floor(Date.now() / 1000);
        return decoded.exp < ahora + margenSegundos;
    }
}
