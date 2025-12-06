import { AuthDao } from '@daos/auth-dao';
import { AuthStore } from '@services/auth-store';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-logout',
    imports: [HlmButtonImports, HlmSpinnerImports],
    templateUrl: './logout.html',
    styleUrl: './logout.scss',
})
export class Logout {
    private authDao = inject(AuthDao);
    private authStore = inject(AuthStore);

    backgroundRefreshRunning = this.authStore.backgroundRefreshRunning;
    callbackRunning = this.authStore.callbackRunning;
    cerrandoSesion = signal<boolean>(false);

    deshabilitarBoton = computed<boolean>(() => {
        return this.cerrandoSesion() || this.backgroundRefreshRunning() || this.callbackRunning();
    });

    cerrarSesion() {
        this.cerrandoSesion.set(true);
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
                document.cookie = `csrf_token=; max-age=0; path=/`;

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
