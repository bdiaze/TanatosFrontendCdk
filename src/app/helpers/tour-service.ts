import { inject, Injectable } from '@angular/core';
import { Config, driver, Driver, DriveStep } from 'driver.js';
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
    };

    iniciarTour(pasos: DriveStep[], onFinish?: () => void): void {
        this.driverInstance?.destroy();

        if (!pasos?.length) return;

        this.driverInstance = driver({
            ...this.config,
            steps: pasos,
            onDestroyed: () => {
                this.driverInstance = null;
                onFinish?.();
            },
        });

        this.driverInstance.drive();
    }

    detener(): void {
        this.driverInstance?.destroy();
    }
}
