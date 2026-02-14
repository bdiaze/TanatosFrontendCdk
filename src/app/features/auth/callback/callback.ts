import { environment } from '@environment';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@services/auth-store';
import { EntAuthObtenerAccessToken } from '@/app/entities/others/ent-auth-obtener-access-token';
import { AuthDao } from '@/app/daos/auth-dao';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-callback',
    imports: [HlmSpinnerImports, HlmProgressImports, HlmSkeletonImports],
    templateUrl: './callback.html',
    styleUrl: './callback.scss',
    host: {
        class: 'inline-block h-full w-full',
    },
})
export class Callback implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authStore = inject(AuthStore);
    private authDao = inject(AuthDao);

    progreso = signal<number>(0);
    desc_progreso = signal<string>('Cargando la información de tus negocios...');

    interval!: number;

    ngOnInit() {
        this.authStore.callbackRunning.set(true);

        // this.iniciarProgresoFalso();

        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            const returnedState = params['state'];

            const storedState = sessionStorage.getItem('pkce_state');
            const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

            // Se valida que venga code, que state sea válido, y que se tenga code verifier almacenado...
            if (!code) {
                console.error('No se incluyó code en URL');
                return;
            }

            if (!returnedState || returnedState !== storedState) {
                console.error('No se incluyó state en URL o es inválido');
                return;
            }

            if (!codeVerifier) {
                console.error('No se tiene code verifier almacenado');
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
                        clearInterval(this.interval);

                        this.authStore.setAccessToken(tokens.accessToken);

                        // Se setea cookie con CSRF Token...
                        const expires: Date = new Date(tokens.csrfTokenExpiration);
                        document.cookie = `csrf_token=${
                            tokens.csrfToken
                        }; expires=${expires.toUTCString()}; path=/`;

                        sessionStorage.removeItem('pkce_state');
                        sessionStorage.removeItem('pkce_code_verifier');

                        this.progreso.set(100);
                        this.desc_progreso.set('Sesión iniciada exitosamente...');

                        this.router.navigateByUrl('/inicio');
                    },
                    error: (err) => {
                        clearInterval(this.interval);
                        this.progreso.set(100);
                        this.desc_progreso.set(
                            'Ocurrió un error al iniciar sesión, intente nuevamente...',
                        );
                        console.error('Ocurrió un error al obtener tokens', err);
                    },
                })
                .add(() => {
                    this.authStore.callbackRunning.set(false);
                });
        });
    }

    async iniciarProgresoFalso() {
        let i = 0;
        this.interval = setInterval(() => {
            if (i >= 90) {
                clearInterval(this.interval);
                return;
            }

            this.progreso.update((oldValue) => (oldValue < 90 ? oldValue + 10 : oldValue));
            i += 10;
            if (i == 30) {
                // this.desc_progreso.set('Validando estado contra XSRF...');
            } else if (i == 60) {
                // this.desc_progreso.set('Generando tokens de autenticación...');
            }
        }, 100);
    }
}
