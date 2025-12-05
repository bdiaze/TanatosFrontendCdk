import { AuthStore } from '@/app/services/auth-store';
import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { lucideChevronRight, lucideHouse, lucideSettings } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-sidebar',
    imports: [HlmSidebarImports, HlmCollapsibleImports, NgIcon, HlmIcon],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
    providers: [
        provideIcons({
            lucideHouse,
            lucideSettings,
            lucideChevronRight,
        }),
    ],
})
export class Sidebar {
    authStore = inject(AuthStore);

    sesionIniciada = this.authStore.sesionIniciada;
    accesoAdmin = computed<boolean>(() => {
        const claims = this.authStore.claims();
        if (claims && claims['cognito:groups'] && claims['cognito:groups'].includes('Admin')) {
            return true;
        }
        return false;
    });

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [];

        if (this.accesoAdmin()) {
            opciones.push({
                id: 2,
                tipo: 'group',
                titulo: 'Administración',
                items: [
                    {
                        id: 21,
                        tipo: 'item',
                        titulo: 'Mantenedores',
                        icon: 'lucideSettings',
                        items: [
                            {
                                id: 211,
                                tipo: 'subitem',
                                titulo: 'Tipo Receptor Notificación',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                        ],
                    },
                ],
            });
        }

        return opciones;
    });
}

export interface OpcionMenu {
    id: number;
    tipo: string;
    titulo: string;
    icon?: string;
    url?: string;
    items?: OpcionMenu[];
}
