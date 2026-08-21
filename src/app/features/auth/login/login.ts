import { AuthRefreshService } from '@/app/services/auth-refresh-service';
import { AuthStore } from '@/app/services/auth-store';
import { RedirectToLogin } from '@/app/services/redirect-to-login';
import { Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-login',
    imports: [HlmButtonImports, HlmSpinnerImports],
    templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
    @Input() vertical: boolean = false;

    private readonly authStore = inject(AuthStore);
    private readonly authRefreshService = inject(AuthRefreshService);
    private readonly redirectToLogin = inject(RedirectToLogin);

    backgroundRefreshRunning = this.authRefreshService.backgroundRefreshRunning;
    callbackRunning = this.authStore.callbackRunning;
    iniciandoSesion = signal<boolean>(false);
    registrandose = signal<boolean>(false);

    mostrarCargandoInicioSesion = computed(() => {
        return this.iniciandoSesion();
    });

    mostrarCargandoRegistrarse = computed(() => {
        return this.registrandose();
    });

    deshabilitarBoton = computed<boolean>(() => {
        return this.iniciandoSesion() || this.registrandose() || this.backgroundRefreshRunning() || this.callbackRunning();
    });

    ngOnInit() {
        window.addEventListener('pageshow', this.onPageShow);
    }

    ngOnDestroy() {
        window.removeEventListener('pageshow', this.onPageShow);
    }

    onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
            this.iniciandoSesion.set(false);
            this.registrandose.set(false);
        }
    };

    async iniciarSesion(registrarse: boolean = false) {
        if (!registrarse) {
            this.iniciandoSesion.set(true);
        } else {
            this.registrandose.set(true);
        }
        await this.redirectToLogin.redireccionarALogin(registrarse ? 'signup' : 'login');
    }
}
