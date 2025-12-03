import { AuthStore } from '@services/auth-store';
import { Component, inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit {
    private authStore = inject(AuthStore);
    sesionIniciada = this.authStore.sesionIniciada;

    ngOnInit(): void {
        this.authStore.backgroundRefresh();
    }
}
