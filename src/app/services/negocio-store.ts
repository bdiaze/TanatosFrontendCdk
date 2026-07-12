import { computed, Injectable, signal } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { SalNegocioInformacionUsuario } from '../entities/others/sal-negocio-informacion-usuario';
import { SalSuscripcionResumen } from '../entities/others/sal-suscripcion-resumen';

@Injectable({
    providedIn: 'root',
})
export class NegocioStore {
    negocioSeleccionado = signal<SalNegocio | null>(null);
    negociosUsuario = signal<SalNegocio[]>([]);
    informacionUsuario = signal<SalNegocioInformacionUsuario | null>(null);
    resumenSuscripcionUsuario = signal<SalSuscripcionResumen | null>(null);
}
