import { AuthStore } from '@/app/services/auth-store';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    imports: [],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    authStore = inject(AuthStore);

    mostrarMenu = signal<boolean>(false);

    sesionIniciada = this.authStore.sesionIniciada;
    accesoAdmin = computed<boolean>(() => {
        const claims = this.authStore.claims();
        if (claims && claims['cognito:groups'] && claims['cognito:groups'].includes('Admin')) {
            return true;
        }
        return false;
    });

    mostrarOcultar() {
        this.mostrarMenu.update((oldValue) => !oldValue);
    }
}
