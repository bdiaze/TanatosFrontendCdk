import { PwaUpdate } from '@/app/services/pwa-update';
import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-update-notification',
    imports: [HlmP, HlmH4, HlmButtonImports, NgIcon, HlmIcon],
    templateUrl: './update-notification.html',
    styleUrl: './update-notification.scss',
    providers: [
        provideIcons({
            lucideRefreshCw,
        }),
    ],
})
export class UpdateNotification {
    protected readonly pwaUpdate = inject(PwaUpdate);

    protected async update(): Promise<void> {
        await this.pwaUpdate.activateUpdate();
    }
}
