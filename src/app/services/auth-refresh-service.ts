import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, NEVER, Observable, of, ReplaySubject, take, tap, throwError } from 'rxjs';
import { AuthDao } from '../daos/auth-dao';
import { AuthStore } from './auth-store';
import { Router } from '@angular/router';
import { RedirectToLogin } from './redirect-to-login';

@Injectable({
    providedIn: 'root',
})
export class AuthRefreshService {
    private _isRefreshing = false;
    get isRefreshing() {
        return this._isRefreshing;
    }

    private refreshTokenSubject = new ReplaySubject<string>(1);
    private readonly authDao = inject(AuthDao);
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);
    private readonly redirectToLogin = inject(RedirectToLogin);

    refreshToken(sinRedirect: boolean = false): Observable<string> {
        if (!this._isRefreshing) {
            this._isRefreshing = true;
            this.refreshTokenSubject = new ReplaySubject<string>(1);

            this.authDao
                .refreshAccessToken()
                .pipe(
                    tap((res) => {
                        this.authStore.setAccessToken(res.accessToken);
                        this.refreshTokenSubject.next(res.accessToken);
                        this.refreshTokenSubject.complete();
                        this._isRefreshing = false;
                    }),
                    catchError((err) => {
                        this._isRefreshing = false;
                        this.authStore.setAccessToken(null);
                        this.refreshTokenSubject.error(err);
                        if (!sinRedirect) {
                            this.redirectToLogin.redireccionarALogin('login', this.router.url, true);
                            return NEVER;
                        }
                        return throwError(() => err);
                    }),
                )
                .subscribe();
        }

        return this.refreshTokenSubject.pipe(take(1));
    }

    backgroundRefreshRunning = signal<boolean>(false);
    backgroundRefresh() {
        if (!this.backgroundRefreshRunning() && !this.authStore.accessToken()) {
            this.backgroundRefreshRunning.set(true);

            this.refreshToken(true)
                .subscribe({
                    next: (res) => {},
                    error: (err) => {
                        console.warn('No se logra hacer refresh inicial del access token...');
                    },
                })
                .add(() => {
                    this.backgroundRefreshRunning.set(false);
                });
        }
    }

    esperarBackgroundRefresh(): Observable<void> {
        if (this.backgroundRefreshRunning()) {
            return this.refreshTokenSubject.pipe(
                take(1),
                map(() => void 0),
            );
        }
        return of(void 0);
    }
}
