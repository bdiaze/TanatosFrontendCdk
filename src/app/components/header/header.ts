import { AuthStore } from '@services/auth-store';
import { Component, inject, OnInit } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Login } from '@/app/features/auth/login/login';
import { Logout } from '@/app/features/auth/logout/logout';

@Component({
    selector: 'app-header',
    imports: [HlmButtonImports, Login, Logout],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit {
    private authStore = inject(AuthStore);

    sesionIniciada = this.authStore.sesionIniciada;

    ngOnInit() {
        this.authStore.backgroundRefresh();
    }
}
