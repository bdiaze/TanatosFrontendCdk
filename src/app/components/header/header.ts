import { AuthStore } from '@services/auth-store';
import { Component, inject, OnInit } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Login } from '@/app/features/auth/login/login';
import { Logout } from '@/app/features/auth/logout/logout';
import { RouterLink } from '@angular/router';
import { RouterListener } from '@/app/services/router-listener';

@Component({
    selector: 'app-header',
    imports: [HlmButtonImports, Login, Logout, RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit {
    urlLogo = inject(RouterListener).urlLogo;

    private authStore = inject(AuthStore);

    sesionIniciada = this.authStore.sesionIniciada;
    logoutRunning = this.authStore.logoutRunning;

    ngOnInit() {
        this.authStore.backgroundRefresh();
    }
}
