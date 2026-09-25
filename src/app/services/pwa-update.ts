import { inject, Injectable, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PwaUpdate {
    private readonly swUpdate = inject(SwUpdate);

    readonly updateAvailable = signal(false);

    private readonly newVersion = signal<string | null>(null);

    constructor() {
        if (!this.swUpdate.isEnabled) {
            return;
        }

        this.swUpdate.versionUpdates.pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')).subscribe((event) => {
            console.log('Nueva versión descargada:', event.latestVersion.hash);
            this.newVersion.set(event.latestVersion.hash);
            this.updateAvailable.set(true);
        });
    }

    async checkForUpdate(): Promise<void> {
        if (!this.swUpdate.isEnabled) {
            return;
        }

        try {
            console.log('Verificando por nueva versión de PWA...');
            await this.swUpdate.checkForUpdate();
            console.log('Verificación de versión de PWA finalizada');
        } catch (error) {
            console.error('Error al verificar nueva versión de PWA', error);
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
