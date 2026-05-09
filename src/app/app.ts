import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { filter } from 'rxjs';
import { Menu } from './components/menu/menu';
import { AuthStore } from './services/auth-store';
import { RecaptchaHelper } from './helpers/recaptcha-helper';
import { MobileHelper } from './helpers/mobile-helper';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Menu],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    private recaptchHelper = inject(RecaptchaHelper);
    authStore = inject(AuthStore);
    mobileHelper = inject(MobileHelper);

    mostrarDesktop = computed(() => {
        return !this.mobileHelper.isMobile();
    });

    ngOnInit(): void {
        this.recaptchHelper.load();
    }
}
