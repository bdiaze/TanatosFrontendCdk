import { AuthDao } from '@daos/auth-dao';
import { AuthStore } from '@services/auth-store';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { clearCookie } from '@/app/helpers/cookie-helper';
import { NegocioStore } from '@/app/services/negocio-store';
import { CommonModule } from '@angular/common';
import { AuthRefreshService } from '@/app/services/auth-refresh-service';

@Component({
    selector: 'app-logout',
    imports: [HlmButtonImports, HlmSpinnerImports, CommonModule],
    templateUrl: './logout.html',
    styleUrl: './logout.scss',
})
export class Logout {
    @Input() primary: boolean = false;

    private authDao = inject(AuthDao);
    private authStore = inject(AuthStore);
    private router = inject(Router);
    private authRefreshService = inject(AuthRefreshService);

    backgroundRefreshRunning = this.authRefreshService.backgroundRefreshRunning;
    callbackRunning = this.authStore.callbackRunning;
    cerrandoSesion = this.authStore.logoutRunning;

    mostrarCargando = computed(() => {
        return this.cerrandoSesion();
    });

    deshabilitarBoton = computed<boolean>(() => {
        return this.cerrandoSesion() || this.backgroundRefreshRunning() || this.callbackRunning();
    });

    cerrarSesion() {
        this.cerrandoSesion.set(true);
        this.router.navigateByUrl('/cargando-inicio');
        this.authDao
            .limpiarAuthCookies()
            .subscribe({
                next: () => {
                    console.log('Se limpió exitosamente las cookies de autenticación.');
                },
                error: (err) => {
                    console.error('Ocurrió un error al limpiar cookies de autenticación.', err);
                },
            })
            .add(() => {
                this.authStore.setAccessToken(null);

                const url =
                    `${environment.cognitoService.baseUrl}/logout?` +
                    new URLSearchParams({
                        client_id: environment.cognitoService.clientId,
                        logout_uri: environment.cognitoService.logoutUrl,
                    });

                window.location.href = url;
            });
    }
}
