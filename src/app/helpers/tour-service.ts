import { DestroyRef, inject, Injectable } from '@angular/core';
import { Config, driver, Driver, DriveStep } from 'driver.js';
import { MenuHelper } from './menu-helper';
import { HistoryService } from '../services/history-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    private readonly destroyRef = inject(DestroyRef);
    private readonly menuHelper = inject(MenuHelper);
    private readonly historyService = inject(HistoryService);

    private driverInstance: Driver | null = null;

    constructor() {
        this.historyService.popState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
            this.detener();
        });
    }

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
                this.historyService.removerEstado('tourRunning');
                this.driverInstance = null;
                onFinish?.();
            },
        });

        this.historyService.registrarEstado('tourRunning');
        this.driverInstance.drive();
    }

    detener(): void {
        this.driverInstance?.destroy();
    }
}
