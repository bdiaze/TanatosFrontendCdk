import { PlanDao } from '@/app/daos/plan-dao';
import { SuscripcionDao } from '@/app/daos/suscripcion-dao';
import { SalPlan } from '@/app/entities/others/sal-plan';
import { SalSuscripcion } from '@/app/entities/others/sal-suscripcion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarRange, lucideCreditCard, lucideDot, lucideGem } from '@ng-icons/lucide';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-suscripcion',
    imports: [
        NgIcon,
        HlmIcon,
        HlmP,
        HlmH3,
        HlmH4,
        HlmSpinnerImports,
        HlmSeparatorImports,
        DatePipe,
        DecimalPipe,
        HlmItemImports,
        HlmAlertImports,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
        HlmBreadCrumbImports,
    ],
    templateUrl: './mantenedor-suscripcion.html',
    styleUrl: './mantenedor-suscripcion.scss',
    providers: [
        provideIcons({
            lucideCreditCard,
            lucideGem,
            lucideDot,
        }),
    ],
})
export class MantenedorSuscripcion implements OnInit {
    private suscripcionDao: SuscripcionDao = inject(SuscripcionDao);
    private planDao: PlanDao = inject(PlanDao);
    negocioStore: NegocioStore = inject(NegocioStore);

    suscripciones = signal([] as SalSuscripcion[]);
    planesVigentes = signal([] as SalPlan[]);
    ultimaSuscripcion = computed(() => {
        const suscripciones = this.suscripciones();

        // Buscamos la suscripción con mayor expiración...
        const suscripcionesConFechaExpiracion = suscripciones.filter((s) => s.fechaExpiracion);
        if (suscripcionesConFechaExpiracion.length > 0) {
            const mayorExpiracion = suscripcionesConFechaExpiracion.reduce((max, actual) =>
                new Date(actual.fechaExpiracion!) > new Date(max.fechaExpiracion!) ? actual : max,
            );
            if (mayorExpiracion) return mayorExpiracion;
        }

        return null;
    });
    esPlanEmpresa = computed(() => {
        const ultimaSuscripcion = this.ultimaSuscripcion();
        if (
            ultimaSuscripcion &&
            ultimaSuscripcion.estado === 1 /* Activa */ &&
            ultimaSuscripcion.fechaExpiracion &&
            new Date(ultimaSuscripcion.fechaExpiracion) > new Date()
        ) {
            return true;
        }
        return false;
    });
    planes = computed(() => {
        const planesVigentes = this.planesVigentes();
        const suscripciones = this.suscripciones();
        return planesVigentes.filter(
            (p) => !p.suscripcionUnica || !suscripciones.some((s) => s.idPlan == p.id),
        );
    });

    cargandoSuscripciones = signal(true);
    cargandoPlanesVigentes = signal(true);
    error = signal('');

    ngOnInit(): void {
        this.obtenerSuscripciones();
        this.obtenerPlanesVigentes();
    }

    obtenerSuscripciones() {
        this.cargandoSuscripciones.set(true);
        this.suscripciones.set([]);

        this.suscripcionDao
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    this.suscripciones.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener las suscripciones del cliente', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener las suscripciones del cliente',
                    );
                },
            })
            .add(() => {
                this.cargandoSuscripciones.set(false);
            });
    }

    obtenerPlanesVigentes() {
        this.cargandoPlanesVigentes.set(true);
        this.planesVigentes.set([]);
        this.planDao
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.precio - b.precio);
                    this.planesVigentes.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener los planes vigentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los planes vigentes');
                },
            })
            .add(() => {
                this.cargandoPlanesVigentes.set(false);
            });
    }
}
