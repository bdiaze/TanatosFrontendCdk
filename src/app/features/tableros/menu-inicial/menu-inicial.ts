import { environment } from '@/environments/environment';
import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH1, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu-inicial',
    imports: [HlmH1, HlmH4, HlmP, NgIcon, HlmIcon, HlmItemImports, RouterLink],
    templateUrl: './menu-inicial.html',
    styleUrl: './menu-inicial.scss',
})
export class MenuInicial {
    urlCalendario = `${environment.urlImages}/images/calendario-reloj-blanco.png`;
    urlCaracteristicas = `${environment.urlImages}/images/caracteristicas-blanco.png`;
    urlComprobacionLista = `${environment.urlImages}/images/comprobacion-de-lista-blanco.png`;
    urlTienda = `${environment.urlImages}/images/tienda-blanco.png`;
}
