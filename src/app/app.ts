import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { Sidebar } from './components/sidebar/sidebar';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Sidebar],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    protected readonly title = signal('tanatos-frontend');

    ngOnInit() {
        const url = new URL(window.location.href);

        if (url.pathname === '/callback') {
            const newUrl = `/#/callback${url.search}`;
            console.log(`Redirigiendo a ${newUrl}`);
            window.location.replace(newUrl);
        } else if (url.pathname === '/logout') {
            const newUrl = `/#/logout${url.search}`;
            console.log(`Redirigiendo a ${newUrl}`);
            window.location.replace(newUrl);
        }
    }
}
