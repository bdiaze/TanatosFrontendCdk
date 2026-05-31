import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MobileHelper {
    private readonly mqMd = window.matchMedia('(min-width: 48rem)');
    readonly mdUp = signal(this.mqMd.matches);

    constructor() {
        this.mqMd.addEventListener('change', (e) => {
            this.mdUp.set(e.matches);
        });
    }

    readonly isMobile = computed(() => !this.mdUp());
}
