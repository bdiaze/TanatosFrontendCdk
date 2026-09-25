import { inject, Injectable, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, startWith, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PwaUpdate {
    private readonly swUpdate = inject(SwUpdate);

    readonly updateAvailable = signal(false);

    private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos

    constructor() {
        if (!this.swUpdate.isEnabled) {
            return;
        }

        this.swUpdate.versionUpdates.pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')).subscribe((event) => {
            console.log('Nueva versión descargada:', event.latestVersion.hash);
            this.updateAvailable.set(true);
        });

        interval(this.CHECK_INTERVAL)
            .pipe(startWith(0))
            .subscribe(() => {
                this.checkForUpdate();
            });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkForUpdate();
            }
        });
    }

    private updateCheckInProgress = false;

    private async checkForUpdate(): Promise<void> {
        if (!this.swUpdate.isEnabled || this.updateCheckInProgress) {
            return;
        }

        this.updateCheckInProgress = true;

        try {
            console.log('Verificando por nueva versión de PWA...');
            await this.swUpdate.checkForUpdate();
            console.log('Verificación de versión de PWA finalizada');
        } catch (error) {
            console.error('Error al verificar nueva versión de PWA', error);
        } finally {
            this.updateCheckInProgress = false;
        }
    }

    async activateUpdate(): Promise<void> {
        if (!this.swUpdate.isEnabled) {
            window.location.reload();
            return;
        }

        try {
            await this.swUpdate.activateUpdate();
        } catch (error) {
            console.error('Error al activar nueva versión de PWA', error);
        } finally {
            window.location.reload();
        }
    }
}
