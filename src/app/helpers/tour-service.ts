import { DestroyRef, inject, Injectable } from '@angular/core';
import { Config, driver, Driver, DriveStep, State } from 'driver.js';
import { HistoryService } from '../services/history-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    private readonly destroyRef = inject(DestroyRef);
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
        progressText: '{{current}} de {{total}}',
        showProgress: true,
        popoverClass: 'popover-tour',
        showButtons: ['next', 'previous', 'close'],
        disableActiveInteraction: true,
        overlayClickBehavior: () => {},
    };

    iniciarTour({
        pasos,
        onFinish,
        showProgress = true,
        doneBtnText = '¡Listo!',
        onNextFromLast,
    }: {
        pasos: DriveStep[];
        onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
        showProgress?: boolean;
        doneBtnText?: string;
        onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
    }): void {
        this.driverInstance?.destroy();

        if (!pasos?.length) return;

        this.driverInstance = driver({
            ...this.config,
            steps: pasos,
            showProgress: showProgress,
            doneBtnText: doneBtnText,
            onDestroyed: (element: Element | undefined, step: DriveStep, options: any) => {
                this.historyService.removerEstado('tourRunning');
                this.driverInstance = null;
                onFinish?.(element, step, options);
            },
            onNextClick: (element: Element | undefined, step: DriveStep, options: any) => {
                const currentIndex = pasos.findIndex(
                    (s) => s.element === step.element && s.popover?.title === step.popover?.title && s.popover?.description === step.popover?.description,
                );
                const isLastStep = currentIndex === pasos.length - 1;
                if (isLastStep) {
                    onNextFromLast?.(element, step, options);
                }
                this.driverInstance?.moveNext();
            },
        });

        this.historyService.registrarEstado('tourRunning');
        this.driverInstance.drive();
    }

    detener(): void {
        this.driverInstance?.destroy();
    }
}
