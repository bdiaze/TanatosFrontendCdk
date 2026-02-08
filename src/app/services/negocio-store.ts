import { Injectable, signal } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { getCookie } from '../helpers/cookie-helper';
import { SalNegocioInformacionUsuario } from '../entities/others/sal-negocio-informacion-usuario';

@Injectable({
    providedIn: 'root',
})
export class NegocioStore {
    negocioSeleccionado = signal<SalNegocio | null>(null);
    negociosUsuario = signal<SalNegocio[]>([]);
    informacionUsuario = signal<SalNegocioInformacionUsuario | null>(null);
}
