import { AuthDao } from '@daos/auth-dao';
import { AuthStore } from '@services/auth-store';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';

@Component({
    selector: 'app-logout',
    imports: [],
    templateUrl: './logout.html',
    styleUrl: './logout.scss',
})
export class Logout implements OnInit {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    private router = inject(Router);
    private authDao = inject(AuthDao);
    private authStore = inject(AuthStore);

    sesionIniciada = this.authStore.sesionIniciada;

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (this.sesionIniciada()) {
            this.authDao.limpiarAuthCookies().subscribe({
                next: () => {
                    this.authStore.setAccessToken(null);
                    document.cookie = `csrf_token=; max-age=0; path=/`;

                    const url =
                        `${environment.cognitoService.baseUrl}/logout?` +
                        new URLSearchParams({
                            client_id: environment.cognitoService.clientId,
                            logout_uri: environment.cognitoService.logoutUrl,
                        });

                    window.location.href = url;
                },
                error: (err) => {
                    console.log('Ocurrió un error al limpiar cookies auth', err);
                },
            });
        } else {
            this.router.navigateByUrl('/');
        }
    }
}
