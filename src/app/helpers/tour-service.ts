import { inject, Injectable } from '@angular/core';
import { Config, driver, Driver } from 'driver.js';
import { ObtenerSteps, TourModule } from './tour-steps';
import { MenuHelper } from './menu-helper';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    private readonly menuHelper = inject(MenuHelper);

    private driverInstance: Driver | null = null;

    private readonly config: Partial<Config> = {
        animate: true,
        smoothScroll: false,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: '¡Listo!',
        progressText: '{{current}} de {{total}}',
        showProgress: true,
        popoverClass: 'popover-tour',
        showButtons: ['next', 'previous'],
        disableActiveInteraction: true,
        onHighlightStarted: () => {},
        onDestroyed: () => {
            this.driverInstance = null;
        },
    };

    iniciarTour(modulo: TourModule): void {
        this.driverInstance?.destroy();

        const pasos = ObtenerSteps(this.menuHelper)[modulo];
        if (!pasos?.length) return;

        const pasosValidos = pasos.filter((paso) => {
            if (!paso.element) return true;
            const existe = !!document.querySelector(paso.element as string);
            if (!existe) {
                console.warn(`[TourService] Elemento no encontrado, paso omitido: ${paso.element as string}`);
            }
            return existe;
        });

        if (!pasosValidos.length) return;

        this.driverInstance = driver({
            ...this.config,
            steps: pasosValidos,
        });

        this.driverInstance.drive();
    }

    detener(): void {
        this.driverInstance?.destroy();
    }
}
