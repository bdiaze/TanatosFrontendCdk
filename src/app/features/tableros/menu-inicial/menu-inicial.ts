import { environment } from '@/environments/environment';
import { Component, inject } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH1, HlmP } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';
import { NegocioStore } from '@/app/services/negocio-store';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-menu-inicial',
    imports: [HlmH1, HlmP, HlmItemImports, RouterLink, HlmSpinnerImports, HlmSkeletonImports],
    templateUrl: './menu-inicial.html',
    styleUrl: './menu-inicial.scss',
})
export class MenuInicial {
    urlCalendario = `${environment.urlImages}/images/calendario-reloj-blanco.png`;
    urlCaracteristicas = `${environment.urlImages}/images/caracteristicas-blanco.png`;
    urlComprobacionLista = `${environment.urlImages}/images/comprobacion-de-lista-blanco.png`;
    urlTienda = `${environment.urlImages}/images/tienda-blanco.png`;

    negocioStore = inject(NegocioStore);
    negocioSeleccionado = this.negocioStore.negocioSeleccionado;
    informacionUsuario = this.negocioStore.informacionUsuario;
}
