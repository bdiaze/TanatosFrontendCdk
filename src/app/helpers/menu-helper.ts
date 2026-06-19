import { DestroyRef, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { AuthStore } from '../services/auth-store';
import { NegocioDao } from '../daos/negocio-dao';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class MenuHelper {
    private readonly destroyRef = inject(DestroyRef);

    private readonly authStore = inject(AuthStore);
    private readonly negocioDao = inject(NegocioDao);

    private readonly logicaEjecutada = signal(false);

    constructor() {
        effect(() => {
            const logicaEjecutada = this.logicaEjecutada();
            const sesionIniciada = this.authStore.sesionIniciada();

            untracked(() => {
                if (logicaEjecutada && sesionIniciada) {
                    this.obtenerNegocios();
                    this.obtenerInformacionUsuario();
                }
            });
        });
    }

    ejecutar() {
        this.logicaEjecutada.set(true);
    }

    cargandoNegocios = signal<boolean>(false);
    obtenerNegocios() {
        this.cargandoNegocios.set(true);
        this.negocioDao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({})
            .add(() => {
                this.cargandoNegocios.set(false);
            });
    }

    cargandoInformacionUsuario = signal<boolean>(false);
    obtenerInformacionUsuario() {
        this.cargandoInformacionUsuario.set(true);
        this.negocioDao
            .obtenerInformacionUsuario()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({})
            .add(() => {
                this.cargandoInformacionUsuario.set(false);
            });
    }

    private onAbrirMenu?: () => void;

    registrarAbrirMenu(fn: (() => void) | undefined): void {
        this.onAbrirMenu = fn;
    }

    abrirMenu(): void {
        this.onAbrirMenu?.();
    }

    private onCerrarMenu?: () => void;

    registrarCerrarMenu(fn: (() => void) | undefined): void {
        this.onCerrarMenu = fn;
    }

    cerrarMenu(): void {
        this.onCerrarMenu?.();
    }
}
