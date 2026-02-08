import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { filter } from 'rxjs';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements AfterViewInit {
    protected readonly title = signal('tanatos-frontend');

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

    private router = inject(Router);

    ngAfterViewInit(): void {
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
            this.scrollContainer.nativeElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }
}
