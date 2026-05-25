import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PaginaSinMenuEstaticoHelper {
    paginaSinMenuEstatico = signal(false);

    quitarMenuEstatico() {
        this.paginaSinMenuEstatico.set(true);
    }
    mostrarMenuEstatico() {
        this.paginaSinMenuEstatico.set(false);
    }
}
