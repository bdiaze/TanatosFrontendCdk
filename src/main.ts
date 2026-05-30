import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const url = new URL(window.location.href);

bootstrapApplication(App, appConfig)
    .then(() => {
        document.querySelector('app-root')?.classList.add('app-ready');
    })
    .catch((err) => console.error(err));
