import { environment } from '@environment';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@services/auth-store';
import { EntAuthObtenerAccessToken } from '@/app/models/ent-auth-obtener-access-token';
import { AuthDao } from '@/app/daos/auth-dao';

@Component({
    selector: 'app-callback',
    imports: [],
    templateUrl: './callback.html',
    styleUrl: './callback.scss',
})
export class Callback implements OnInit {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authStore = inject(AuthStore);
    private authDao = inject(AuthDao);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

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

            this.authDao.obtenerAccessToken(parametros).subscribe({
                next: (tokens) => {
                    this.authStore.setAccessToken(tokens.accessToken);

                    // Se setea cookie con CSRF Token...
                    const expires: Date = new Date(tokens.csrfTokenExpiration);
                    document.cookie = `csrf_token=${
                        tokens.csrfToken
                    }; expires=${expires.toUTCString()}; path=/`;

                    sessionStorage.removeItem('pkce_state');
                    sessionStorage.removeItem('pkce_code_verifier');

                    this.router.navigateByUrl('/');
                },
                error: (err) => {
                    console.log('Ocurrió un error al obtener tokens', err);
                },
            });
        });
    }
}
