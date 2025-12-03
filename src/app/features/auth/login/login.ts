import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '@environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login implements OnInit {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    async ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

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
