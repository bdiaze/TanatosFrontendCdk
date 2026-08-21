import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth-store';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthRefreshService } from '../services/auth-refresh-service';
import { RedirectToLogin } from '../services/redirect-to-login';

export const sesionIniciada: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> => {
    const refreshService = inject(AuthRefreshService);
    const authStore = inject(AuthStore);
    const redirectToLogin = inject(RedirectToLogin);

    return refreshService.esperarBackgroundRefresh().pipe(
        map(() => {
            if (authStore.sesionIniciada()) {
                return true;
            }

            redirectToLogin.redireccionarALogin('login', state.url, true);
            return false;
        }),
        catchError(() => {
            redirectToLogin.redireccionarALogin('login', state.url, true);
            return of(false);
        }),
    );
};
