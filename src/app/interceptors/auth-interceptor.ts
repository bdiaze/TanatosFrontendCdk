import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@services/auth-store';
import { catchError, filter, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { AuthDao } from '@daos/auth-dao';
import { environment } from '@environment';
import { Router } from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject = new Subject<string>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Si la URL esta en el listado de 'skip', no se añade el Authorization...
    const skipUrls = [`${environment.tanatosService.apiUrl}/public/`];
    if (skipUrls.some((url) => req.url.startsWith(url))) {
        return next(req);
    }

    // Se añade Authorization con access token...
    const authDao = inject(AuthDao);
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const token = authStore.accessToken();
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Si se obtiene 401 Unauthorized, se obtendrá nuevo access token...
    // La marca isRefreshing indica que se está esperando por un nuevo access token,
    // es decir que todas las requests quedarán encoladas, una vez recepcionado el nuevo
    // access token, se procesan todas las request encoladas...
    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;

                    refreshTokenSubject?.complete();
                    refreshTokenSubject = new Subject<string>();

                    return authDao.refreshAccessToken().pipe(
                        catchError((refreshErr) => {
                            isRefreshing = false;
                            authStore.setAccessToken(null);
                            document.cookie = `csrf_token=; max-age=0; path=/`;
                            refreshTokenSubject.error(refreshErr);

                            router.navigate(['']);

                            return throwError(() => refreshErr);
                        }),
                        tap((newToken) => {
                            authStore.setAccessToken(newToken.accessToken);
                            refreshTokenSubject.next(newToken.accessToken);
                            refreshTokenSubject.complete();
                            isRefreshing = false;
                        }),
                        switchMap((newToken) =>
                            next(
                                req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newToken.accessToken}`,
                                    },
                                })
                            )
                        )
                    );
                } else {
                    return refreshTokenSubject.pipe(
                        filter((t) => !!t),
                        take(1),
                        switchMap((newToken) =>
                            next(
                                req.clone({
                                    setHeaders: { Authorization: `Bearer ${newToken}` },
                                })
                            )
                        )
                    );
                }
            }
            return throwError(() => err);
        })
    );
};
