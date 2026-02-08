import { AuthStore } from '@services/auth-store';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Login } from '@/app/features/auth/login/login';
import { Logout } from '@/app/features/auth/logout/logout';
import { RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmP } from '@spartan-ng/helm/typography';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { Menu } from '@components/menu/menu';
import { ClickOutside } from '@/app/directives/click-outside';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [
        HlmButtonImports,
        Login,
        Logout,
        RouterLink,
        HlmSeparatorImports,
        HlmP,
        NgIcon,
        HlmIcon,
        Menu,
        ClickOutside,
        CommonModule,
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss',
    providers: [
        provideIcons({
            lucideMenu,
        }),
    ],
})
export class Header implements OnInit {
    urlLogo = `${environment.urlImages}/images/logo.svg`;

    private authStore = inject(AuthStore);

    sesionIniciada = this.authStore.sesionIniciada;
    logoutRunning = this.authStore.logoutRunning;

    menuAbierto = signal<boolean>(false);

    ngOnInit() {
        this.authStore.backgroundRefresh();
    }

    toggleMenu() {
        this.menuAbierto.update((valor) => !valor);
    }

    cerrarMenu() {
        this.menuAbierto.set(false);
    }
}
