import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    private readonly popStateSubject = new Subject();
    readonly popState$ = this.popStateSubject.asObservable();

    private readonly estados: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('popstate', (event) => {
            // Nota: event.state corresponde al nuevo state...
            console.log(event);
            let state = event.state;

            // Si es un state con atributo del service, se quitan todos los estados que estén marcados con false...
            if (state && state['eventoHistoryService']) {
                for (const [estado, valor] of Object.entries(this.estados)) {
                    if (!valor && state[estado]) {
                        const { [estado]: valor, ...rest } = state;
                        state = rest;
                        history.replaceState(rest, '');
                    }
                }

                // Si solo queda el atributo del service, se deja la state como vacío...
                if (Object.keys(state).length === 1) {
                    const { ['eventoHistoryService']: valor, ...rest } = state;
                    state = rest;
                    history.replaceState(rest, '');
                }
            }

            // Si el state está vacío, se avanza en el history con .back()...
            // En caso contrario (el state no está vacío), se gatillan las suscripciones...
            if (!state || Object.keys(state).length === 0) {
                history.back();
            } else {
                this.popStateSubject.next(state);
            }
        });
    }

    registrarEstado(nombreEstado: string) {
        // Se registra el nuevo estado en variable...
        this.estados[nombreEstado] = true;

        // Si no hay states o no existe el atributo del service, se crea nuevo state con estado...
        // En caso contrario (hay state con atributo del service), si no existe el estado, se añade al state existente...
        const state = history.state;
        if (!state || !state['eventoHistoryService']) {
            // Y se añade nuevo state con dicho estado...
            history.pushState(
                {
                    ['eventoHistoryService']: true,
                    [nombreEstado]: true,
                },
                '',
            );
        } else if (!state[nombreEstado]) {
            history.replaceState(
                {
                    ...state,
                    [nombreEstado]: true,
                },
                '',
            );
        }
    }

    removerEstado(nombreEstado: string) {
        // Se deja el estado como eliminado en variable...
        this.estados[nombreEstado] = false;

        // Si estoy en un state del service, y existe el estado, se elimina...
        const state = history.state;
        if (state && state['eventoHistoryService'] && state[nombreEstado]) {
            const { [nombreEstado]: valor, ...rest } = state;
            history.replaceState(rest, '');
        }
    }
}
