import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth-store';
import { redireccionarALogin } from '../features/auth/login/login';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthRefreshService } from '../services/auth-refresh-service';

export const sesionIniciada: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> => {
    const refreshService = inject(AuthRefreshService);
    const authStore = inject(AuthStore);

    return refreshService.esperarBackgroundRefresh().pipe(
        map(() => {
            if (authStore.sesionIniciada()) {
                return true;
            }

            redireccionarALogin('login', state.url);
            return false;
        }),
        catchError(() => {
            redireccionarALogin('login', state.url);
            return of(false);
        }),
    );
};
