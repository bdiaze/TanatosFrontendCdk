import { environment } from '@environment';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@services/auth-store';
import { EntAuthObtenerAccessToken } from '@/app/entities/others/ent-auth-obtener-access-token';
import { AuthDao } from '@/app/daos/auth-dao';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
    selector: 'app-callback',
    imports: [HlmAlertImports, HlmSpinnerImports, HlmProgressImports, HlmSkeletonImports, NgIcon, HlmIcon],
    templateUrl: './callback.html',
    styleUrl: './callback.scss',
    host: {
        class: 'inline-block h-full w-full',
    },
    providers: [
        provideIcons({
            lucideTriangleAlert,
        }),
    ],
})
export class Callback implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authStore = inject(AuthStore);
    private authDao = inject(AuthDao);

    error = signal('');

    ngOnInit() {
        this.authStore.callbackRunning.set(true);

        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            const returnedState = params['state'];

            const storedState = sessionStorage.getItem('pkce_state');
            const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

            // Se valida que venga code, que state sea válido, y que se tenga code verifier almacenado...
            if (!code || !returnedState || !storedState || !codeVerifier) {
                if (!this.authStore.sesionIniciada()) {
                    console.error(
                        !code
                            ? 'No se incluyó code en URL de callback'
                            : !returnedState
                              ? 'No se incluyó state en URL de callback'
                              : !storedState
                                ? 'No se encontró pkce_state en session storage'
                                : !codeVerifier
                                  ? 'No se encontró pkce_code_verifier en session storage'
                                  : '',
                    );
                    this.error.set('¡Ups! parece que algo salió mal mientras procesabamos tu inicio de sesión, favor intenta nuevamente.');
                } else {
                    this.router.navigateByUrl('/inicio');
                }
                return;
            }

            if (returnedState !== storedState) {
                console.error('El state incluido en la URL es inválido');
                this.error.set('¡Ups! parece que algo salió mal mientras procesabamos tu inicio de sesión, favor intenta nuevamente.');
                return;
            }

            // Se obtiene access token...
            const parametros: EntAuthObtenerAccessToken = {
                code,
                codeVerifier,
                redirectUri: environment.cognitoService.redirectUrl,
            };

            this.authDao
                .obtenerAccessToken(parametros)
                .subscribe({
                    next: (tokens) => {
                        this.authStore.setAccessToken(tokens.accessToken);

                        // Se setea cookie con CSRF Token...
                        const expires: Date = new Date(tokens.csrfTokenExpiration);
                        document.cookie = `csrf_token=${tokens.csrfToken}; expires=${expires.toUTCString()}; path=/`;

                        sessionStorage.removeItem('pkce_state');
                        sessionStorage.removeItem('pkce_code_verifier');

                        this.router.navigateByUrl('/inicio');
                    },
                    error: (err) => {
                        console.error('Ocurrió un error al obtener tokens', err);
                        this.error.set('¡Ups! parece que algo salió mal mientras procesabamos tu inicio de sesión, favor intenta nuevamente.');
                    },
                })
                .add(() => {
                    this.authStore.callbackRunning.set(false);
                });
        });
    }
}
