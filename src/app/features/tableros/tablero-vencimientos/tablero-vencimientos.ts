import { NormaSuscritaDao } from '@/app/daos/norma-suscrita-dao';
import { SalNormaSuscritaObtenerConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-con-vencimiento';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCalendarRange,
    lucideCircleAlert,
    lucideCircleCheck,
    lucideClockAlert,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButton } from '@spartan-ng/helm/button';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-tablero-vencimientos',
    imports: [
        NgIcon,
        HlmIcon,
        HlmH4,
        HlmP,
        HlmSpinnerImports,
        HlmSeparatorImports,
        HlmItemImports,
        HlmButton,
        DatePipe,
        RouterLink,
        HlmAlertImports,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
        HlmSkeletonImports,
    ],
    templateUrl: './tablero-vencimientos.html',
    styleUrl: './tablero-vencimientos.scss',
    providers: [
        provideIcons({
            lucideCalendarRange,
            lucideClockAlert,
            lucideCircleAlert,
            lucideCircleCheck,
        }),
    ],
})
export class TableroVencimientos {
    normaSuscritaDao: NormaSuscritaDao = inject(NormaSuscritaDao);
    negocioStore = inject(NegocioStore);

    normasVencidas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    normasFuturas = signal([] as SalNormaSuscritaObtenerConVencimiento[]);
    cargando = signal(true);
    error = signal('');

    constructor() {
        effect(() => {
            if (this.negocioStore.negocioSeleccionado()) {
                this.obtenerTodos();
            }
        });
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.normasVencidas.set([]);
        this.normasFuturas.set([]);

        this.normaSuscritaDao
            .obtenerConVencimiento(this.negocioStore.negocioSeleccionado()?.id!)
            .subscribe({
                next: (res) => {
                    const sorted = res.sort(
                        (a, b) =>
                            new Date(a.fechaVencimiento).getTime() -
                            new Date(b.fechaVencimiento).getTime(),
                    );

                    const ahora = new Date();
                    this.normasVencidas.set(
                        sorted.filter(
                            (x) => new Date(x.fechaVencimiento).getTime() <= ahora.getTime(),
                        ),
                    );
                    this.normasFuturas.set(
                        sorted.filter(
                            (x) => new Date(x.fechaVencimiento).getTime() > ahora.getTime(),
                        ),
                    );
                },
                error: (err) => {
                    console.error('Error al obtener los vencimientos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los vencimientos');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    haceCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha);
        return `${diferencia.length > 0 ? 'Hace ' + diferencia : 'Recién'}`;
    }

    enCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha);
        return `${diferencia.length > 0 ? 'En ' + diferencia : 'Ahora'}`;
    }

    diferenciaConFechaActual(strFecha: string): string {
        const fecha: Date = new Date(strFecha);
        const ahora: Date = new Date();

        // Se determina la fecha de inicio y fin según la fecha mayor...
        const fechaFutura = fecha > ahora;
        let inicio = fechaFutura ? ahora : fecha;
        let fin = fechaFutura ? fecha : ahora;

        // Se calcula la diferencia en años...
        let annos = fin.getFullYear() - inicio.getFullYear();
        const checkAnno = new Date(inicio);
        checkAnno.setFullYear(inicio.getFullYear() + annos);
        if (checkAnno > fin) {
            annos--;
        }

        if (annos >= 1) {
            return `${annos} ${annos === 1 ? 'año' : 'años'}`;
        }

        // Se calcula la diferencia en meses...
        let meses =
            (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
        const checkMes = new Date(inicio);
        checkMes.setMonth(inicio.getMonth() + meses);
        if (checkMes > fin) {
            meses--;
        }

        if (meses >= 1) {
            return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
        }

        // Se calcula la diferencia para semanas, días, horas, minutos y segundos...
        const diffMs = fin.getTime() - inicio.getTime();

        const unidades = [
            { unit: 'semana', ms: 1000 * 60 * 60 * 24 * 7 },
            { unit: 'día', ms: 1000 * 60 * 60 * 24 },
            { unit: 'hora', ms: 1000 * 60 * 60 },
            { unit: 'minuto', ms: 1000 * 60 },
            { unit: 'segundo', ms: 1000 },
        ];

        for (const u of unidades) {
            const valor = Math.floor(diffMs / u.ms);
            if (valor >= 1) {
                return `${valor} ${valor === 1 ? u.unit : u.unit + 's'}`;
            }
        }

        return '';
    }
}
