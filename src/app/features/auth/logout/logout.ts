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
    private negocioStore = inject(NegocioStore);

    backgroundRefreshRunning = this.authStore.backgroundRefreshRunning;
    callbackRunning = this.authStore.callbackRunning;
    cerrandoSesion = this.authStore.logoutRunning;

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

                this.negocioStore.negociosUsuario.set([]);
                this.negocioStore.negocioSeleccionado.set(null);
                this.negocioStore.informacionUsuario.set(null);
                clearCookie('NegocioSeleccionado');

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
