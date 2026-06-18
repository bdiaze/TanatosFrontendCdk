import { computed, Injectable, signal } from '@angular/core';
import { SalNegocio } from '../entities/others/sal-negocio';
import { getCookie } from '../helpers/cookie-helper';
import { SalNegocioInformacionUsuario } from '../entities/others/sal-negocio-informacion-usuario';
import { SalSuscripcion } from '../entities/others/sal-suscripcion';

@Injectable({
    providedIn: 'root',
})
export class NegocioStore {
    negocioSeleccionado = signal<SalNegocio | null>(null);
    negociosUsuario = signal<SalNegocio[]>([]);
    informacionUsuario = signal<SalNegocioInformacionUsuario | null>(null);
    suscripcionesUsuario = signal<SalSuscripcion[]>([]);

    suscripcionActualUsuario = computed(() => {
        const suscripciones = this.suscripcionesUsuario();

        // Buscamos la suscripción con mayor expiración...
        const suscripcionesConFechaExpiracion = suscripciones.filter((s) => s.fechaExpiracion && new Date(s.fechaExpiracion) > new Date());
        if (suscripcionesConFechaExpiracion.length > 0) {
            const mayorExpiracion = suscripcionesConFechaExpiracion.reduce((max, actual) =>
                new Date(actual.fechaExpiracion!) > new Date(max.fechaExpiracion!) ? actual : max,
            );
            if (mayorExpiracion) return mayorExpiracion;
        }

        return null;
    });

    suscripcionActualGratuita = computed(() => {
        const suscripcionActual = this.suscripcionActualUsuario();
        if (!suscripcionActual) return null;

        if (suscripcionActual.precioPlan === 0) {
            return suscripcionActual;
        }

        return null;
    });
}
