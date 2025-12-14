import { Injectable, signal } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { getCookie } from '../helpers/cookie-helper';

@Injectable({
    providedIn: 'root',
})
export class NegocioStore {
    negocioSeleccionado = signal<SalNegocio | null>(null);
    negociosUsuario = signal<SalNegocio[]>([]);
}
