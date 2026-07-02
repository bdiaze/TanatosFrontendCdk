import { NegocioDao } from '@/app/daos/negocio-dao';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { setCookie } from '@/app/helpers/cookie-helper';
import { MenuHelper } from '@/app/helpers/menu-helper';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { NgClass } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Input, OnInit, Output, untracked, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBlocks,
    lucideCalendarCog,
    lucideCalendarRange,
    lucideChevronRight,
    lucideChevronsUpDown,
    lucideCircleQuestionMark,
    lucideClipboardPaste,
    lucideContactRound,
    lucideCreditCard,
    lucideGem,
    lucideHouse,
    lucideMessageCircleMore,
    lucideSend,
    lucideSettings,
    lucideStore,
    lucideUser,
    lucideUserStar,
    lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-menu',
    imports: [
        NgIcon,
        HlmIcon,
        RouterLink,
        HlmDropdownMenuImports,
        HlmCollapsibleImports,
        HlmSpinnerImports,
        HlmSeparatorImports,
        HlmButtonImports,
        RouterModule,
        HlmSkeletonImports,
        HlmScrollAreaImports,
        HlmTooltipImports,
        NgClass,
    ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    providers: [
        provideIcons({
            lucideX,
            lucideHouse,
            lucideSettings,
            lucideChevronRight,
            lucideSend,
            lucideStore,
            lucideChevronsUpDown,
            lucideCalendarCog,
            lucideClipboardPaste,
            lucideCalendarRange,
            lucideBlocks,
            lucideUser,
            lucideMessageCircleMore,
            lucideCreditCard,
            lucideGem,
            lucideContactRound,
            lucideCircleQuestionMark,
        }),
    ],
})
export class Menu implements OnInit {
    @Output() postClickItem = new EventEmitter<void>();

    @Input() withClose = false;
    @Input() estatico = false;
    @Output() postCerrarMenu = new EventEmitter<void>();

    private readonly router = inject(Router);

    authStore = inject(AuthStore);
    negocioStore = inject(NegocioStore);
    negocioDao = inject(NegocioDao);

    menuHelper = inject(MenuHelper);

    accesoAdmin = computed<boolean>(() => {
        const groups = this.authStore.groups();
        if (groups.has('Admin')) {
            return true;
        }
        return false;
    });

