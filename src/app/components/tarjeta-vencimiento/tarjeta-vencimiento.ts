import { SalNormaSuscritaObtenerConVencimiento } from '@/app/entities/others/sal-norma-suscrita-obtener-con-vencimiento';
import { PlainTextPipe } from '@/app/pipes/plain-text-pipe';
import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardList, lucideUser } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import dayjs from 'dayjs';

@Component({
    selector: 'tarjeta-vencimiento',
    imports: [NgIcon, HlmIcon, RouterLink, HlmItemImports, HlmBadgeImports, HlmTooltipImports, DatePipe, PlainTextPipe],
    templateUrl: './tarjeta-vencimiento.html',
    styleUrl: './tarjeta-vencimiento.scss',
    providers: [
        provideIcons({
            lucideUser,
            lucideClipboardList,
        }),
    ],
})
export class TarjetaVencimiento {
    vencimiento = input.required<SalNormaSuscritaObtenerConVencimiento>();
    variant = input<'vencido' | 'futuro' | 'completado'>('futuro');

    badgeVariant = computed(() => {
        switch (this.variant()) {
            case 'vencido':
                return 'destructive';
            default:
                return 'default';
        }
    });

    badgeText = computed(() => {
        const fechaVencimiento = this.vencimiento().fechaVencimiento;
        switch (this.variant()) {
            case 'vencido':
                return this.haceCuanto(fechaVencimiento);
            case 'futuro':
                return this.enCuanto(fechaVencimiento);
            default:
                return 'Completada';
        }
    });

    haceCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha);
        return `${diferencia.length > 0 ? 'Hace ' + diferencia : 'Recién'}`;
    }

    enCuanto(strFecha: string): string {
        const diferencia = this.diferenciaConFechaActual(strFecha, true);
        return `${diferencia.length > 0 ? 'Menos de ' + diferencia : 'Ahora'}`;
    }

    diferenciaConFechaActual(strFecha: string, aproxSuperior = false): string {
        const fecha: Date = new Date(strFecha);
        const ahora: Date = new Date();

        // Se determina la fecha de inicio y fin según la fecha mayor...
        const fechaFutura = fecha > ahora;
        let inicio = fechaFutura ? ahora : fecha;
        let fin = fechaFutura ? fecha : ahora;

        const inicioDayJS = dayjs(inicio);
        const finDayJS = dayjs(fin);

        const diffInYears = finDayJS.diff(inicioDayJS, 'year', true);
        if (!aproxSuperior) {
            const annos = Math.floor(diffInYears);
            if (annos >= 1) {
                return `${annos} ${annos === 1 ? 'año' : 'años'}`;
            }
        } else {
            const annos = Math.ceil(diffInYears);
            if (annos > 1) {
                return `${annos} años`;
            }
        }

        const diffInMonths = finDayJS.diff(inicioDayJS, 'month', true);
        if (!aproxSuperior) {
            const meses = Math.floor(diffInMonths);
            if (meses >= 1) {
                return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
            }
        } else {
            const meses = Math.ceil(diffInMonths);
            if (meses == 12) {
                return `un año`;
            } else if (meses > 1) {
                return `${meses} meses`;
            }
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

        if (!aproxSuperior) {
            for (const u of unidades) {
                const valor = Math.floor(diffMs / u.ms);
                if (valor >= 1) {
                    return `${valor} ${valor === 1 ? u.unit : u.unit + 's'}`;
                }
            }
        } else {
            for (const [index, u] of unidades.entries()) {
                const valor = Math.ceil(diffMs / u.ms);
                if (index > 0 && valor * u.ms == unidades[index - 1].ms) {
                    return `un${[0, 2].includes(index - 1) ? 'a' : ''} ${unidades[index - 1].unit}`;
                } else if (valor > 1) {
                    return `${valor} ${u.unit + 's'}`;
                }
            }
        }

        return '';
    }
}
