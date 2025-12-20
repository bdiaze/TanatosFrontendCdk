import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

import '@/app/helpers/locales';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        { provide: LOCALE_ID, useValue: 'es-CL' },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
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
            labelWeekday: (i) =>
                ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][i],
            firstDayOfWeek: () => 1,
            formatYear: (year) => year.toString(),
            formatMonth: (month) => month.toString(),
            months: () => [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
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
    ],
};
