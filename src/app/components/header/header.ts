import { AuthStore } from '@services/auth-store';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    sesionIniciada = inject(AuthStore).sesionIniciada;
}
