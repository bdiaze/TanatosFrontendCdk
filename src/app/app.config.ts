import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HttpBackend, HttpXhrBackend, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

import '@/app/helpers/locales';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { dedupInterceptor } from './interceptors/dedup-interceptor';
import { AppTitleStrategy } from './providers/app-title-strategy';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'disabled',
                anchorScrolling: 'enabled',
            }),
        ),
        {
            provide: TitleStrategy,
            useClass: AppTitleStrategy,
        },
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, dedupInterceptor])),
        { provide: HttpBackend, useClass: HttpXhrBackend },
        { provide: LOCALE_ID, useValue: 'es-CL' },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        provideBrnCalendarI18n({
            formatWeekdayName: (i) => ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'][i],
            formatHeader: (m, y) => {
                return new Intl.DateTimeFormat('es-CL', {
                    month: 'long',
                    year: 'numeric',
                })
                    .format(new Date(y, m))
                    .replace(' de ', ' ')
                    .replace(/^./, (c) => c.toLocaleUpperCase());
            },
            labelPrevious: () => 'Mes anterior',
            labelNext: () => 'Mes siguiente',
            labelWeekday: (i) => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][i],
            firstDayOfWeek: () => 1,
            formatYear: (year) => year.toString(),
            formatMonth: (month) => month.toString(),
            months: () => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            years: (startYear?: number, endYear?: number) => {
                if (!startYear) {
                    startYear = new Date().getFullYear();
                }
                if (!endYear) {
                    endYear = startYear! + 5;
                }

                const years: number[] = [];
                for (let y = startYear!; y <= endYear!; y++) {
                    years.push(y);
                }

                return years;
            },
        }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
