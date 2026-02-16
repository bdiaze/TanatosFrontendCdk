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
export class App implements AfterViewInit, OnInit {
    protected readonly title = signal('tanatos-frontend');

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

    private recaptchHelper = inject(RecaptchaHelper);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private authStore = inject(AuthStore);
    sesionIniciada = this.authStore.sesionIniciada;
    logoutRunning = this.authStore.logoutRunning;

    ngAfterViewInit(): void {
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
            if (!this.route.snapshot.fragment) {
                this.scrollContainer.nativeElement.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        });

        this.route.fragment.subscribe((fragment) => {
            if (!fragment) return;

            setTimeout(() => {
                const header = document.querySelector('app-header');
                const headerHeight = header?.getBoundingClientRect().height ?? 0;

                const element = document.getElementById(fragment);
                if (element) {
                    const container = this.scrollContainer.nativeElement;
                    const offsetTop =
                        element.getBoundingClientRect().top -
                        container.getBoundingClientRect().top +
                        container.scrollTop -
                        headerHeight;

                    container.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth',
                    });
                }
            });
        });
    }

    ngOnInit(): void {
        this.recaptchHelper.load();
    }
}
