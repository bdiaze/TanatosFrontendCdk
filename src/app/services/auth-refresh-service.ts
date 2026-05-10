import { Injectable } from '@angular/core';
import { catchError, map, Observable, ReplaySubject, take, tap, throwError } from 'rxjs';
import { AuthDao } from '../daos/auth-dao';
import { AuthStore } from './auth-store';
import { redireccionarALogin } from '../features/auth/login/login';

@Injectable({
    providedIn: 'root',
})
export class AuthRefreshService {
    private isRefreshing = false;
    private refreshTokenSubject = new ReplaySubject<string>(1);

    constructor(
        private authDao: AuthDao,
        private authStore: AuthStore,
    ) {}

    refreshToken(): Observable<string> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject = new ReplaySubject<string>(1);

            return this.authDao.refreshAccessToken().pipe(
                tap((res) => {
                    this.authStore.setAccessToken(res.accessToken);
                    this.refreshTokenSubject.next(res.accessToken);
                    this.refreshTokenSubject.complete();
                    this.isRefreshing = false;
                }),
                map((res) => res.accessToken),
                catchError((err) => {
                    this.isRefreshing = false;
                    this.authStore.setAccessToken(null);
                    this.refreshTokenSubject.error(err);
                    redireccionarALogin();
                    return throwError(() => err);
                }),
            );
        }

        return this.refreshTokenSubject.pipe(take(1));
    }
}
