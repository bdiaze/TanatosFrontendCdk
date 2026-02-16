import { Component } from '@angular/core';
import { FormularioContacto } from '@/app/components/formulario-contacto/formulario-contacto';
import { environment } from '@/environments/environment';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMailbox } from '@ng-icons/lucide';
import { HlmH3 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-contacto',
    imports: [FormularioContacto, HlmIcon, NgIcon, HlmH3],
    templateUrl: './contacto.html',
    styleUrl: './contacto.scss',
    providers: [
        provideIcons({
            lucideMailbox,
        }),
    ],
})
export class Contacto {
    urlFondo1_640 = `${environment.urlImages}/images/retrato-de-una-mujer-morena-con-gafas-sentada-en-un-cafe/640.webp`;
    urlFondo1_960 = `${environment.urlImages}/images/retrato-de-una-mujer-morena-con-gafas-sentada-en-un-cafe/960.webp`;
    urlFondo1_1280 = `${environment.urlImages}/images/retrato-de-una-mujer-morena-con-gafas-sentada-en-un-cafe/1280.webp`;
    urlFondo1_1920 = `${environment.urlImages}/images/retrato-de-una-mujer-morena-con-gafas-sentada-en-un-cafe/1920.webp`;
}
