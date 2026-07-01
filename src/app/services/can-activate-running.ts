import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CanActivateRunning {
    running = signal<boolean>(false);
}
