import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth-store';

export const esAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): GuardResult => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const groups = authStore.groups();
    if (groups.has('Admin')) {
        return true;
    }

    return router.parseUrl('/inicio');
};
