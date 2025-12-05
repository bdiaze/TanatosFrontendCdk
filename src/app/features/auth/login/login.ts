import { Component, Inject, signal } from '@angular/core';
import { environment } from '@environment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-login',
    imports: [HlmButtonImports, HlmSpinnerImports],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    deshabilitarBoton = signal<boolean>(false);

    async iniciarSesion() {
        this.deshabilitarBoton.set(true);

        const state = this.generateRandomString(32);
        const codeVerifier = this.generateRandomString(64);
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        sessionStorage.setItem('pkce_state', state);
        sessionStorage.setItem('pkce_code_verifier', codeVerifier);

        const url =
            `${environment.cognitoService.baseUrl}/login?` +
            new URLSearchParams({
                response_type: 'code',
                client_id: environment.cognitoService.clientId,
                redirect_uri: environment.cognitoService.redirectUrl,
                scope: 'openid profile email',
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                lang: 'es',
            });

        window.location.href = url;
    }

    private generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map((x) => chars[x % chars.length])
            .join('');
    }

    private async generateCodeChallenge(verifier: string): Promise<string> {
        const data = new TextEncoder().encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}
