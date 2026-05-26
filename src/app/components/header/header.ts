import { AuthStore } from '@services/auth-store';
import { Component, computed, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Login } from '@/app/features/auth/login/login';
import { Logout } from '@/app/features/auth/logout/logout';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { Menu } from '@components/menu/menu';
import { ClickOutside } from '@/app/directives/click-outside';
import { CommonModule } from '@angular/common';
import { MobileHelper } from '@/app/helpers/mobile-helper';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';
import { filter, fromEvent, Subscription, take } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [HlmButtonImports, Login, Logout, RouterLink, HlmSeparatorImports, NgIcon, HlmIcon, Menu, ClickOutside, CommonModule],
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
    private router = inject(Router);
    mobileHelper = inject(MobileHelper);
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    sesionIniciada = this.authStore.sesionIniciada;
    logoutRunning = this.authStore.logoutRunning;
    callbackRunning = this.authStore.callbackRunning;

    menuAbierto = signal<boolean>(false);

    mostrarMovil = computed(() => {
        return this.mobileHelper.isMobile();
    });

    paginaSinMenuEstatico = computed(() => {
        return this.paginaSinMenuEstaticoHelper.paginaSinMenuEstatico();
    });

    ngOnInit() {
        this.authStore.backgroundRefresh();
    }

    toggleMenu() {
        if (this.menuAbierto()) {
            this.cerrarMenu();
        } else {
            this.abrirMenu();
        }
    }

    abrirMenu() {
        this.menuAbierto.set(true);
        history.pushState({ menuAbierto: true }, '');
        document.body.classList.add('overflow-hidden', 'md:pr-1.25');
    }

    cerrarMenu() {
        this.menuAbierto.set(false);
        if (history.state?.menuAbierto) {
            const { menuAbierto, ...rest } = history.state;
            history.replaceState(rest, '');
        }
        document.body.classList.remove('overflow-hidden', 'md:pr-1.25');
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event: PopStateEvent) {
        if (this.menuAbierto()) {
            this.cerrarMenu();
        }

        if (event.state && Object.keys(event.state).length === 0) {
            history.back();
        }
    }
}
