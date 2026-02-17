import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { filter } from 'rxjs';
import { Menu } from './components/menu/menu';
import { AuthStore } from './services/auth-store';
import { RecaptchaHelper } from './helpers/recaptcha-helper';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Menu],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    protected readonly title = signal('tanatos-frontend');

    private recaptchHelper = inject(RecaptchaHelper);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private authStore = inject(AuthStore);
    sesionIniciada = this.authStore.sesionIniciada;
    logoutRunning = this.authStore.logoutRunning;

    ngOnInit(): void {
        this.recaptchHelper.load();
    }
}
