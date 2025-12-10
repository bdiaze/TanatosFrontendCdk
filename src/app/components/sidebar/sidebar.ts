import { AuthStore } from '@/app/services/auth-store';
import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { lucideChevronRight, lucideHouse, lucideSend, lucideSettings } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [HlmSidebarImports, HlmCollapsibleImports, NgIcon, HlmIcon, RouterLink],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
    providers: [
        provideIcons({
            lucideHouse,
            lucideSettings,
            lucideChevronRight,
            lucideSend,
        }),
    ],
})
export class Sidebar {
    authStore = inject(AuthStore);
    sidebarService = inject(HlmSidebarService);

    sesionIniciada = this.authStore.sesionIniciada;
    accesoAdmin = computed<boolean>(() => {
        const claims = this.authStore.claims();
        if (claims && claims['cognito:groups'] && claims['cognito:groups'].includes('Admin')) {
            return true;
        }
        return false;
    });

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [
            {
                id: 1,
                tipo: 'item',
                titulo: 'Configuración',
                icon: 'lucideSettings',
                items: [
                    {
                        id: 11,
                        tipo: 'subitem',
                        icon: 'lucideSend',
                        titulo: 'Tus Destinatarios',
                        url: '/mantenedores/destinatario',
                    },
                ],
            },
        ];

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
                                titulo: 'Template',
                                url: '/administracion/mantenedores/template',
                            },
                            {
                                id: 212,
                                tipo: 'subitem',
                                titulo: 'Categoria Norma',
                                url: '/administracion/mantenedores/categoria-norma',
                            },
                            {
                                id: 213,
                                tipo: 'subitem',
                                titulo: 'Tipo Receptor Notificación',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                            {
                                id: 214,
                                tipo: 'subitem',
                                titulo: 'Tipo Fiscalizador',
                                url: '/administracion/mantenedores/tipo-fiscalizador',
                            },
                            {
                                id: 215,
                                tipo: 'subitem',
                                titulo: 'Tipo Periodicidad',
                                url: '/administracion/mantenedores/tipo-periodicidad',
                            },
                            {
                                id: 216,
                                tipo: 'subitem',
                                titulo: 'Tipo Unidad Tiempo',
                                url: '/administracion/mantenedores/tipo-unidad-tiempo',
                            },
                        ],
                    },
                ],
            });
        }

        return opciones;
    });

    ocultarSidebar() {
        this.sidebarService.toggleSidebar();
    }
}

export interface OpcionMenu {
    id: number;
    tipo: string;
    titulo: string;
    icon?: string;
    url?: string;
    items?: OpcionMenu[];
}
