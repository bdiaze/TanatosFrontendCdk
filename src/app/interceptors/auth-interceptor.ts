import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@services/auth-store';
import { catchError, NEVER, switchMap, throwError } from 'rxjs';
import { environment } from '@environment';
import { AuthRefreshService } from '../services/auth-refresh-service';
import { RedirectToLogin } from '../services/redirect-to-login';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const refreshService = inject(AuthRefreshService);
    const redirectToLogin = inject(RedirectToLogin);
    const router = inject(Router);

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

    const manejar403 = (err: HttpErrorResponse, token: string | null) => {
        if (err.status !== 403 || !token) {
            return throwError(() => err);
        }

        const scopesFaltantes = redirectToLogin.obtenerScopesFaltantes(token);
        if (scopesFaltantes.length === 0) {
            return throwError(() => err);
        }

        redirectToLogin.redireccionarALogin('login', router.url, true);
        return NEVER;
    };

    const enviar = (token: string | null) => {
        const r = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
        return next(r).pipe(catchError((err) => manejar403(err, token)));
    };

    if (refreshService.isRefreshing || authStore.tokenPorExpirar()) {
        return refreshService.refreshToken().pipe(switchMap(enviar));
    }

    // Si se obtiene 401 Unauthorized, se obtendrá nuevo access token...
    return enviar(authStore.accessToken()).pipe(
        catchError((err: HttpErrorResponse) => (err.status === 401 ? refreshService.refreshToken().pipe(switchMap(enviar)) : throwError(() => err))),
    );
};
