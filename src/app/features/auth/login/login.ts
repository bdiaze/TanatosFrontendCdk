import { AuthRefreshService } from '@/app/services/auth-refresh-service';
import { AuthStore } from '@/app/services/auth-store';
import { Component, computed, inject, Inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { environment } from '@environment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-login',
    imports: [HlmButtonImports, HlmSpinnerImports],
    templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
    @Input() vertical: boolean = false;

    private readonly authStore = inject(AuthStore);
    private readonly authRefreshService = inject(AuthRefreshService);

    backgroundRefreshRunning = this.authRefreshService.backgroundRefreshRunning;
    callbackRunning = this.authStore.callbackRunning;
    iniciandoSesion = signal<boolean>(false);
    registrandose = signal<boolean>(false);

    mostrarCargandoInicioSesion = computed(() => {
        return this.iniciandoSesion();
    });

    mostrarCargandoRegistrarse = computed(() => {
        return this.registrandose();
    });

    deshabilitarBoton = computed<boolean>(() => {
        return this.iniciandoSesion() || this.registrandose() || this.backgroundRefreshRunning() || this.callbackRunning();
    });

    ngOnInit() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        window.addEventListener('pageshow', this.onPageShow);
    }

    ngOnDestroy() {
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('pageshow', this.onPageShow);
    }

    onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            this.iniciandoSesion.set(false);
            this.registrandose.set(false);
        }
    };

    onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
            this.iniciandoSesion.set(false);
            this.registrandose.set(false);
        }
    };

    async iniciarSesion(registrarse: boolean = false) {
        if (!registrarse) {
            this.iniciandoSesion.set(true);
        } else {
            this.registrandose.set(true);
        }
        await redireccionarALogin(registrarse ? 'signup' : 'login');
    }
}

export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map((x) => chars[x % chars.length])
        .join('');
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

let isRedirectingToLogin = false;

export async function redireccionarALogin(accion: 'login' | 'signup' = 'login', redirectAfterLogin?: string) {
    if (isRedirectingToLogin) return;
    isRedirectingToLogin = true;

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const statePayload = {
        nonce: generateRandomString(32),
        redirect: redirectAfterLogin,
    };
    const state = btoa(JSON.stringify(statePayload));
    sessionStorage.setItem('pkce_state', state);
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    const publicScopes = [
        'api/perfil.read.self',
        'api/perfil.write.self',
        'api/negocios.read.self',
        'api/negocios.write.self',
        'api/obligaciones.read.self',
        'api/obligaciones.write.self',
        'api/vencimientos.read.self',
        'api/vencimientos.write.self',
        'api/suscripciones.read.self',
        'api/suscripciones.write.self',
        'api/templates.read.public',
        'api/sistema.read.public',
    ];

    let urlBase = `${environment.cognitoService.baseUrl}/login?`;
    if (accion === 'signup') {
        urlBase = `${environment.cognitoService.baseUrl}/signup?`;
    }

    const url =
        urlBase +
        new URLSearchParams({
            response_type: 'code',
            client_id: environment.cognitoService.clientId,
            redirect_uri: environment.cognitoService.redirectUrl,
            scope: `openid profile email ${publicScopes.join(' ')}`,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            lang: 'es',
        });

    window.location.href = url;
}
