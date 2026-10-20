import { Injectable, signal } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { SalSuscripcionResumen } from '../entities/others/sal-suscripcion-resumen';
import { SalPerfil } from '../entities/others/sal-perfil';

@Injectable({
    providedIn: 'root',
})
export class NegocioStore {
    negocioSeleccionado = signal<SalNegocio | null>(null);
    negociosUsuario = signal<SalNegocio[]>([]);
    informacionUsuario = signal<SalPerfil | null>(null);
    resumenSuscripcionUsuario = signal<SalSuscripcionResumen | null>(null);
}
