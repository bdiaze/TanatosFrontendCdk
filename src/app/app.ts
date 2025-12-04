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
export class App {
    protected readonly title = signal('tanatos-frontend');
}
