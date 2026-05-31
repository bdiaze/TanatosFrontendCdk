import { afterNextRender, AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { filter } from 'rxjs';
import { Menu } from './components/menu/menu';
import { AuthStore } from './services/auth-store';
import { RecaptchaHelper } from './helpers/recaptcha-helper';
import { MobileHelper } from './helpers/mobile-helper';
import { ListonBeta } from './components/liston-beta/liston-beta';
import { PaginaSinMenuEstaticoHelper } from './helpers/pagina-sin-menu-estatico-helper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { AuthRefreshService } from './services/auth-refresh-service';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Menu, ListonBeta],
    templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
    private readonly destroyRef = inject(DestroyRef);
    private readonly recaptchHelper = inject(RecaptchaHelper);
    private readonly router = inject(Router);
    private readonly viewportScroller = inject(ViewportScroller);

    authStore = inject(AuthStore);
    authRefreshService = inject(AuthRefreshService);
    mobileHelper = inject(MobileHelper);
    paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);

    mostrarDesktop = computed(() => {
        return !this.mobileHelper.isMobile();
    });

    paginaSinMenuEstatico = computed(() => {
        return this.paginaSinMenuEstaticoHelper.paginaSinMenuEstatico();
    });

    ngOnInit(): void {
        this.recaptchHelper.load();
        this.authRefreshService.backgroundRefresh();
    }

    private observer?: ResizeObserver;
    ngOnDestroy() {
        this.observer?.disconnect();
    }

    constructor() {
        afterNextRender(() => {
            const header = document.querySelector('app-header');
            if (!header) return;

            this.observer = new ResizeObserver(([entry]) => {
                this.viewportScroller.setOffset([0, entry.contentRect.height]);
            });

            this.observer.observe(header);
        });

        // Se añade custom scroll para que solo se mueva a top 0 cuando nos movemos a una nueva navigation...
        history.scrollRestoration = 'manual';
        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((e: NavigationEnd) => {
                window.scrollTo({ top: 0, behavior: 'instant' });
            });
    }
}
