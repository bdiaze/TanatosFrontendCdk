import { environment } from '@environment';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { NegocioDao } from '@/app/daos/negocio-dao';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';

@Component({
    selector: 'app-callback',
    imports: [HlmAlertImports, HlmSpinnerImports, HlmProgressImports, HlmSkeletonImports, NgIcon, HlmIcon],
    templateUrl: './callback.html',
    host: {
        class: 'inline-block h-full w-full',
    },
    providers: [
        provideIcons({
            lucideTriangleAlert,
        }),
    ],
})
export class Callback implements OnInit, OnDestroy {
    private readonly paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authStore = inject(AuthStore);
    private readonly authDao = inject(AuthDao);
    private readonly negocioDao = inject(NegocioDao);

    error = signal('');

    ngOnInit() {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
        this.authStore.callbackRunning.set(true);

        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            const returnedState = params['state'];

            const storedState = sessionStorage.getItem('pkce_state');
            const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

            // Se valida que venga code, que state sea válido, y que se tenga code verifier almacenado...
            if (!code || !returnedState || !storedState || !codeVerifier) {
                this.authStore.callbackRunning.set(false);
                if (!this.authStore.sesionIniciada()) {
                    const mensajeError = this.getMensajeErrorCallback(code, returnedState, storedState, codeVerifier);
                    console.error(mensajeError);
                    this.error.set('¡Ups! parece que algo salió mal mientras procesabamos tu inicio de sesión, favor intenta nuevamente.');
                } else {
                    this.router.navigateByUrl('/inicio');
                }
                return;
            }

            if (returnedState !== storedState) {
                console.error('El state incluido en la URL es inválido');
                this.error.set('¡Ups! parece que algo salió mal mientras procesabamos tu inicio de sesión, favor intenta nuevamente.');
                this.authStore.callbackRunning.set(false);
                return;
            }

            const statePayload = JSON.parse(atob(returnedState));
            let redirectUrl: string | undefined = statePayload.redirect;
            if (redirectUrl && (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//'))) {
                redirectUrl = undefined;
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

                        sessionStorage.removeItem('pkce_state');
                        sessionStorage.removeItem('pkce_code_verifier');

                        if (redirectUrl) {
                            this.router.navigateByUrl(redirectUrl);
                        } else {
                            this.negocioDao.obtenerVigentes().subscribe({
                                next: (res) => {
                                    if (!res || res.length === 0) {
                                        this.router.navigateByUrl('/bienvenido');
                                    } else {
                                        this.router.navigateByUrl('/inicio');
                                    }
                                },
                            });
                        }
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

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }

    private getMensajeErrorCallback(code: string | null, returnedState: string | null, storedState: string | null, codeVerifier: string | null): string {
        if (!code) return 'No se incluyó code en URL de callback';
        if (!returnedState) return 'No se incluyó state en URL de callback';
        if (!storedState) return 'No se encontró pkce_state en session storage';
        if (!codeVerifier) return 'No se encontró pkce_code_verifier en session storage';
        return '';
    }
}
