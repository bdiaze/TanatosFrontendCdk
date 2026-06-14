import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth-store';
import { redireccionarALogin } from '../features/auth/login/login';
import { catchError, map, NEVER, startWith } from 'rxjs';
import { AuthRefreshService } from '../services/auth-refresh-service';

export const sesionIniciada: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const refreshService = inject(AuthRefreshService);
    const authStore = inject(AuthStore);

    return refreshService.esperarBackgroundRefresh().pipe(
        map(() => {
            if (authStore.sesionIniciada()) {
                return true;
            }

            redireccionarALogin(false, state.url);
            return false;
        }),
        catchError(() => {
            redireccionarALogin(false, state.url);
            return NEVER;
        }),
    );
};
