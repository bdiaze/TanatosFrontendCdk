import { AuthStore } from '@services/auth-store';
import { Component, computed, DestroyRef, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { FadeIn } from '@/app/directives/fade-in';
import { MenuHelper } from '@/app/helpers/menu-helper';
import { HistoryService } from '@/app/services/history-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    imports: [HlmButtonImports, Login, Logout, RouterLink, HlmSeparatorImports, NgIcon, HlmIcon, Menu, ClickOutside, CommonModule, FadeIn],
    templateUrl: './header.html',
    providers: [
        provideIcons({
            lucideMenu,
        }),
    ],
})
export class Header implements OnInit, OnDestroy {
    urlLogo = `${environment.urlImages}/images/logo.svg`;

    private readonly destroyRef = inject(DestroyRef);
    private readonly authStore = inject(AuthStore);
    private readonly mobileHelper = inject(MobileHelper);
    private readonly paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);
    private readonly menuHelper = inject(MenuHelper);
    private readonly historyService = inject(HistoryService);

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

    constructor() {
        this.historyService.popState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
            if (this.menuAbierto()) {
                this.cerrarMenu();
            }
        });
    }

    ngOnInit(): void {
        this.menuHelper.registrarAbrirMenu(() => this.abrirMenu());
        this.menuHelper.registrarCerrarMenu(() => this.cerrarMenu());
    }

    ngOnDestroy(): void {
        this.menuHelper.registrarAbrirMenu(undefined);
        this.menuHelper.registrarCerrarMenu(undefined);
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
        this.historyService.registrarEstado('menuAbierto');
        document.body.classList.add('overflow-hidden!', 'md:pr-1.25');
    }

    cerrarMenu() {
        this.menuAbierto.set(false);
        this.historyService.removerEstado('menuAbierto');
        document.body.classList.remove('overflow-hidden!', 'md:pr-1.25');
    }
}
