import { environment } from '@/environments/environment';
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RedirectToLogin {
    cargandoLogin = signal(false);
    private readonly isRedirectingToLogin = signal(false);

    async redireccionarALogin(accion: 'login' | 'signup' = 'login', redirectAfterLogin?: string, cargandoVisible: boolean = false) {
        if (this.isRedirectingToLogin()) return;
        this.isRedirectingToLogin.set(true);
        this.cargandoLogin.set(cargandoVisible);

        window.addEventListener('pageshow', this.onPageShow);

        const url: string = await this.generarUrlALogin(accion, redirectAfterLogin);

        window.location.href = url;
    }

    onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
            this.isRedirectingToLogin.set(false);
            this.cargandoLogin.set(false);
        }

        window.removeEventListener('pageshow', this.onPageShow);
    };

    generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map((x) => chars[x % chars.length])
            .join('');
    }

    async generateCodeChallenge(verifier: string): Promise<string> {
        const data = new TextEncoder().encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCodePoint(...new Uint8Array(digest)))
            .replaceAll('+', '-')
            .replaceAll('/', '_')
            .replaceAll('=', '');
    }

    async generarUrlALogin(accion: 'login' | 'signup' = 'login', redirectAfterLogin?: string): Promise<string> {
        const codeVerifier = this.generateRandomString(64);
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        const nonce = this.generateRandomString(32);
        const state = btoa(JSON.stringify({ nonce, redirect: redirectAfterLogin }));

        localStorage.setItem(`pkce:${nonce}`, JSON.stringify({ verifier: codeVerifier, ts: Date.now() }));

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

        return (
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
            })
        );
    }

    limpiarPkceExpirados() {
        for (const k of Object.keys(localStorage)) {
            if (!k.startsWith('pkce:')) continue;
            try {
                const { ts } = JSON.parse(localStorage.getItem(k)!);
                if (Date.now() - ts > 10 * 60 * 1000 /* 10 minutos*/) localStorage.removeItem(k);
            } catch {
                localStorage.removeItem(k);
            }
        }
    }
}