    opcionesMenu = computed<OpcionMenu[]>(() => {
        const opciones: OpcionMenu[] = [];

        if (this.negocioStore.negocioSeleccionado()) {
            opciones.push({
                id: 'group-negocio-seleccionado',
                tipo: 'group',
                titulo: this.negocioStore.negocioSeleccionado()?.nombre!,
                items: [
                    {
                        id: 'group-negocio-seleccionado-item-inicio',
                        tipo: 'item',
                        icon: 'lucideBlocks',
                        titulo: 'Inicio',
                        url: '/inicio',
                    },
                    {
                        id: 'group-negocio-seleccionado-item-mi-calendario',
                        tipo: 'item',
                        icon: 'lucideCalendarRange',
                        titulo: 'Mi Calendario',
                        url: '/mi-calendario',
                    },
                    {
                        id: 'group-negocio-seleccionado-item-mis-obligaciones',
                        tipo: 'item',
                        icon: 'lucideCalendarCog',
                        titulo: 'Mis Obligaciones',
                        url: '/mis-obligaciones',
                    },
                    {
                        id: 'group-negocio-seleccionado-item-plantillas-inscritas',
                        tipo: 'item',
                        titulo: 'Plantillas Inscritas',
                        icon: 'lucideClipboardPaste',
                        url: '/plantillas-inscritas',
                    },
                    {
                        id: 'group-negocio-seleccionado-item-mi-equipo',
                        tipo: 'item',
                        icon: 'lucideContactRound',
                        titulo: 'Mi Equipo',
                        url: '/mi-equipo',
                    },
                ],
            });
        }

        opciones.push({
            id: 'group-general',
            tipo: 'group',
            titulo: 'General',
            items: [
                {
                    id: 'group-general-item-mis-negocios',
                    tipo: 'item',
                    titulo: 'Mis Negocios',
                    icon: 'lucideStore',
                    url: '/mis-negocios',
                },
                {
                    id: 'group-general-item-mi-plan',
                    tipo: 'item',
                    titulo: 'Mi Plan',
                    icon: 'lucideGem',
                    url: '/mi-plan',
                },
                {
                    id: 'group-general-item-ayuda',
                    tipo: 'item',
                    titulo: 'Ayuda',
                    icon: 'lucideCircleQuestionMark',
                    url: '/ayuda',
                },
            ],
        });

        if (this.accesoAdmin()) {
            opciones.push({
                id: 'group-administracion',
                tipo: 'group',
                titulo: 'Administración',
                items: [
                    {
                        id: 'group-administracion-item-servicio-cliente',
                        tipo: 'item',
                        titulo: 'Servicio Cliente',
                        icon: 'lucideUser',
                        items: [
                            {
                                id: 'group-administracion-item-servicio-cliente-subitem-chats-whatsapp',
                                tipo: 'subitem',
                                titulo: 'Whatsapp',
                                icon: 'lucideMessageCircleMore',
                                url: '/administracion/servicio-cliente/chats-whatsapp',
                            },
                        ],
                    },
                    {
                        id: 'group-administracion-item-mantenedores',
                        tipo: 'item',
                        titulo: 'Mantenedores',
                        icon: 'lucideSettings',
                        items: [
                            {
                                id: 'group-administracion-item-mantenedores-subitem-pregunta-frecuente',
                                tipo: 'subitem',
                                titulo: 'Preguntas Frecuentes',
                                url: '/administracion/mantenedores/preguntas-frecuentes',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-video-tutorial',
                                tipo: 'subitem',
                                titulo: 'Videos Tutoriales',
                                url: '/administracion/mantenedores/videos-tutoriales',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-plan',
                                tipo: 'subitem',
                                titulo: 'Planes',
                                url: '/administracion/mantenedores/plan',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-plantillas',
                                tipo: 'subitem',
                                titulo: 'Plantillas',
                                url: '/administracion/mantenedores/template',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-categoria-norma',
                                tipo: 'subitem',
                                titulo: 'Categoria Norma',
                                url: '/administracion/mantenedores/categoria-norma',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-rubro',
                                tipo: 'subitem',
                                titulo: 'Tipo Rubro',
                                url: '/administracion/mantenedores/tipo-rubro',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-actividad',
                                tipo: 'subitem',
                                titulo: 'Tipo Actividad',
                                url: '/administracion/mantenedores/tipo-actividad',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-destinatario',
                                tipo: 'subitem',
                                titulo: 'Tipo Destinatario',
                                url: '/administracion/mantenedores/tipo-receptor-notificacion',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-fiscalizador',
                                tipo: 'subitem',
                                titulo: 'Tipo Fiscalizador',
                                url: '/administracion/mantenedores/tipo-fiscalizador',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-periodicidad',
                                tipo: 'subitem',
                                titulo: 'Tipo Periodicidad',
                                url: '/administracion/mantenedores/tipo-periodicidad',
                            },
                            {
                                id: 'group-administracion-item-mantenedores-subitem-tipo-unidad-tiempo',
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

    url = toSignal(
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => this.router.url),
        ),
        { initialValue: this.router.url },
    );

    groupsAbiertos = new Set<string>([]);

    constructor() {
        effect(() => {
            const url = this.url();
            const opciones = this.opcionesMenu();

            untracked(() => {
                for (const item of opciones) {
                    if (item.tipo === 'item' && this.tieneUrlHijoActivo(item, url)) {
                        this.groupsAbiertos.add(item.id);
                    } else if (item.tipo === 'group' && item.items) {
                        for (const item2 of item.items) {
                            if (this.tieneUrlHijoActivo(item2, url)) {
                                this.groupsAbiertos.add(item2.id);
                            }
                        }
                    }
                }
            });
        });
    }

    ngOnInit() {
        this.menuHelper.ejecutar();
    }

    tieneUrlHijoActivo(opcion: OpcionMenu, url: string) {
        if (opcion.tipo === 'item' && opcion.items?.some((subitem) => subitem.url === url)) {
            return true;
        }
        return false;
    }

    itemCollapsibleChange(groupId: string, isOpen: boolean) {
        if (isOpen) {
            this.groupsAbiertos.add(groupId);
        } else {
            this.groupsAbiertos.delete(groupId);
        }
    }

    estaAbierto(groupId: string) {
        return this.groupsAbiertos.has(groupId);
    }

    @ViewChild('dropdownTrigger', { read: CdkMenuTrigger }) dropdownTrigger?: CdkMenuTrigger;
    cambiarNegocio(negocio: SalNegocio) {
        this.negocioStore.negocioSeleccionado.set(negocio);
        setCookie('NegocioSeleccionado', `${negocio.id}`);
        this.dropdownTrigger?.close();
    }

    cargandoNegocios = this.menuHelper.cargandoNegocios;

    restringirSeleccionNegocios = computed(() => {
        const tienePlanEmpresa = this.negocioStore.informacionUsuario()?.tienePlanEmpresa ?? false;
        const negocios = this.negocioStore.negociosUsuario();
        if (negocios.length > 0 && !tienePlanEmpresa) {
            return true;
        }
        return false;
    });

    cargandoInformacionUsuario = this.menuHelper.cargandoInformacionUsuario;

    click() {
        this.postClickItem.emit();
    }

    cerrar() {
        this.postCerrarMenu.emit();
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
