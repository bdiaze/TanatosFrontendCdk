import { environment } from '@/environments/environment';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarClock, lucideEarth } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH1, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH4, HlmP, HlmButtonImports, RouterLink, HlmIcon, NgIcon],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
    host: {
        class: 'inline-block h-full w-full',
    },
    providers: [
        provideIcons({
            lucideCalendarClock,
            lucideEarth,
        }),
    ],
})
export class Hero {
    urlFondo1_640 = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital/640.webp`;
    urlFondo1_960 = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital/960.webp`;
    urlFondo1_1280 = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital/1280.webp`;
    urlFondo1_1920 = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital/1920.webp`;
    urlFondo1_2560 = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital/2560.webp`;

    urlTarea = `${environment.urlImages}/images/tarea.png`;

    urlFondo2_640 = `${environment.urlImages}/images/gerente-de-pequenas-empresas-en-su-taller/640.webp`;
    urlFondo2_960 = `${environment.urlImages}/images/gerente-de-pequenas-empresas-en-su-taller/960.webp`;
    urlFondo2_1280 = `${environment.urlImages}/images/gerente-de-pequenas-empresas-en-su-taller/1280.webp`;
    urlFondo2_1920 = `${environment.urlImages}/images/gerente-de-pequenas-empresas-en-su-taller/1920.webp`;

    urlFondo3_640 = `${environment.urlImages}/images/hombre-de-negocios-dueno-de-la-empresa-en-la-oficina/640.webp`;
    urlFondo3_960 = `${environment.urlImages}/images/hombre-de-negocios-dueno-de-la-empresa-en-la-oficina/960.webp`;
    urlFondo3_1280 = `${environment.urlImages}/images/hombre-de-negocios-dueno-de-la-empresa-en-la-oficina/1280.webp`;
    urlFondo3_1920 = `${environment.urlImages}/images/hombre-de-negocios-dueno-de-la-empresa-en-la-oficina/1920.webp`;
}
