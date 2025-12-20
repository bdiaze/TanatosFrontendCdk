import { AuthStore } from '@/app/services/auth-store';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import {
    lucideStore,
    lucideChevronRight,
    lucideChevronsUpDown,
    lucideHouse,
    lucideSend,
    lucideSettings,
    lucideCalendarCog,
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink } from '@angular/router';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { NegocioStore } from '@/app/services/negocio-store';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { setCookie } from '@/app/helpers/cookie-helper';
import { ClickOutside } from '@/app/directives/click-outside';

@Component({
    selector: 'app-sidebar',
    imports: [
        HlmSidebarImports,
        HlmCollapsibleImports,
        NgIcon,
        HlmIcon,
        RouterLink,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        ClickOutside,
    ],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
    providers: [
        provideIcons({
            lucideHouse,
            lucideSettings,
            lucideChevronRight,
            lucideSend,
            lucideStore,
            lucideChevronsUpDown,
            lucideCalendarCog,
        }),
    ],
})
export class Sidebar {
    authStore = inject(AuthStore);
    sidebarService = inject(HlmSidebarService);
    negocioStore = inject(NegocioStore);
    negocioDao = inject(NegocioDao);

    sesionIniciada = this.authStore.sesionIniciada;
    accesoAdmin = computed<boolean>(() => {
        const claims = this.authStore.claims();
        if (claims && claims['cognito:groups'] && claims['cognito:groups'].includes('Admin')) {
            return true;
        }
        return false;
    });

    negocioSeleccionado = this.negocioStore.negocioSeleccionado;
    negociosUsuario = this.negocioStore.negociosUsuario;

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [];

        if (this.negocioSeleccionado()) {
            opciones.push({
                id: crypto.randomUUID(),
                tipo: 'group',
                titulo: this.negocioSeleccionado()?.nombre!,
                items: [
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        icon: 'lucideCalendarCog',
                        titulo: 'Tus Tareas',
                        url: '/mantenedores/norma-suscrita',
                    },
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        icon: 'lucideSend',
                        titulo: 'Tus Destinatarios',
                        url: '/mantenedores/destinatario',
                    },
                ],
            });
        }

        opciones.push({
            id: crypto.randomUUID(),
            tipo: 'group',
            titulo: 'General',
            items: [
                {
                    id: crypto.randomUUID(),
                    tipo: 'item',
                    titulo: 'Tus Negocios',
                    icon: 'lucideStore',
                    url: '/mantenedores/negocio',
                },
            ],
        });

        if (this.accesoAdmin()) {
            opciones.push({
                id: crypto.randomUUID(),
                tipo: 'group',
                titulo: 'Administración',
                items: [
                    {
                        id: crypto.randomUUID(),
                        tipo: 'item',
                        titulo: 'Mantenedores',
                        icon: 'lucideSettings',
                        items: [
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Template',
                                url: '/administracion/mantenedores/template',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Categoria Norma',
                                url: '/administracion/mantenedores/categoria-norma',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Receptor Notificación',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Fiscalizador',
                                url: '/administracion/mantenedores/tipo-fiscalizador',
                            },
                            {
                                id: crypto.randomUUID(),
                                tipo: 'subitem',
                                titulo: 'Tipo Periodicidad',
                                url: '/administracion/mantenedores/tipo-periodicidad',
                            },
                            {
                                id: crypto.randomUUID(),
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

    cargandoNegocios = signal<boolean>(true);

    constructor() {
        effect(() => {
            if (this.sesionIniciada()) {
                this.obtenerNegocios();
            }
        });
    }

    ocultarSidebar() {
        this.sidebarService.closeSidebar();
    }

    cambiarNegocio(negocio: SalNegocio) {
        this.negocioSeleccionado.set(negocio);
        setCookie('NegocioSeleccionado', `${negocio.id}`);
    }

    obtenerNegocios() {
        this.cargandoNegocios.set(true);
        this.negocioDao
            .obtenerVigentes()
            .subscribe({})
            .add(() => {
                this.cargandoNegocios.set(false);
            });
    }
}

export interface OpcionMenu {
    id: string;
    tipo: string;
    titulo: string;
    icon?: string;
    url?: string;
    items?: OpcionMenu[];
}
