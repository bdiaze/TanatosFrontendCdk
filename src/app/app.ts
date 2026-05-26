import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
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
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Menu, ListonBeta],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    private destroyRef = inject(DestroyRef);
    private recaptchHelper = inject(RecaptchaHelper);
    private router = inject(Router);

    authStore = inject(AuthStore);
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
    }

    constructor() {
        // Se añade custom scroll para que solo se mueva a top 0 cuando nos movemos a una nueva navigation...
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
