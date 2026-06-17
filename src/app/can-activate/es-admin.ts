import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth-store';

export const esAdmin: CanActivateFn = (_) => {
    const authStore = inject(AuthStore);

    if (!authStore.sesionIniciada()) {
        return false;
    }

    const groups = authStore.groups();
    if (groups.has('Admin')) {
        return true;
    }

    return false;
};
