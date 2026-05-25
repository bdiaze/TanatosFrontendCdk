import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../services/auth-store';

export const redirectToInicioSesionIniciada: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const authStore = inject(AuthStore);

    // Se busca queryParam sr "sin redirect", si no viene y la sesión está iniciada, se redirecciona al tablero inicial...
    const x = route.queryParamMap.get('sr');
    if (!x && authStore.sesionIniciada()) {
        return router.createUrlTree(['/inicio']);
    }

    return true;
};
