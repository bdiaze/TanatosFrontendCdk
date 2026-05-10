import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@services/auth-store';
import { catchError, filter, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { AuthDao } from '@daos/auth-dao';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { redireccionarALogin } from '../features/auth/login/login';
import { AuthRefreshService } from '../services/auth-refresh-service';

let isRefreshing = false;
let refreshTokenSubject = new Subject<string>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const refreshService = inject(AuthRefreshService);

    // Si la URL no está en el listado de "addAuthorization", no se añade el Authorization...
    const addAuthorizationUrls = [`${environment.tanatosService.apiUrl}`];
    if (!addAuthorizationUrls.some((url) => req.url.startsWith(url))) {
        return next(req);
    }

    // Si la URL esta en el listado de 'skip', no se añade el Authorization...
    const skipUrls = [`${environment.tanatosService.apiUrl}/public/`];
    if (skipUrls.some((url) => req.url.startsWith(url))) {
        return next(req);
    }

    // Se añade Authorization con access token...
    const token = authStore.accessToken();
    if (!req.headers.has('Authorization') && token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Si se obtiene 401 Unauthorized, se obtendrá nuevo access token...
    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status !== 401) {
                return throwError(() => err);
            }

            if (req.headers.has('X-Retry')) {
                redireccionarALogin();
                return throwError(() => err);
            }

            return refreshService.refreshToken().pipe(
                catchError((refreshErr) => {
                    redireccionarALogin();
                    return throwError(() => refreshErr);
                }),
                switchMap((newToken) =>
                    next(
                        req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`,
                                'X-Retry': 'true',
                            },
                        }),
                    ),
                ),
            );
        }),
    );
};
