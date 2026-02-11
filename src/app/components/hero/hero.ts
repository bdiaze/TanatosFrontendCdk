import { environment } from '@/environments/environment';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmH1, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-hero',
    imports: [HlmH4, HlmP, HlmButtonImports, RouterLink],
    templateUrl: './hero.html',
    styleUrl: './hero.scss',
    host: {
        class: 'inline-block h-full w-full',
    },
})
export class Hero {
    urlFondo = `${environment.urlImages}/images/contenido-joven-sosteniendo-tableta-digital.jpg`;
    urlCalendario = `${environment.urlImages}/images/calendario-reloj.png`;
    urlMundo = `${environment.urlImages}/images/mundo.png`;
    urlTarea = `${environment.urlImages}/images/tarea.png`;
    urlFondo2 = `${environment.urlImages}/images/gerente-de-pequenas-empresas-en-su-taller.jpg`;
    urlFondo3 = `${environment.urlImages}/images/hombre-de-negocios-dueno-de-la-empresa-en-la-oficina.jpg`;
}
