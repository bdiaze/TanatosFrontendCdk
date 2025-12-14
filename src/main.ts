import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const url = new URL(window.location.href);

if (url.pathname === '/callback') {
    const newUrl = `/#/callback${url.search}`;
    console.log(`Redirigiendo a ${newUrl}`);
    window.location.replace(newUrl);
} else if (url.pathname === '/logout') {
    const newUrl = `/#/logout${url.search}`;
    console.log(`Redirigiendo a ${newUrl}`);
    window.location.replace(newUrl);
} else {
    bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
